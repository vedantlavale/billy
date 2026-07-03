"use client"

import * as React from "react"

import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"
import { applyProfessionPreset, professionPresets } from "@/lib/presets"

const presetLabels = {
  freelancer: "Freelancer",
  gst_vendor: "GST Vendor",
  agency: "Agency",
  consultant: "Consultant",
  other: "Other",
} as const

const KEY_LETTERS = ["A", "B", "C", "D", "E", "F", "G"]

export function ProfessionPreset() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()

  const handleApply = (presetId: keyof typeof professionPresets) => {
    const updated = applyProfessionPreset(state, presetId)
    dispatch({ type: "LOAD_STATE", payload: updated })
  }

  return (
    <section className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
        Profession Preset
      </p>
      <div className="flex flex-wrap gap-2">
        {Object.keys(professionPresets).map((presetId, index) => (
          <button
            key={presetId}
            type="button"
            onClick={() => handleApply(presetId as keyof typeof professionPresets)}
            className="app-option px-3 py-1.5 text-xs"
          >
            <span className="app-kbd">{KEY_LETTERS[index] ?? "•"}</span>
            {presetLabels[presetId as keyof typeof presetLabels]}
          </button>
        ))}
      </div>
    </section>
  )
}
