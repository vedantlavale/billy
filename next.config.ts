import type { NextConfig } from "next";

// Fully static: no server, no redirects()/rewrites() (output: "export" makes
// Next.js error on those). Retired routes and the PostHog proxy move to
// public/_redirects, which Cloudflare's static-assets Worker reads itself.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
