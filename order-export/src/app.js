import 'dotenv/config';

import express from 'express';
import bodyParser from 'body-parser';

// Import routes
import EventRoutes from './routes/event.route.js';

// Create the express app
const app = express();

// Define configurations
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.use('/order-export', EventRoutes);

export default app;
