import { buffer } from 'micro';
import { handleStripeWebhook } from 'services/subscriptionService';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    try {
      await handleStripeWebhook(buf, sig);
      res.status(200).end('Webhook received');
    } catch (err) {
      console.error(err);
      res.status(500).end('Error processing webhook');
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
