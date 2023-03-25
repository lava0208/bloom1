// /pages/api/get-customer-id.js

import Stripe from "stripe";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { sessionId } = req.body;

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      res.status(200).json({ customerId: session.customer });
    } catch (error) {
      res.status(400).json({ message: "Error retrieving customer ID", error });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
