import Stripe from 'stripe';
import { AppConstants } from '../../constant/appConstants.js';
import { StatusCodes } from '../../constant/statusCodes.js';
import { CommonResponse } from '../../constant/commonResponse.js';
import { MESSAGES } from '../../constant/messages.js';
import Payments from '../../models/Payments.js';
import userModel from '../../models/Users.js';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const checkOutSession = async (req, res) => {
  const userId = req.user.id;
  const cartItems = req.body;

  const { stripeCustomerId } = await userModel.findOne({ _id: userId });
  const SUCCESS_URL = `http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}`;
  const CANCEL_URL = "http://localhost:3000/payment/cancel";

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    line_items: cartItems.map((item) => {
      return {
        price_data: {
          currency: AppConstants.Stripe_Currency_IsoCodes.India,
          unit_amount: item.product.price * 100,
          product: item.product.stripeProductId,
        },
        quantity: item.quantity,
      }
    }),

    mode: AppConstants.SessionModes.Payment,
    success_url: SUCCESS_URL,
    cancel_url: CANCEL_URL,
  });

  const newPayment = await Payments.create({
    sessionId: session.id,
    userId: userId,
    amountTotal: session.amount_total,
    paymentStatus: session.payment_status,
    sessionStatus: session.status,
    paymentMode: session.mode,
  })

  res.status(StatusCodes.OK).json(CommonResponse.Success({ "sessionUrl": session.url, "sessionId": session.id }, MESSAGES.PAYMENT.SESSION_CREATED));
}

export const updateCheckOutSession = async (req, res, next) => {
  try {
    // const { userId } = req.user.id;
    const { sessionId } = req.query;

    const sessionObject = await stripe.checkout.sessions.retrieve(sessionId);

    await Payments.findOneAndUpdate({ sessionId }, {
      $set: {
        paymentStatus: sessionObject.payment_status,
        amountTotal: sessionObject.amount_total,
        sessionStatus: sessionObject.status,
        paymentIntentId: sessionObject.payment_intent,
        paymentMode: sessionObject.mode,
        paymentMethodTypes: sessionObject.payment_method_types,
        customerEmail: sessionObject.customer_details.email,
      }
    })

    const sessionLineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 100,
    });

    const orderItems = {
      amountTotal: sessionObject.amount_total,
      items: sessionLineItems.data.map((item) => {
        return {
          stripeProductId: item.price.product,
          name: item.description,
          price: item.price.unit_amount,
          quantity: item.quantity,
        }
      })
    }

    const updatedPaymentDetails = await Payments.findOne({ sessionId });

    // res.status(StatusCodes.OK).json(CommonResponse.Success({ updatedPaymentDetails, orderItems }, MESSAGES.PAYMENT.SESSION_RETRIEVED))

    req.body = { ...req.body, updatedPaymentDetails, orderItems };

    console.log('req.body', req.body);

    next();
  } catch (error) {
    next(error);
  }
}

export const checkOutPaymentDetails = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { sessionId } = req.query;
    const sessionObject = await stripe.checkout.sessions.retrieve(sessionId);
    const sessionLineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 100,
    });

    // next();
    res.status(StatusCodes.OK).json(CommonResponse.Success({ sessionObject, sessionLineItems }, MESSAGES.PAYMENT.SESSION_RETRIEVED));
  }
  catch (error) {
    next(error);
  }
}
