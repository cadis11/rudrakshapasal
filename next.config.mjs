/** @type {import("next").NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
  // Do NOT block production builds for lint or TS issues
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};
export default nextConfig;