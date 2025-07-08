import { Hono } from 'hono';
import transactions from './transactions';
import worker from './worker';

export type Variables = {
  accountId: string,
};

const protectedRoutes = new Hono<{ Variables: Variables }>();
protectedRoutes.route('/transactions', transactions);

const publicRoutes = new Hono();
publicRoutes.route('/worker', worker);

export { protectedRoutes, publicRoutes };
