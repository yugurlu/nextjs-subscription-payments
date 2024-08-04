import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { findCustomerByEmail, stripe } from "@/lib/stripe";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(request) {
  try {
    const data = await request.json();
    const priceId = data.priceId;

    const { user: session } = await getServerSession(authOptions);
    const customer = await findCustomerByEmail(session.user.email);

    // create a new checkout session for the order
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_BASE_URL}`,
      cancel_url: `${process.env.NEXT_BASE_URL}`,
      metadata: {
        priceId,
      },
      customer: customer.id,
    });
    return NextResponse.json({ result: checkoutSession, ok: true });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server", { status: 500 });
  }
}
