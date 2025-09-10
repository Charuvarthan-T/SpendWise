import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds for deployment
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optionally disable TypeScript errors during builds too
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
