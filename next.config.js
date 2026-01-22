/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "i.pravatar.cc" },
      { hostname: "images.unsplash.com" },
    ],
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
