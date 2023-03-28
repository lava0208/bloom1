import Stripe from "stripe";
import { userService } from "services";

const stripe = new Stripe(process.env.NEXT_SECRET_API_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { userId } = req.body;

      // Replace this with your actual logic to fetch the user from MongoDB
      const user = await userService.getById(userId);

      // Assuming you store the subscriptionId in the user object
      const subscriptionId = user.subscriptionId;

      if (subscriptionId) {
        // Cancel the subscription
        await stripe.subscriptions.del(subscriptionId);

        // Update the user object in MongoDB
        const updatedUser = { ...user, share_custom_varieties: false, subscriptionId: null };
        await userService.update(userId, updatedUser);

        res.status(200).json({ message: "Subscription canceled successfully" });
      } else {
        res.status(400).json({ error: "No subscription found for the user" });
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      res.status(500).json({ error: "Error canceling subscription" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}


import { userService } from 'services';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { userId } = req.body;
      const result = await userService.cancelSubscription(userId);
      if (result.success) {
        res.status(200).json({ success: true });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      res.status(500).json({ error: 'Error canceling subscription' });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
