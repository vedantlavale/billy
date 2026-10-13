import { describe, expect, test } from "bun:test"

import { extractFounderCode, formatFounderCode, founderMessage, toBase64Url, verifyFounderCode } from "./founders"

async function keys() {
  const pair = (await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"])) as CryptoKeyPair
  const pub = toBase64Url(await crypto.subtle.exportKey("raw", pair.publicKey))
  const sign = async (n: number) => formatFounderCode(n, await crypto.subtle.sign("Ed25519", pair.privateKey, founderMessage(n) as Uint8Array<ArrayBuffer>))
  return { pub, sign }
}

describe("founder codes", () => {
  test("a signed code verifies to its number", async () => {
    const { pub, sign } = await keys()
    expect(await verifyFounderCode(await sign(214), pub)).toBe(214)
  })

  test("a code can't be moved to another number", async () => {
    const { pub, sign } = await keys()
    const forged = (await sign(214)).replace("v1.214.", "v1.1.")
    expect(await verifyFounderCode(forged, pub)).toBeNull()
  })

  test("a code signed by another key is rejected", async () => {
    const a = await keys()
    const b = await keys()
    expect(await verifyFounderCode(await b.sign(7), a.pub)).toBeNull()
  })

  test("garbage is rejected, not thrown", async () => {
    const { pub } = await keys()
    for (const code of ["", "v1", "v1.0.abc", "v2.3.xyz", "v1.3." + "!".repeat(86)]) {
      expect(await verifyFounderCode(code, pub)).toBeNull()
    }
  })
})

describe("extracting a code from pasted text", () => {
  test("finds the code in a whole emailed link", async () => {
    const { pub, sign } = await keys()
    const code = await sign(42)
    const found = extractFounderCode(`https://trybilly.tech/editor#founder=${code}`)
    expect(found).toBe(code)
    expect(await verifyFounderCode(found!, pub)).toBe(42)
  })

  test("accepts a bare code with stray whitespace or quotes", async () => {
    const { sign } = await keys()
    const code = await sign(7)
    expect(extractFounderCode(`  ${code}\n`)).toBe(code)
    expect(extractFounderCode(`"${code}"`)).toBe(code)
  })

  test("survives a line break inside a copied link", async () => {
    const { sign } = await keys()
    const code = await sign(120)
    const wrapped = `https://trybilly.tech/editor#founder=${code.slice(0, 30)}\r\n${code.slice(30)}`
    expect(extractFounderCode(wrapped)).toBe(code)
  })

  test("sees through a tracker that percent-encodes the destination, even twice", async () => {
    const { sign } = await keys()
    const code = await sign(9)
    const link = `https://trybilly.tech/editor#founder=${code}`
    const once = `https://click.example.com/r?url=${encodeURIComponent(link)}`
    const twice = `https://click.example.com/r?url=${encodeURIComponent(encodeURIComponent(link))}`
    expect(extractFounderCode(once)).toBe(code)
    expect(extractFounderCode(twice)).toBe(code)
  })

  test("returns null for anything that isn't code-shaped", () => {
    for (const text of ["", "hello", "https://trybilly.tech/editor", "v1.5.tooshort", "v1.0." + "a".repeat(86), "%E0%A4%A"]) {
      expect(extractFounderCode(text)).toBeNull()
    }
  })
})
