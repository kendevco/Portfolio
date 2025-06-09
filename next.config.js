/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Server actions are now stable in Next.js 15
  // experimental: {
  //   serverActions: true,
  // },
};

module.exports = nextConfig;