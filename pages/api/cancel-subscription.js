// Import the necessary modules
import Stripe from "stripe";

// Initialize the Stripe object with your secret key
const stripe = new Stripe(process.env.NEXT_PUBLIC_API_KEY);

// Export the default async function to handle the request and response
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
    return;
  }

  const { customerId } = req.body; // or subscriptionId, depending on your implementation

  try {
    // Retrieve the subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
    });

    // Cancel the first active subscription found (assuming one subscription per customer)
    for (const subscription of subscriptions.data) {
      if (subscription.status === "active" || subscription.status === "trialing") {
        await stripe.subscriptions.del(subscription.id);
        break;
      }
    }

    res.status(200).json({ message: "Subscription cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while cancelling the subscription", error: error.message });
  }
}
