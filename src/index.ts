import 'dotenv/config';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import v1 from './routes/v1';

const app = new Hono();

app.use('*', logger());

app.route('/v1', v1);

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

const port = 3000;
console.log(`Server is running on port ${port}`);

export default {
  port,
  fetch: app.fetch,
};
