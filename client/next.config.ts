import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com'], // 👈 add this line
  },
    eslint: {
    ignoreDuringBuilds: true,
  },

};

export default nextConfig;
