// /pages/api/create-subscription.js
import { loadStripe } from "@stripe/stripe-js";
import { userService } from '../../services/userService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userEmail, priceId } = req.body;

    try {
      // Create a new customer
      const customer = await stripe.customers.create({
        email: userEmail,
      });

      // Create a new subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price: priceId,
          },
        ],
        expand: ['latest_invoice.payment_intent'],
      });

      res.status(200).json({
        customerId: customer.id,
        subscriptionId: subscription.id,
        checkoutUrl: subscription.latest_invoice.payment_intent.client_secret,
      });
    } catch (error) {
      res.status(400).json({ message: 'Error creating subscription', error });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
