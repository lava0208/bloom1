import Stripe from 'stripe';

const stripe = new Stripe(process.env.NEXT_SECRET_API_KEY);

export async function createCheckoutSession(userId) {
  return await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price: 'price_1MpjF2EVmyPNhExzk8OzvcVy',
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/account/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: process.env.NEXT_PUBLIC_APP_URL,
    metadata: {
      user_id: userId
    }
  });
}


// Add this new function
export async function handleStripeWebhook(buf, sig) {
    const event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata.user_id;
  
      if (session.mode === 'subscription') {
        const subscriptionId = session.subscription;
        await updateUserSubscription(userId, subscriptionId);
      }
    }
  }