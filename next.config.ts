import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bucketapi.lexi.help",
      },
      {
        protocol: "https",
        hostname: "bucket.lexi.help",
      },
    ],
  },
};

export default nextConfig;
