/** The public repo. The Star button links here and reads its star count from it. */
export const GITHUB_REPO = "vedantlavale/billy"
export const GITHUB_URL = `https://github.com/${GITHUB_REPO}`

/**
 * Where sponsor enquiries go. Routed by Cloudflare Email Routing to the
 * maintainer's inbox, so it's safe to show publicly.
 */
export const SPONSOR_EMAIL = "hello@trybilly.tech"

export const SPONSOR_MAILTO = `mailto:${SPONSOR_EMAIL}?subject=${encodeURIComponent("Sponsoring billy")}`

/**
 * Current sponsors, in display order. Add one entry plus its logo in
 * public/sponsors/; the strip on the waitlist page picks it up.
 */
export type Sponsor = { name: string; href: string; logo: string }

export const SPONSORS: Sponsor[] = []
