export const PAYWALL_ENABLED = process.env.NEXT_PUBLIC_PAYWALL_ENABLED === "true"

export const isPaywallEnabled = () => PAYWALL_ENABLED
