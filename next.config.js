/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // You only need remotePatterns now; domains is deprecated
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // serverActions now expects an object, not boolean
    serverActions: {},
  },
  // If you had middleware, check Next.js 16 docs to migrate to proxy
};

module.exports = nextConfig;
