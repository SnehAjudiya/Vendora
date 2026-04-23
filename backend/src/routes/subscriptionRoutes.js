import express from 'express';
import userAuth from '../middleware/userAuth.js';
import allowRoles from '../middleware/allowRoles.js';
import { AppConstants } from '../constant/appConstants.js';
import {
  cancel_subscription,
  subscription_create_checkout_session,
  subscription_update_checkout_session,
  fetchSubscription,
  create_subscription
}
  from '../controllers/Subscription/subscriptionController.js';

const subscriptionRouter = express.Router();

// Subscription Checkout Session - Create
subscriptionRouter.route("/create-checkout-session").post(userAuth, allowRoles([AppConstants.Role.Customer]), subscription_create_checkout_session);

// Subscription Checkout Session - Update && Create Subscription
subscriptionRouter.route("/update-checkout-session").put(userAuth, allowRoles([AppConstants.Role.Customer]), subscription_update_checkout_session, create_subscription);

// Fetch Subscription
subscriptionRouter.route("/fetch-subscription").get(userAuth, allowRoles([AppConstants.Role.Customer]), fetchSubscription);

// Cancel Subscription
subscriptionRouter.route("/cancel-subscription").put(userAuth, allowRoles([AppConstants.Role.Customer]), cancel_subscription);

export default subscriptionRouter;