import Orders from '../../models/Orders.js';
import { StatusCodes } from '../../constant/statusCodes.js';
import { MESSAGES } from '../../constant/messages.js';
import { CommonResponse } from '../../constant/commonResponse.js';
import Payments from '../../models/Payments.js';

// Fetch all orders 
export const fetchOrders = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const orders = await Orders.find({ userId }).sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json(CommonResponse.Success(orders, MESSAGES.ORDER.FETCH_ALL));

  } catch (error) {
    next(error);
  }
}

// Create new order 
// when payment is done 
export const createOrder = async (req, res, next) => {
  try {
    const { sessionId } = req.query;
    const { updatedPaymentDetails, orderItems } = req.body;

    console.log('sessionId', sessionId)
    console.log('req.body', req.body)

    const userId = updatedPaymentDetails.userId;

    // console.log('updatedPaymentDetails.userId', updatedPaymentDetails.userId)
    // console.log('userId', userId)
    // console.log('updatedPaymentDetails.sessionId', updatedPaymentDetails.sessionId)
    // console.log('sessionId', sessionId)

    if (updatedPaymentDetails.sessionId !== sessionId) {
      return res.status(StatusCodes.BAD_REQUEST).json(CommonResponse.Bad_Request(MESSAGES.ORDER.USER_NOT_MATCHING));
    }

    if (updatedPaymentDetails.sessionStatus !== "open" && updatedPaymentDetails.paymentStatus !== "paid") {
      return res.status(StatusCodes.BAD_REQUEST).json(CommonResponse.Bad_Request(MESSAGES.PAYMENT.NOT_PAID));
    }

    const orderAlreadyCreated = await Orders.find({ paymentId: updatedPaymentDetails._id });
    if (orderAlreadyCreated.length) {
      return res.status(StatusCodes.CONFLICT).json(CommonResponse.Conflict(MESSAGES.ORDER.ALREADY_CREATED));
    }

    const createOrderInDB = await Orders.create({
      userId,
      paymentId: updatedPaymentDetails._id,
      items: orderItems.items,
      amountTotal: orderItems.amountTotal,
    });

    if (!createOrderInDB) {
      return res.status(StatusCodes.BAD_REQUEST).json(CommonResponse.Bad_Request(MESSAGES.ORDER.NOT_CREATED));
    }

    res.status(StatusCodes.OK).json(CommonResponse.Success(createOrderInDB, MESSAGES.ORDER.CREATED));
  } catch (error) {
    next(error);
  }
}