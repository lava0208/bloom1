const apiUrl = 'https://app.bloommanager.com/api';

export {
    apiUrl
};

module.exports = {
    env: {
      NEXT_PUBLIC_API_KEY: process.env.NEXT_PUBLIC_API_KEY,
      NEXT_SECRET_API_KEY: process.env.NEXT_SECRET_API_KEY,
      STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
      // Add any other environment variables you may have
    },
  };
  