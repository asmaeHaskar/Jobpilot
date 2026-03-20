/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack root configuration
  turbopack: {
    root: './',
  },

  // Logging configuration
  logging: {
    fetches: {
      fullUrl: false,
    },
    browserToTerminal: true,
  },
}

module.exports = nextConfig
