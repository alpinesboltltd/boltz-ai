/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Re-enabled to enforce lint cleanliness during builds now that major issues are addressed.
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ["i.pravatar.cc", "images.unsplash.com"],
  },
  rewrites: async () => {
    return [
      {
        source: "/v1/:path*",
        destination: `${process.env.API_BASE_URL}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
