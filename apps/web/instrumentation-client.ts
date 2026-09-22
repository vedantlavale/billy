import posthog from "posthog-js"

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  // Static export has no server, so PostHog is called directly (the old
  // /api/metrics reverse-proxy rewrite can't run). To restore first-party
  // proxying later, add a Cloudflare rule and point this back at it.
  api_host: "https://us.i.posthog.com",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
})
