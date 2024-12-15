/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: '*.googleusercontent.com'
      },
      {
        hostname: 'eqcard.s3.amazonaws.com',
      },
    ],
  },
  
}

module.exports = nextConfig
