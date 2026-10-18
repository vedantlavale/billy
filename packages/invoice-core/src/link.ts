import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from "lz-string"

import { createBlankInvoice } from "./defaults"
import { normalizeInvoiceData } from "./normalize"
import type { InvoiceData } from "./types"

/*
 * An invoice carried entirely in a URL fragment:
 *
 *   https://trybilly.tech/editor#i=1.<checksum>.<lz-string payload>
 *
 * The fragment never reaches a server, so a link built by an agent opens in
 * the editor without Billy ever seeing the invoice. The checksum turns a link
 * that got mangled on the way (a chat model retyping it, a truncated paste)
 * into a clear "damaged link" instead of a half-loaded invoice.
 */

export const INVOICE_LINK_BASE = "https://trybilly.tech"

const HASH_KEY = "i"
const VERSION = "1"

export type InvoiceLinkResult =
  | { ok: true; data: InvoiceData }
  | { ok: false; reason: "damaged" | "unsupported" }

/** FNV-1a, 32-bit, in base 36. Detects corruption; it is not a signature. */
function checksum(text: string): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36)
}

/**
 * The fragment payload for `data`. Only what differs from a blank invoice is
 * stored, to keep links short. Images and the draft id are left out: base64
 * logos would make the URL enormous, and the editor keeps the logo and stamp
 * already saved in the browser.
 */
export function encodeInvoicePayload(data: InvoiceData): string {
  const blank = createBlankInvoice() as unknown as Record<string, unknown>
  const compact: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(data)) {
    if (key === "id" || key === "logoUrl" || key === "stampUrl" || key === "options" || key === "lineItems") continue
    if (value !== blank[key]) compact[key] = value
  }

  const options = Object.entries(data.options).filter(([, on]) => on).map(([key]) => key)
  if (options.length) compact.on = options

  compact.lineItems = data.lineItems.map(({ description, hsnCode, quantity, rate }) => ({
    d: description,
    ...(hsnCode ? { h: hsnCode } : {}),
    ...(quantity !== 1 ? { q: quantity } : {}),
    r: rate,
  }))

  const json = JSON.stringify(compact)
  return `${VERSION}.${checksum(json)}.${compressToEncodedURIComponent(json)}`
}

/** Undo the compaction done by `encodeInvoicePayload`. */
function expandPayload(compact: Record<string, unknown>): Record<string, unknown> {
  // Images are never part of a link (see `encodeInvoicePayload`), but a
  // hand-edited payload could sneak ones in, and a remote URL would then be
  // fetched by the editor and the PDF export. Drop them.
  const { on, lineItems, logoUrl, stampUrl, ...rest } = compact
  const options = Object.fromEntries((Array.isArray(on) ? on : []).map((key) => [key, true]))
  const rows = (Array.isArray(lineItems) ? lineItems : []).filter(
    (item): item is Record<string, unknown> => typeof item === "object" && item !== null,
  )
  const items = rows.map((item, index) => ({
    id: `item-${index + 1}`,
    description: item.d,
    hsnCode: item.h ?? "",
    quantity: item.q ?? 1,
    rate: item.r,
  }))
  return { ...rest, options: { ...createBlankInvoice().options, ...options }, lineItems: items }
}

/** A full editor link for `data`. */
export function buildInvoiceLink(data: InvoiceData, base: string = INVOICE_LINK_BASE): string {
  return `${base.replace(/\/+$/, "")}/editor#${HASH_KEY}=${encodeInvoicePayload(data)}`
}

export function decodeInvoicePayload(payload: string): InvoiceLinkResult {
  const [version, sum, ...rest] = payload.trim().split(".")
  if (version !== VERSION) return { ok: false, reason: "unsupported" }

  const json = decompressFromEncodedURIComponent(rest.join("."))
  if (!json || !sum || checksum(json) !== sum) return { ok: false, reason: "damaged" }

  let raw: unknown
  try {
    raw = JSON.parse(json)
  } catch {
    return { ok: false, reason: "damaged" }
  }

  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return { ok: false, reason: "damaged" }
  const data = normalizeInvoiceData(expandPayload(raw as Record<string, unknown>), createBlankInvoice())
  return data ? { ok: true, data } : { ok: false, reason: "damaged" }
}

/**
 * Read an invoice from a location hash such as `#i=1.abc.xyz`. Returns null
 * when the hash carries no invoice at all.
 */
export function readInvoiceFromHash(hash: string): InvoiceLinkResult | null {
  // Not URLSearchParams: it would turn the payload's "+" into spaces.
  const match = hash.match(new RegExp(`(?:^#?|&)${HASH_KEY}=([^&]*)`))
  if (!match || !match[1]) return null

  let payload = match[1]
  try {
    // Some chat apps percent-encode characters like "$" when they render a link.
    payload = decodeURIComponent(payload)
  } catch {
    return { ok: false, reason: "damaged" }
  }
  return decodeInvoicePayload(payload)
}
