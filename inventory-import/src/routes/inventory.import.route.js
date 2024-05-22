import { Router } from 'express';

import {inventoryHandler} from '../controllers/inventory.import.controller.js';

const inventoryImportRouter = Router();

inventoryImportRouter.post('/inventory', inventoryHandler);

export default inventoryImportRouter;
