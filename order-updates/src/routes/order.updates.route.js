import { Router } from 'express';

import { orderUpdatesHandler } from '../controllers/order.updates.controller.js';

const orderUpdatesRouter = Router();

orderUpdatesRouter.post('/order-updates', orderUpdatesHandler);

export default orderUpdatesRouter;
