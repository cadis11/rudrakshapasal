import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: { dynamicIO: true },
  images: { remotePatterns: [ { protocol: "https", hostname: "cdn.sanity.io" } ] }
};
export default nextConfig;