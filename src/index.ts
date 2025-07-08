import 'dotenv/config';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { proxy } from 'hono/proxy';
import { verify } from 'near-sign-verify';
import { solanaAdapter } from './chains/sol/adapter';
import { protectedRoutes, publicRoutes } from './routes/v1';

const UPSTREAM_API_BASE_URL =
  process.env.UPSTREAM_API_BASE_URL || "https://api.usetapestry.dev/api/v1";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

type Variables = {
  accountId: string,
};

const app = new Hono<{ Variables: Variables }>();

app.use('*', logger());

app.get('/', (c) => {
  return c.text(`Shade Agent: ${process.env.NEXT_PUBLIC_contractId}`);
});
app.route('/v1', publicRoutes);

app.use('*', async (c, next) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const authToken = authHeader.substring(7);

  try {
    const result = await verify(authToken, {
      expectedRecipient: process.env.NEXT_PUBLIC_contractId,
      nonceMaxAge: 300000,
    });

    console.log('Successfully verified for account:', result.accountId);
    c.set('accountId', result.accountId);
  } catch (error: any) {
    console.error('Token verification failed:', error.message);
    return c.json({ error: 'Token verification failed' }, 401);
  }

  await next();
});

app.route('/v1', protectedRoutes);

// --- Middleware: Forward `?apiKey=` to tapestry ---
app.all("*", async (c) => {
  // Ensure INTERNAL_API_KEY is available
  if (!INTERNAL_API_KEY) {
    console.error("INTERNAL_API_KEY is not set in environment.");
    return c.json({ error: "Server configuration error" }, 500);
  }

  const url = new URL(c.req.url);
  const incomingPath = url.pathname;
  const incomingQuery = url.search;

  let newQuery = incomingQuery;
  if (newQuery.length === 0) {
    newQuery = `?apiKey=${INTERNAL_API_KEY}`;
  } else {
    newQuery = `${newQuery}&apiKey=${INTERNAL_API_KEY}`;
  }

  const targetUrl = `${UPSTREAM_API_BASE_URL}${incomingPath}${newQuery}`;
  console.log(`Proxying: ${c.req.method} ${incomingPath}${incomingQuery} -> ${targetUrl}`);

  const upstreamUrl = new URL(UPSTREAM_API_BASE_URL);

  let body: string | undefined;
  const headers: Record<string, string | undefined> = {
    ...c.req.header(),
    Host: upstreamUrl.hostname,
    Origin: undefined,
    Authorization: undefined,
  };

  if (c.req.method !== "GET" && c.req.method !== "HEAD") {
    const originalBody = await c.req.json();
    const accountId = c.get('accountId');
    const { address } = await solanaAdapter.deriveAddress(accountId);
    
    body = JSON.stringify({
      ...originalBody,
      walletAddress: address,
      blockchain: 'SOLANA',
    });
    headers['content-type'] = 'application/json';
  }

  return proxy(targetUrl, {
    method: c.req.method,
    headers,
    body,
  });
});


const port = 3000;
console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
