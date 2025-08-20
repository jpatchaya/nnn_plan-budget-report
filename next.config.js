/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['www.salika.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.salika.co',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig