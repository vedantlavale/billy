/**
 * Where sponsor enquiries go. Cloudflare Email Routing sends hello@ to the
 * maintainer's inbox, so it is safe to show publicly.
 */
export const SPONSOR_EMAIL = "hello@trybilly.tech"

export const SPONSOR_MAILTO = `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent("Sponsoring billy")}`

/**
 * Current sponsors, in display order. Add an entry and its logo under
 * public/sponsors/ and the landing page shows it. Every sponsor action is a
 * mailto, so there is no checkout and no server.
 */
export type Sponsor = { name: string; href: string; logo: string }

export const SPONSORS: Sponsor[] = []
