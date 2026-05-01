import express, { raw } from 'express';
import Stripe from 'stripe';
import Payments from '../../models/Payments.js';
import { StatusCodes } from '../../constant/statusCodes.js';
import { MESSAGES } from '../../constant/messages.js';
import { CommonResponse } from '../../constant/commonResponse.js';
import { AppConstants } from '../../constant/appConstants.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const webhookController = async (req, res) => {

  // Verify Webhook Event
  let event;
  if (endpointSecret) {
    const signature = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
      res.status(StatusCodes.OK).json(CommonResponse.Success(event));

    }
    catch (error) {
      console.error(MESSAGES.WEBHOOK.EVENT_VERIFICATION_FAILED, error.message);
      return res.status(StatusCodes.BAD_REQUEST).json(CommonResponse.Bad_Request({}, error.message));
    }
  }

  if (!event) {
    return res.status(StatusCodes.BAD_REQUEST).json(CommonResponse.Bad_Request({}, MESSAGES.WEBHOOK.EVENT_VERIFICATION_FAILED));
  }

  const PORT = process.env.PORT || 5000;

  // event handlers
  switch (event.type) {

    // checkout.session.completed
    case AppConstants.WebhookEventTypes.CheckoutSessionCompleted:
      const sessionObject = event.data.object;
      const sessionId = sessionObject.id;

      // mode: payment
      if (sessionObject.mode == AppConstants.SessionModes.Payment) {
        const URL = `http://localhost:${PORT}/api/payment/update-checkout-session?sessionId=${sessionId}`;

        await fetch(URL, {
          method: 'PUT',
        }).catch(err => console.error("Fetch Error (Payment):", err.message));
      }

      // mode: subscription
      else if (sessionObject.mode == AppConstants.SessionModes.Subscription) {
        const URL = `http://localhost:${PORT}/api/subscriptions/update-checkout-session?sessionId=${sessionId}`;

        await fetch(URL, {
          method: 'PUT',
        }).catch(err => console.error("Fetch Error (Subscription):", err.message));
      }

      break;

    // customer.subscription.updated
    case AppConstants.WebhookEventTypes.CustomerSubscriptionUpdated:
      const subscriptionObject = event.data.object;
      const URL = `http://localhost:${PORT}/api/subscriptions/updateSubscription`;

      await fetch(URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscriptionObject: subscriptionObject,
        })
      }).catch(errror => console.error("Error calling updateSubscription API:", error.message));

      break;

    // NOTA
    default:
      console.log(`Unhandled event type ${event.type}`);

  }
};