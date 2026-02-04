import 'dotenv/config';

import express from 'express';
import bodyParser from 'body-parser';

// Import routes
import orderUpdatesRouter from './routes/order.updates.route.js';

// Create the express app
const app = express();

// Define configurations
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

// Define routes
app.use('/', orderUpdatesRouter);

export default app;
