// pages/api/webhooks.js
import Stripe from "stripe";
import { buffer } from "micro";
import * as bodyParser from "body-parser";

const stripe = new Stripe(process.env.NEXT_SECRET_API_KEY);

export const config = {
  api: {
    bodyParser: false,
  },
};

async function handleStripeWebhook(req, res) {
  const signature = req.headers["stripe-signature"];
  const eventBuffer = await buffer(req);

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      eventBuffer,
      signature,
      process.env.NEXT_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Handle subscription creation after successful payment
    // Save the subscription data to your database and associate it with the user
    console.log("Subscription created:", session.subscription);

    // Your subscription handling logic here
  }

  res.json({ received: true });
}

export default handleStripeWebhook;
