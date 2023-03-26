// pages/api/verify-checkout-session.js
import Stripe from "stripe";
import { userService } from "services";

const stripe = new Stripe(process.env.NEXT_SECRET_API_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { sessionId, userId } = req.body;

    try {
      // Retrieve the Checkout Session
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      // Check if the payment was successful
      if (session.payment_status === "paid") {
        // Update the user's subscription status
        const user = await userService.getById(userId);
        user.share_custom_varieties = true;
        await userService.update(userId, user);

        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ error: "Payment not successful" });
      }
    } catch (error) {
        console.error("Error in verify-checkout-session:", error); // Add error logging
      res.status(500).json({ error: "Failed to verify Checkout Session" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
