import { Stripe } from 'stripe';
import { userService } from 'services';

const stripe = new Stripe(process.env.NEXT_SECRET_API_KEY);

const getRawBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
};


export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      const buf = await getRawBody(req);
      event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log('Event:', event);

    if (event.type === 'checkout.session.completed') {
      console.log('checkout.session.completed event received');
      const session = event.data.object;
      const userId = event.data.client_reference_id;
      // const user = await userService.getById(userId);
      console.log('Fetched user:', user);

      // Retrieve the subscription from the session
      const subscription = session.subscription;
      console.log('subscription:', subscription);

      // Update the user object with the subscription ID and share_custom_varieties
      // const updatedUser = {
      //  ...user,
      //  share_custom_varieties: true,
      //  subscriptionId: subscription,
      // };

      // Save the updated user object to MongoDB
      // await userService.update(userId, updatedUser);
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
