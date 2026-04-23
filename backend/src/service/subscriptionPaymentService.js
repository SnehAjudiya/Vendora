import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripe_cancel_subscription = async (subscriptionId) => {
  const cancelSubscription = await stripe.subscriptions.cancel(subscriptionId);

  return cancelSubscription;
}