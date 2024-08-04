import Stripe from "stripe";
import clientPromise from "./mongodb";

export const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY));

export async function hasSubscription(email) {
  // check if the authenticated user has an active subscription
  try {
    const db = (await clientPromise).db();
    const user = await db.collection("users").findOne({ email: email });

    const subscriptions = await stripe.subscriptions.list({
      customer: String(user?.stripeCustomerId),
    });

    const planId = subscriptions.data[0].plan.product;
    const plan = await stripe.products.retrieve(planId);

    return { hasSub: subscriptions.data.length > 0, plan: plan };
  } catch (error) {
    return false;
  }
}

export async function generateCustomerPortalLink(email) {
  // generate a stripe payment management portal link for the authenticated user
  try {
    const db = (await clientPromise).db();
    const user = await db.collection("users").findOne({ email: email });

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: String(user?.stripeCustomerId),
      return_url: process.env.NEXT_BASE_URL,
    });

    return portalSession.url;
  } catch (error) {
    return undefined;
  }
}

export async function createCustomer(email) {
  // create a stripe customer account for the authenticated user if they don't have one
  try {
    const db = (await clientPromise).db();
    const user = await db.collection("users").findOne({ email: email });

    if (!user.stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          _id: user._id,
        },
      });

      // update db with stripeCustomerId
      await db
        .collection("users")
        .updateOne(
          { email: user.email },
          { $set: { stripeCustomerId: customer.id } }
        );
    }
  } catch (error) {
    return undefined;
  }
}

export async function findCustomerByEmail(email) {
  const customers = await stripe.customers.list({
    email: email,
    limit: 1,
  });

  if (customers.data.length > 0) {
    return customers.data[0];
  } else {
    return null;
  }
}
