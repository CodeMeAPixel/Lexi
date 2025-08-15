import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  turbopack: {
    resolveAlias: {
      underscore: 'lodash'
    },
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json']
  },
};

export default nextConfig;
