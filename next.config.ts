import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable static generation for API routes to avoid database connection during build
  skipMiddlewareURLNormalization: true,
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
};

export default nextConfig;
