import express from 'express';
import { createMessages, fetchMessages } from '../controllers/Chat/messageController.js';
import userAuth from '../middleware/userAuth.js';
import { validationHandler } from '../middleware/validationHandler.js';
import { createMessages_validation_schema } from '../validation/Validation Schema/Message_Validation.js';

const messageRouter = express.Router();

messageRouter
  .route('/')

  // Fetch for a roomId
  .get(userAuth, fetchMessages)

  // Create messages
  .post(userAuth, validationHandler(createMessages_validation_schema), createMessages);

export default messageRouter;