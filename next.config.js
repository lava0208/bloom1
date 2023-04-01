/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    development: true, // enable development mode
    swcMinify: false,
    serverRuntimeConfig: {
        secret: 'THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING'
    },
    publicRuntimeConfig: {
        apiUrl: 'https://app.bloommanager.com/api'
    },
    webpack5: true,
    webpack: (config) => {
        config.resolve.fallback = { fs: false };

        return config;
    },
}

module.exports = nextConfig
