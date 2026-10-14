import type { NextConfig } from "next";
import { join } from "node:path";

// The Turborepo root (…/billy). Next runs this config from apps/web, so two
// levels up is the workspace root — this stops Next inferring the root from a
// stray lockfile higher up the filesystem.
const monorepoRoot = join(process.cwd(), "..", "..");

const nextConfig: NextConfig = {
  turbopack: { root: monorepoRoot },

  // Fully static build (no server). `next build` emits `out/` — deploy to
  // Cloudflare Workers static assets. There is no backend: no API routes, no auth, no DB.
  output: "export",

  // Compile the internal TS workspace package on the fly.
  transpilePackages: ["@billy/invoice-core"],

  // No next/image is used, but this keeps `output: export` happy if one is added.
  images: { unoptimized: true },

  skipTrailingSlashRedirect: true,

  // NOTE: rewrites/redirects/headers and middleware do NOT run in a static
  // export. Security headers live in `public/_headers` (Cloudflare reads it), and
  // PostHog is pointed straight at its host in `instrumentation-client.ts`.
};

export default nextConfig;
