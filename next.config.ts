import type { NextConfig } from "next";

// Everything but the coming-soon page is gone for now; send old links home.
const RETIRED_ROUTES = ["/editor", "/dashboard", "/login", "/signup", "/auth/:path*", "/api/invoices", "/api/waitlist", "/api/generate-pdf"]

const nextConfig: NextConfig = {
  async redirects() {
    return RETIRED_ROUTES.map((source) => ({ source, destination: "/", permanent: false }))
  },
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
