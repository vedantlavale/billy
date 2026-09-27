import { describe, expect, test } from "bun:test"

import { formatFounderCode, founderMessage, toBase64Url, verifyFounderCode } from "./founders"

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
