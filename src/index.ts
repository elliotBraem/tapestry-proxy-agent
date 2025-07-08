import 'dotenv/config';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { verify } from 'near-sign-verify';
// import { protectedRoutes, publicRoutes } from './routes/v1';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const UPSTREAM_API_BASE_URL =
  process.env.UPSTREAM_API_BASE_URL || "https://api.usetapestry.dev/api/v1";
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY;

type Variables = {
  accountId: string,
};

const app = new Hono<{ Variables: Variables }>();

app.use('*', logger());

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

app.get('/', (c) => {
  return c.text(`Shade Agent: ${process.env.NEXT_PUBLIC_contractId}`);
});

// --- Middleware: Forward `?apiKey=` to tapestry ---
app.all("*", async (c) => {
  // Ensure INTERNAL_API_KEY is available
  if (!INTERNAL_API_KEY) {
    console.error("INTERNAL_API_KEY is not set in environment.");
    return c.json({ error: "Server configuration error" }, 500);
  }

  const url = new URL(c.req.url); // Parse the incoming URL from the client
  const incomingPath = url.pathname; // e.g., /profiles/findOrCreate
  const incomingQuery = url.search; // e.g., ?param1=value1&param2=value2 (may be empty)

  // Construct the new query string, adding the INTERNAL_API_KEY
  let newQuery = incomingQuery;
  if (newQuery.length === 0) {
    newQuery = `?apiKey=${INTERNAL_API_KEY}`;
  } else {
    // If there are existing query params, append the apiKey
    newQuery = `${newQuery}&apiKey=${INTERNAL_API_KEY}`;
  }

  // Construct the target URL for the upstream API with the injected apiKey
  const targetUrl = `${UPSTREAM_API_BASE_URL}${incomingPath}${newQuery}`;

  console.log(`Proxying: ${c.req.method} ${incomingPath}${incomingQuery} -> ${targetUrl}`);

  try {
    const headers = new Headers(c.req.raw.headers);
    // Remove the incoming Authorization header (already verified)
    headers.delete("Authorization");

    const fetchOptions: BunFetchRequestInit = {
      method: c.req.method,
      headers: headers,
      // Pass the original request body for non-GET/HEAD requests
      body: JSON.stringify({ test: "data" }),
      tls: {
        rejectUnauthorized: false
      }
      // body: c.req.method !== "GET" && c.req.method !== "HEAD" ? c.req.raw.body : undefined,
      // rejectUnauthorized: false as any,
      // signal: AbortSignal.timeout(15000) // 15 second timeout
    };

    const upstreamResponse = await fetch(targetUrl, fetchOptions);

    const responseHeaders = new Headers();
    upstreamResponse.headers.forEach((value, name) => {
      responseHeaders.set(name, value);
    });

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers: responseHeaders,
    });

  } catch (error: any) {
    console.error("Proxying failed:", error.message);
    return c.json({ error: "Proxying failed or upstream unavailable" }, 500);
  }
});

// app.route('/v1', publicRoutes);
// app.route('/v1', protectedRoutes);


const port = 3000;
console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
