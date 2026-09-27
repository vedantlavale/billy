import { describe, expect, test } from "bun:test"

import { firstInvoiceNumber, nextInvoiceNumber } from "./numbering"

const sept2026 = new Date(2026, 8, 26)

describe("firstInvoiceNumber", () => {
  test("starts a per-year sequence", () => {
    expect(firstInvoiceNumber(sept2026)).toBe("INV-2026-001")
  })
})

describe("nextInvoiceNumber", () => {
  test("bumps the trailing number and keeps padding", () => {
    expect(nextInvoiceNumber("INV-2026-001", sept2026)).toBe("INV-2026-002")
    expect(nextInvoiceNumber("2026/009", sept2026)).toBe("2026/010")
    expect(nextInvoiceNumber("INV-1024", sept2026)).toBe("INV-1025")
  })

  test("grows past the padding width", () => {
    expect(nextInvoiceNumber("INV-999", sept2026)).toBe("INV-1000")
  })

  test("never falls back to a number that was already used", () => {
    expect(nextInvoiceNumber("Draft", sept2026)).toBe("Draft-2")
    expect(nextInvoiceNumber("Draft-2", sept2026)).toBe("Draft-3")
  })

  test("an empty number starts a new sequence", () => {
    expect(nextInvoiceNumber("  ", sept2026)).toBe("INV-2026-001")
  })
})
