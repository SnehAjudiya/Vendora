import { MESSAGES } from "../../constant/messages.js";
import { StatusCodes } from "../../constant/statusCodes.js";
import Messages from "../../models/Messages.js"
import { CommonResponse } from "../../constant/commonResponse.js";

// Fetch messages
export const fetchMessages = async (req, res, next) => {
  try {
    const { roomId, fetcherId } = req.query;

    // set is read for messages received
    await Messages.updateMany({ roomId, senderId: { $ne: fetcherId } }, { $set: { isRead: true } });
    // fetch all messages
    const messages = await Messages.find({ roomId }).sort({ createdAt: 1 });

    res.status(StatusCodes.OK).json(CommonResponse.Success(messages, MESSAGES.MESSAGE.FETCH));
  } catch (error) {
    next(error);
  }
}

// Create messages
export const createMessages = async (req, res, next) => {
  try {
    const { roomId, senderId, senderName, text, isRead } = req.body;
    const { id } = req.user;

    if (senderId !== id)
      return res.status(StatusCodes.BAD_REQUEST).json(CommonResponse.Bad_Request({}, MESSAGES.MESSAGE.SENDER_NOT_VALID))

    const newMessage = await Messages.create({
      roomId, senderId, senderName, text, isRead
    });

    res.status(StatusCodes.OK).json(CommonResponse.Success(newMessage, MESSAGES.MESSAGE.CREATED));

  } catch (error) {
    next(error);

  }
}

