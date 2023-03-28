import Stripe from 'stripe';
import { userService } from 'services';

const stripe = new Stripe(process.env.NEXT_SECRET_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.client_reference_id;
      const user = await userService.getById(userId);
      const updatedUser = { ...user, share_custom_varieties: true };
      await userService.update(userId, updatedUser);
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      const userId = subscription.metadata.userId;
      const user = await userService.getById(userId);
      const updatedUser = { ...user, share_custom_varieties: false };
      await userService.update(userId, updatedUser);
    }

    // Handle other subscription-related events here if necessary

    res.status(200).json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
