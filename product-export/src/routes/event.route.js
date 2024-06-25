import { Router } from 'express';

import { productPublishedHandler } from '../controllers/product-published.event.controller.js';

const eventRouter = Router();

eventRouter.post('/', productPublishedHandler);

export default eventRouter;
