// /pages/api/create-checkout-session.js

import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_SECRET_API_KEY);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { customerEmail } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        lineItems: [
          {
            price: 'price_1MpfFWEVmyPNhExzY72Yv0mD',
            quantity: 1,
          },
        ],
        customerEmail,
        successUrl: `${req.headers.origin}/account/success?session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: req.headers.origin,
      });

      res.status(200).json({ sessionId: session.id });
    } catch (error) {
      res.status(400).json({ message: 'Error creating checkout session', error });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
