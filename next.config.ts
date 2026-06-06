import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/metrics/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/api/metrics/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/api/metrics/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ]
  },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
