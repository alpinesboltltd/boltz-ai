/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Re-enabled to enforce lint cleanliness during builds now that major issues are addressed.
    ignoreDuringBuilds: false,
  },
  images: {
    domains: ["i.pravatar.cc"],
  },
};

module.exports = nextConfig;
