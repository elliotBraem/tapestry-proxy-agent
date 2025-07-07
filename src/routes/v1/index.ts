import { Hono } from 'hono';
import transactions from './transactions';
import worker from './worker';

const app = new Hono();

app.route('/transactions', transactions);
app.route('/worker', worker);

export default app;
