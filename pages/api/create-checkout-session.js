import { createCheckoutSession } from "services/subscriptionService";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const session = await createCheckoutSession(req.body.userId);
      res.status(200).json(session);
    } catch (err) {
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
