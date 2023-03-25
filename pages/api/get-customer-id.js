import { getSession } from '@stripe/stripe-js';
import { NextApiRequest, NextApiResponse } from 'next';

const stripe = require('stripe')(process.env.NEXT_SECRET_KEY);

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
  const { sessionId } = req.query;

  if (!sessionId) {
    res.status(400).json({ error: 'Session ID is required' });
    return;
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session.customer) {
      res.status(500).json({ error: 'Customer ID not found in the session' });
      return;
    }

    res.status(200).json({ customerId: session.customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
