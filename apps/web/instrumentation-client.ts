import posthog, { type CaptureResult } from "posthog-js"

import { installInvoiceLinkInbox, withoutFragment } from "@/lib/invoice-link-inbox"

// First, before PostHog starts: an invoice link carries the whole invoice in
// the URL fragment, and PostHog records the page URL in many places,
// including its /flags request, which before_send never sees. Taking the
// fragment out of the address bar first is what keeps it private.
installInvoiceLinkInbox()

/** Backstop for captured events: strip the fragment from every URL value. */
function dropFragments(event: CaptureResult | null): CaptureResult | null {
  if (!event) return event
  for (const bag of [event.properties, event.$set, event.$set_once]) {
    if (!bag) continue
    for (const [key, value] of Object.entries(bag)) {
      if (typeof value === "string" && /^https?:\/\//.test(value)) bag[key] = withoutFragment(value)
    }
  }
  return event
}

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  // Static export has no server, so PostHog is called directly (the old
  // /api/metrics reverse-proxy rewrite can't run). To restore first-party
  // proxying later, add a Cloudflare rule and point this back at it.
  api_host: "https://us.i.posthog.com",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
  capture_exceptions: true,
  before_send: dropFragments,
  debug: process.env.NODE_ENV === "development",
})
