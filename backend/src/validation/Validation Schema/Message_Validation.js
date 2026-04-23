import { roomId_validator, senderId_validator, senderName_validator, text_validator } from "../validators.js";
import Joi from "joi";

// MESSAGES
// Create message
export const createMessages_validation_schema = Joi.object({
  roomId: roomId_validator,
  senderId: senderId_validator,
  senderName: senderName_validator,
  text: text_validator,
  isRead: Joi.boolean(),
})
