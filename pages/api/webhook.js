import Stripe from "stripe";
import { userService } from "services/user.service";

const stripe = new Stripe(process.env.NEXT_SECRET_API_KEY, {
  apiVersion: "2020-08-27",
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const event = req.body;

    try {
      switch (event.type) {
        case "checkout.session.completed":
          const session = event.data.object;
          const userId = await userService.findUserIdByCustomerId(
            session.customer
          );

          if (userId) {
            // Update user subscription status in MongoDB
            await userService.update(userId, {
              share_custom_varieties: true,
            });
          }
          break;
        case "customer.subscription.deleted":
          const subscription = event.data.object;
          const userIdToDelete = await userService.findUserIdByCustomerId(
            subscription.customer
          );

          if (userIdToDelete) {
            // Update user subscription status in MongoDB
            await userService.update(userIdToDelete, {
              share_custom_varieties: false,
            });
          }
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      res.status(200).json({ received: true });
    } catch (error) {
      console.error("Error processing webhook event:", error);
      res.status(500).json({ error: "Error processing webhook event" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
