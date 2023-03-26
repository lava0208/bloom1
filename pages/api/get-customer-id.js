// /pages/api/get-customer-id.js


const stripe = require('stripe')(process.env.NEXT_SECRET_API_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { sessionId } = req.body;

    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      res.status(200).json({ customerId: session.customer, subscriptionId: session.subscription });
    } catch (error) {
      res.status(400).json({ message: "Error retrieving customer ID and subscription ID", error });
    }    
  }
}