import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);


// Stripe Create Product
export const stripe_create_customer = async (user) => {

  const customer = await stripe.customers.create({
    name: user.name,
    email: user.email,
  })

  return customer.id;
}
