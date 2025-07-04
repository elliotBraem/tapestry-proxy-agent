import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import dotenv from 'dotenv';

// Import routes
import ethAccount from './routes/ethAccount.js';
import workerAccount from './routes/workerAccount.js';
import transaction from './routes/transaction.js';

// Load environment variables
dotenv.config();

const app = new Hono();

// Health check
app.get('/', (c) => c.json({ message: 'Shade Agent App' }));

// Routes
app.route('/api/eth-account', ethAccount);
app.route('/api/worker-account', workerAccount);
app.route('/api/transaction', transaction);

// Start the server
const port = process.env.PORT || 3000;

console.log(`App is running on port ${port}`);

serve({ fetch: app.fetch, port }); 