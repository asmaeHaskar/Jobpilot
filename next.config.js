/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable cacheComponents for better performance
  cacheComponents: false,
  
  // Turbopack configuration
  experimental: {
    // Remove deprecated option
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
