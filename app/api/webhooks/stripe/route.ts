import db from "@/db/drizzle";
import { userSubscribtion } from "@/db/schema";
import { stripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string; // Fix #1 and #4
  let event: Stripe.Event; // Fix #2

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: unknown) {
  if (error instanceof Error) {
    return new NextResponse(`Webhook error: ${error.message}`, {
      status: 400,
    });
  }

  return new NextResponse("Unknown error occurred", { status: 400 });
}

  // Handle the event
  console.log("Event received:", event);
  
  const session = event.data.object as Stripe.Checkout.Session;
  if(event.type === "checkout.session.completed") {
    const subscribtion = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    if(!session?.metadata?.userId) {
      return new NextResponse("User ID is required", { status: 400 });
    }
    await db.insert(userSubscribtion).values({
      userId: session.metadata.userId,
      stripeSubscribtionId: subscribtion.id,
      stripeCustomerId: subscribtion.customer as string,
      stripePriceId: subscribtion.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(
        subscribtion.current_period_end * 1000,
      ),
    });
  };
  if(event.type === "invoice.payment_succeeded") {
    const subscribtion = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    await db.update(userSubscribtion).set({
      stripePriceId: subscribtion.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date(
        subscribtion.current_period_end * 1000,
      ),
    }).where(eq(userSubscribtion.stripeSubscribtionId, subscribtion.id))
  }

  // Fix #3: Return a success response
  return new NextResponse("Webhook processed successfully", {
    status: 200,
  });
}
