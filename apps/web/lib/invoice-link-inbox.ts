/*
 * Takes an invoice link (#i=…) out of the address bar before anything else
 * sees it. Analytics records the page URL, fragment included, and PostHog
 * starts before React mounts, so the editor can't clear the hash in time.
 * `installInvoiceLinkInbox` runs first in instrumentation-client.ts: it moves
 * the fragment here and strips it from the URL, on load and on same-tab
 * navigation. The editor then collects it with `takeInvoiceLink`.
 */

const LINK_HASH = /(?:^#|&)i=/

let pending: string | null = null
const listeners = new Set<() => void>()

function capture(): boolean {
  const { hash, pathname, search } = window.location
  if (!LINK_HASH.test(hash)) return false
  pending = hash
  window.history.replaceState(window.history.state, "", pathname + search)
  return true
}

/** Call once, before analytics initialise. */
export function installInvoiceLinkInbox() {
  if (typeof window === "undefined") return
  capture()
  // Setting location.hash fires popstate, then hashchange. Registered before
  // PostHog's own listeners, so the URL is clean by the time they read it.
  const onNavigate = () => {
    if (capture()) for (const listener of listeners) listener()
  }
  window.addEventListener("popstate", onNavigate)
  window.addEventListener("hashchange", onNavigate)
}

/** The invoice link waiting to be opened, if any. Each link is handed out once. */
export function takeInvoiceLink(): string | null {
  const hash = pending
  pending = null
  return hash
}

/** Run `listener` whenever a new invoice link arrives while the page is open. */
export function onInvoiceLink(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** `url` without its fragment, for anything that reports URLs. */
export function withoutFragment(url: string): string {
  const at = url.indexOf("#")
  return at === -1 ? url : url.slice(0, at)
}
