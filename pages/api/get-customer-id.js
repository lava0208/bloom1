import { NextApiRequest, NextApiResponse } from 'next';
const stripe = require('stripe')(process.env.NEXT_SECRET_API_KEY);

export default async function handler(req = NextApiRequest, res = NextApiResponse) {
    const { subscriptionId } = req.query;

    if (!subscriptionId) {
        res.status(400).json({ error: 'Subscription ID is required' });
        return;
    }

    try {
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);

        if (!subscription.customer) {
            res.status(500).json({ error: 'Customer ID not found in the subscription' });
            return;
        }

        res.status(200).json({ customerId: subscription.customer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}