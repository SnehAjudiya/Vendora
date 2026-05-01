import express from 'express';
import { webhookController } from '../controllers/Webhooks/webhookController.js';

const webhookRouter = express.Router();

webhookRouter.post('/', express.raw({ type: 'application/json' }), webhookController);

export default webhookRouter;