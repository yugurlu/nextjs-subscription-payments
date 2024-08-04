import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// this is the route that listens to the stripe webhook for custom proccess
// please read https://docs.stripe.com/webhooks
export async function POST(req) {
  let event;
  const body = await req.text();
  const signature = headers().get("stripe-signature");

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (e) {
    console.error(e);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  switch (event.type) {
    case "customer.subscription.created": {
      const subscription = event.data.object;
      // You can use this to detect changes in the subscription
      // subscription.status will return the current status of the subscription
      //
      // Things you can do here:
      // 1. Send a thank you email to the user
      // 2. Send content you've created that would enhance the user's experience/workflow
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object;
      // You can use this to detect changes in the subscription
      // subscription.status will return the current status of the subscription
      //
      // Things you can do here:
      // 1. Update the user's status in your database
      // 2. Send an email to the user notifying them about the change in subscription status
      // 3. If the user cancelled the subscription you could trigger
      // a email campaign to inform users of the beneits they're missing out on.
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object;
      // You can use this to detect changes in the subscription
      // subscription.status will return the current status of the subscription
      //
      // Things you can do here:
      // 1. Send an email to the user notifying them about the change in subscription status
      // 2. If the user cancelled the subscription you could trigger
      // a email campaign to inform users of the beneits they're missing out on.
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object;
      // If you have trials, this event is triggered when the trial ended and the user was charged for continued access
      //
      // Things you can do:
      // 1. Notify the user of the charge
      // 2. Thank them for their continued belief in your product
      // 3. Send additional content that could enable better workflows for the user
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object;
      // The payment fails or the user does not have a valid payment method
      // The subscription is now past due
      // You can notify the user that the payment has failed
      // and ask them to use different payment methods
      // or revoke their access
      break;
    }

    default: {
      break;
    }
  }
  return new NextResponse("Webhook received", { status: 200 });
}
