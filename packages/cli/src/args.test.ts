import { describe, expect, test } from "bun:test"

import { flagsToInput, parseItem } from "./args"

describe("parseItem", () => {
  test("reads quantity and rate from the right", () => {
    expect(parseItem("Design:12:80")).toEqual({ description: "Design", quantity: 12, rate: 80 })
    expect(parseItem("Phase 2: build:3:1500.5")).toEqual({ description: "Phase 2: build", quantity: 3, rate: 1500.5 })
  })

  test("treats a single number as the rate", () => {
    expect(parseItem("Logo refresh:400")).toEqual({ description: "Logo refresh", rate: 400 })
  })

  test("rejects an item with no price", () => {
    expect(() => parseItem("Design")).toThrow("description:quantity:rate")
  })
})

describe("flagsToInput", () => {
  test("maps flags onto agent input and leaves the rest unset", () => {
    expect(
      flagsToInput({ to: "Acme", "to-address": "1 Road\\nPune", item: ["Design:2:50"], tax: "18", due: "14d", currency: "inr" }),
    ).toEqual({
      to: { name: "Acme", address: "1 Road\nPune" },
      items: [{ description: "Design", quantity: 2, rate: 50 }],
      taxRate: 18,
      dueInDays: 14,
      currency: "inr",
    })
  })

  test("accepts a due date and rejects nonsense", () => {
    expect(flagsToInput({ due: "2026-10-10" })).toEqual({ dueDate: "2026-10-10" })
    expect(() => flagsToInput({ due: "soon" })).toThrow("--due")
    expect(() => flagsToInput({ tax: "lots" })).toThrow("--tax")
    expect(() => flagsToInput({ gst: "vat" })).toThrow("--gst")
  })
})
