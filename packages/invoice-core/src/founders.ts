/**
 * Founding-member codes. Everyone on the waitlist when billy launches gets a
 * number and a personal link carrying a code like `v1.214.<signature>`. The
 * code is signed offline (scripts/founders) with a private key that never
 * ships; the editor checks it against the public key below, so there is no
 * server and no account, and nobody can mint a code of their own.
 */

/** Raw Ed25519 public key, base64url. Pair of the private key in ~/.billy (see scripts/founders). */
export const FOUNDER_PUBLIC_KEY = "czaj7qvd6FszNW8rGPrU7babzTI-4P_anptYGeLEj2k"

const VERSION = "v1"

/** The bytes that get signed for founder `n`. */
export function founderMessage(n: number): Uint8Array {
  return new TextEncoder().encode(`billy-founder:${VERSION}:${n}`)
}

export function toBase64Url(bytes: ArrayBuffer | Uint8Array): string {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let s = ""
  for (const x of b) s += String.fromCharCode(x)
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

export function fromBase64Url(text: string): Uint8Array<ArrayBuffer> {
  const s = atob(text.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((text.length + 3) % 4))
  const out = new Uint8Array(new ArrayBuffer(s.length))
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i)
  return out
}

/** Builds the code for founder `n` from its signature. */
export function formatFounderCode(n: number, signature: ArrayBuffer | Uint8Array): string {
  return `${VERSION}.${n}.${toBase64Url(signature)}`
}

/**
 * The founder number a code belongs to, or null when the code is malformed
 * or its signature doesn't check out. `publicKey` is only overridden in tests.
 */
export async function verifyFounderCode(code: string, publicKey: string = FOUNDER_PUBLIC_KEY): Promise<number | null> {
  const match = code.trim().match(/^v1\.([1-9]\d{0,6})\.([A-Za-z0-9_-]{80,90})$/)
  if (!match || typeof crypto === "undefined" || !crypto.subtle) return null
  const n = Number(match[1])
  try {
    const key = await crypto.subtle.importKey("raw", fromBase64Url(publicKey), { name: "Ed25519" }, false, ["verify"])
    const ok = await crypto.subtle.verify("Ed25519", key, fromBase64Url(match[2]), founderMessage(n) as Uint8Array<ArrayBuffer>)
    return ok ? n : null
  } catch {
    return null
  }
}

const CODE_SHAPE = /v1\.([1-9]\d{0,6})\.([A-Za-z0-9_-]{86})/

/**
 * Finds a founder code in whatever someone pastes: the whole emailed link, just
 * the code, or a link a mail tracker wrapped and percent-encoded. Whitespace is
 * dropped first because long links pick up line breaks when copied. Only the
 * shape is checked here; `verifyFounderCode` decides whether it is real.
 */
export function extractFounderCode(text: string): string | null {
  let s = text.replace(/\s+/g, "")
  for (let pass = 0; pass < 3; pass++) {
    const match = s.match(CODE_SHAPE)
    if (match) return match[0]
    try {
      const decoded = decodeURIComponent(s)
      if (decoded === s) break
      s = decoded
    } catch {
      break
    }
  }
  return null
}
