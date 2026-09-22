import posthog from "posthog-js"

export interface TrackingProperties {
  template_id?: string
  currency?: string
  line_items_count?: number
  has_logo?: boolean
  has_stamp?: boolean
  total_amount?: number
  invoice_number?: string
  [key: string]: any
}

export function identifyUser(
  userId: string,
  email?: string,
  properties?: Record<string, any>,
) {
  if (typeof window === "undefined") return
  posthog.identify(userId, {
    email,
    ...properties,
  })
}

export function trackEvent(
  event:
    | "editor_opened"
    | "template_switched"
    | "logo_uploaded"
    | "stamp_uploaded"
    | "invoice_created"
    | "invoice_updated"
    | "pdf_downloaded",
  properties?: TrackingProperties,
) {
  if (typeof window === "undefined") return
  posthog.capture(event, properties)
}
