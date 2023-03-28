

import Stripe from 'stripe';


const stripe = new Stripe(process.env.NEXT_SECRET_API_KEY);

module.exports = (req, res) => {
  let event;

  try {
    // Verify the webhook signature
    const signature = req.headers['stripe-signature'];
    event = stripe.webhooks.constructEvent(req.body, signature, 'YOUR_STRIPE_WEBHOOK_SECRET');
  } catch (err) {
    console.log(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Retrieve the customer email and client reference ID from the completed session
    const customerEmail = session.customer_email;
    const clientId = session.client_reference_id;

    // Do something with the customer email and client reference ID
    console.log(`Checkout completed for client ${clientId} with email ${customerEmail}`);
    
    // Return a 200 response to acknowledge receipt of the event
    return res.status(200).send('Checkout completed');
  }

  // Return a 200 response for any other event
  return res.status(200).send('Received');
};


