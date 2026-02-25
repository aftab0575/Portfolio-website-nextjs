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
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    // serverActions now expects an object, not boolean
    serverActions: {},
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  async redirects() {
    return [
      // Legacy public pages -> single landing page sections
      { source: '/about', destination: '/?section=about', permanent: false },
      { source: '/projects', destination: '/?section=projects', permanent: false },
      { source: '/skills', destination: '/?section=skills', permanent: false },
      { source: '/experience', destination: '/?section=experience', permanent: false },
      { source: '/contact', destination: '/?section=contact', permanent: false },
    ]
  },
  // If you had middleware, check Next.js 16 docs to migrate to proxy
};

module.exports = nextConfig;
