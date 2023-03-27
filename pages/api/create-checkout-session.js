import { createCheckoutSession } from "services/subscriptionService";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const { userId } = req.body;
      const session = await createCheckoutSession(userId);

      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      res.status(400).json({ error: "Unable to create checkout session" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
