"use client"

import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"
import { InspectorSection } from "@/components/invoice/editor-ui"
import { applyProfessionPreset, professionPresets } from "@billy/invoice-core"
import type { InvoiceData } from "@billy/invoice-core"

type PresetId = keyof typeof professionPresets

const presetLabels: Record<PresetId, string> = {
  freelancer: "Freelancer",
  gst_vendor: "GST vendor",
  agency: "Agency",
  consultant: "Consultant",
  other: "Basic",
}

/** A preset is "active" when every field it controls matches the invoice. */
function matchesPreset(state: InvoiceData, id: PresetId) {
  const preset = professionPresets[id]
  return (Object.keys(preset) as (keyof typeof preset)[]).every((key) =>
    key === "taxLabel"
      ? state.taxLabel === preset.taxLabel
      : state.options[key] === preset[key],
  )
}

export function ProfessionPreset() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()

  const handleApply = (presetId: PresetId) => {
    dispatch({ type: "LOAD_STATE", payload: applyProfessionPreset(state, presetId) })
  }

  return (
    <InspectorSection
      title="Quick setup"
      hint="Turn on the fields your kind of work usually needs."
    >
      <div className="grid grid-cols-2 gap-1.5">
        {(Object.keys(professionPresets) as PresetId[]).map((presetId) => (
          <button
            key={presetId}
            type="button"
            aria-pressed={matchesPreset(state, presetId)}
            onClick={() => handleApply(presetId)}
            className="ed-option"
          >
            {presetLabels[presetId]}
          </button>
        ))}
      </div>
    </InspectorSection>
  )
}
