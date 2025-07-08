import 'dotenv/config';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { verify } from 'near-sign-verify';
import { protectedRoutes, publicRoutes } from './routes/v1';

type Variables = {
  accountId: string,
};

const app = new Hono<{ Variables: Variables }>();

app.use('*', logger());

protectedRoutes.use('*', async (c, next) => {
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

app.route('/v1', publicRoutes);
app.route('/v1', protectedRoutes);

app.get('/', (c) => {
  return c.text(`Shade Agent: ${process.env.NEXT_PUBLIC_contractId}`);
});

const port = 3000;
console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
