import { CommonResponse } from "../../constant/commonResponse.js";
import { MESSAGES } from "../../constant/messages.js";
import { StatusCodes } from "../../constant/statusCodes.js";
import Subscriptions from "../../models/Subscriptions.js";
import { stripe_cancel_subscription } from "../../service/subscriptionPaymentService.js";
import { AppConstants } from "../../constant/appConstants.js";
import userModel from "../../models/Users.js";
import ejs from "ejs";
import path from 'path';
import { fileURLToPath } from "url";
import cron from "cron";
import Stripe from "stripe";
import Payments from "../../models/Payments.js";
import transporter, { mailOptionsHelper } from "../../config/nodemailer.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// checkout session for subscription
export const subscription_create_checkout_session = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const subscriptionItems = req.body;

    const { stripeCustomerId } = await userModel.findOne({ _id: userId });


    const subscriptionsForUser = await Subscriptions.find({ userId, subscriptionStatus: "active" });

    if (subscriptionsForUser.length) {
      return res.status(StatusCodes.CONFLICT).json(CommonResponse.Conflict(MESSAGES.SUBSCRIPTION.ALREADY_CREATED));
    }

    const price = await stripe.prices.list({
      lookup_keys: [subscriptionItems.lookup_key],
      expand: ['data.product']
    })

    const SUCCESS_URL = `http://localhost:3000/subscriptions/payment/success?session_id={CHECKOUT_SESSION_ID}`;
    const CANCEL_URL = "http://localhost:3000/subscriptions/payment/cancel";

    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: price.data[0].id,
          quantity: 1,
        }
      ],
      payment_method_types: ["card"],
      mode: AppConstants.SessionModes.Subscription,
      success_url: SUCCESS_URL,
      cancel_url: CANCEL_URL,
    });

    const newPayment = await Payments.create({
      sessionId: session.id,
      userId: userId,
      amountTotal: session.amount_total,
      paymentStatus: session.payment_status,
      paymentMode: session.mode,
      sessionStatus: session.status,
    })

    res.status(StatusCodes.CREATED).json(CommonResponse.Created({ sessionUrl: session.url, sessionId: session.id }, MESSAGES.PAYMENT.SESSION_CREATED));

  } catch (error) {
    next(error);
  };
}

// update checkout session when payment success or cancel
export const subscription_update_checkout_session = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.query;

    const sessionObject = await stripe.checkout.sessions.retrieve(sessionId);

    await Payments.findOneAndUpdate({ sessionId }, {
      $set: {
        paymentStatus: sessionObject.payment_status,
        amountTotal: sessionObject.amount_total,
        sessionStatus: sessionObject.status,
        paymentIntentId: sessionObject.payment_intent,
        paymentMethodTypes: sessionObject.payment_method_types,
        paymentMode: sessionObject.mode,
        customerEmail: sessionObject.customer_details.email,
      }
    })

    const sessionLineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
      limit: 100,
    });

    const items = sessionLineItems.data[0];

    const subscriptionObject = await stripe.subscriptions.retrieve(sessionObject.subscription);

    const subscriptionItems = {
      subscriptionId: subscriptionObject.id,
      subscriptionStatus: subscriptionObject.status,

      name: items.description,
      amount: items.amount_total,
      interval: items.price.recurring.interval,
      interval_count: items.price.recurring.interval_count,
      stripeCustomerId: sessionObject.customer,
      stripeProductId: items.price.product,
      stripePriceId: items.price.id,
    }

    const updatedPaymentDetails = await Payments.findOne({ sessionId });

    req.body = { ...req.body, updatedPaymentDetails, subscriptionItems };

    next();

  } catch (error) {
    next(error);
  }
};

// creating a subscription in database
export const create_subscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { sessionId } = req.query;
    const { updatedPaymentDetails, subscriptionItems } = req.body;

    console.log("updatePaymentDetails", updatedPaymentDetails);
    console.log("userId", userId);
    console.log("paymentDetails", subscriptionItems);

    if (String(updatedPaymentDetails.userId) !== userId || updatedPaymentDetails.sessionId !== sessionId) {
      return res.status(StatusCodes.BAD_REQUEST).json(CommonResponse.Bad_Request(MESSAGES.SUBSCRIPTION.USER_NOT_MATCHING));
    }

    if (updatedPaymentDetails.sessionStatus !== "open" && updatedPaymentDetails.paymentStatus !== "paid") {
      return res.status(StatusCodes.BAD_REQUEST).json(CommonResponse.Bad_Request(MESSAGES.PAYMENT.NOT_PAID));
    }

    const subscriptionAlreadyCreated = await Subscriptions.find({ paymentId: updatedPaymentDetails._id });
    if (subscriptionAlreadyCreated.length) {
      return res.status(StatusCodes.CONFLICT).json(CommonResponse.Conflict(MESSAGES.SUBSCRIPTION.ALREADY_CREATED));
    }

    const subscriptionsForUser = await Subscriptions.find({ userId, subscriptionStatus: "active" });

    if (subscriptionsForUser.length) {
      return res.status(StatusCodes.CONFLICT).json(CommonResponse.Conflict(MESSAGES.SUBSCRIPTION.ALREADY_CREATED));
    }

    const user = await userModel.findOne({ _id: userId });

    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const templatePath = path.join(__dirname, "../../utils/templates/subscriptionCreated.ejs");

    const html = await ejs.renderFile(templatePath, {
      user: user,
      paymentDetails: updatedPaymentDetails,
      subscriptionItems: subscriptionItems
    });

    const mailOptions = mailOptionsHelper(
      process.env.SENDER_EMAIL,
      user.email,
      MESSAGES.NODEMAILER.SUBSCRIPTION.SUBJECT,
      html,
    )

    await transporter.sendMail(mailOptions);

    // const task = async () => {
    //   await transporter.sendMail(mailOptions)
    // }

    // const job = cron.CronJob.from({
    //   cronTime: "0 9 */3 * *",
    //   onTick: task,
    //   start: true,
    //   // timeZone: 
    // })

    const createSubscriptionInDB = await Subscriptions.create({
      userId,
      paymentsId: updatedPaymentDetails._id,
      ...subscriptionItems,
    })

    if (!createSubscriptionInDB) {
      return res.status(StatusCodes.BAD_REQUEST).json(CommonResponse.Bad_Request(MESSAGES.SUBSCRIPTION.NOT_CREATED));
    }

    res.status(StatusCodes.CREATED).json(CommonResponse.Created(createSubscriptionInDB, MESSAGES.SUBSCRIPTION.CREATED));

  } catch (error) {
    next(error);
  }
}

// Cancel a subscription
export const cancel_subscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { subscriptionId } = req.query;

    const cancelSubscriptionObject = await stripe_cancel_subscription(subscriptionId);

    await Subscriptions.findOneAndUpdate({ userId, subscriptionId }, {
      subscriptionStatus: cancelSubscriptionObject.status,
    })

    const subscription = await Subscriptions.findOne({ userId, subscriptionId });

    res.status(StatusCodes.OK).json(CommonResponse.Success(subscription, MESSAGES.SUBSCRIPTION.CANCELED));

  } catch (error) {
    next(error);
  }
}

// Fetch Subscription
export const fetchSubscription = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const subscription = await Subscriptions.findOne({ userId, subscriptionStatus: "active" }).sort({ createdAt: -1 });

    res.status(StatusCodes.OK).json(CommonResponse.Success(subscription, MESSAGES.SUBSCRIPTION.FETCH));
  }
  catch (error) {
    next(error);
  }
}




// // Pause Subscription 
// export const pause_subscription = async (req, res, next) => {
//   try {
//     const userId = req.user.id;
//     const { subscriptionId } = req.query;

//     // const pauseSubscriptionObject = await stripe_pause_subs
//   }
//   catch (error) {
//     next(error);
//   }
// }