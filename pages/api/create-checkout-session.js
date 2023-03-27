import Stripe from "stripe";
import { connectToDB } from "lib/mongodb"; // Replace with the correct path to your mongoDB.js file

const stripe = new Stripe(process.env.NEXT_SECRET_API_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { userId } = req.body;

      // Connect to MongoDB
      const db = await connectToDB();

      // Fetch user from MongoDB
      const usersCollection = db.collection("users");
      const user = await usersCollection.findOne({ _id: userId });

      let customerId = user.stripeCustomerId;

      // Create a new Stripe customer if it doesn't exist
      if (!customerId) {
        const customer = await stripe.customers.create({ email: user.email });
        customerId = customer.id;

        // Update user document in MongoDB with the new customerId
        await usersCollection.updateOne({ _id: userId }, { $set: { stripeCustomerId: customerId } });
      }

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
          {
            price: "price_1MpjF2EVmyPNhExzk8OzvcVy",
            quantity: 1,
          },
        ],
        success_url: `${req.headers.origin}/account/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: req.headers.origin,
      });

      res.status(200).json({ sessionId: session.id });
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
