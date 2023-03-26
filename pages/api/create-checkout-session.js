import Stripe from "stripe";

const stripe = new Stripe(process.env.NEXT_SECRET_API_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: process.env.NEXT_PRICE_ID,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${req.headers.origin}/account/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: req.headers.origin,
      });

      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}