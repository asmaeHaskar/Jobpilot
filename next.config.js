/** @type {import('next').NextConfig} */
const nextConfig = {
  // Logging configuration
  logging: {
    fetches: {
      fullUrl: false,
    },
    browserToTerminal: true,
  },
}

module.exports = nextConfig
