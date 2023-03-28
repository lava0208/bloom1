import Stripe from "stripe";
import { userService } from "services";

const stripe = new Stripe(process.env.NEXT_SECRET_API_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { userId } = req.body;

      // Replace this with your actual logic to fetch the user from MongoDB
      console.log(userId);
      const user = await userService.getById(userId);
      console.log(user); // Add this line to debug user data
      console.log("User data:", user);
      console.log("User email:", user.data.email);
      console.log("User email:", user.data._id);

      const session = await stripe.checkout.sessions.create({
        customer_email: user.data.email, // Set the customer's email
        client_reference_id: user.data._id, // Set the client reference ID
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: "price_1MpjF2EVmyPNhExzk8OzvcVy", // price ID from Stripe
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/account/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: req.headers.origin,
      });

      res.status(200).json({ id: session.id });
    } catch (error) {
      console.error("Error creating checkout session:", error.message);
      console.error("Error stack:", error.stack);
      res.status(500).json({ error: "Error creating checkout session", message: error.message });
    }
    
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}