"use client"

import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"
import { InspectorSection, SwitchRow } from "@/components/invoice/editor-ui"
import type { InvoiceData } from "@billy/invoice-core"

type Options = InvoiceData["options"]
type TaxMode = "standard" | "intra" | "inter"

const TAX_MODES: { id: TaxMode; label: string; description: string }[] = [
  { id: "standard", label: "Single tax", description: "One tax line" },
  { id: "intra", label: "CGST + SGST", description: "Same state" },
  { id: "inter", label: "IGST", description: "Other state" },
]

function taxModeOf(options: Options): TaxMode {
  if (options.showIGST) return "inter"
  if (options.showCGST || options.showSGST) return "intra"
  return "standard"
}

/**
 * Optional invoice fields and Indian GST settings. CGST/SGST and IGST are
 * mutually exclusive on a real invoice (totals already treat IGST as
 * overriding), so they're presented as one choice instead of three toggles.
 */
export function OptionsPanel() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()

  const setOptions = (patch: Partial<Options>) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "options",
      value: { ...state.options, ...patch },
    })
  }

  const setTaxMode = (mode: TaxMode) => {
    setOptions({
      showCGST: mode === "intra",
      showSGST: mode === "intra",
      showIGST: mode === "inter",
    })
  }

  const taxMode = taxModeOf(state.options)

  return (
    <>
      <InspectorSection title="Fields" hint="Show or hide optional parts of the invoice.">
        <div className="space-y-0.5">
          <SwitchRow
            label="PO number"
            checked={state.options.showPONumber}
            onChange={(value) => setOptions({ showPONumber: value })}
          />
          <SwitchRow
            label="Bank details"
            description="Account and IFSC in the footer"
            checked={state.options.showBankDetails}
            onChange={(value) => setOptions({ showBankDetails: value })}
          />
          <SwitchRow
            label="Digital stamp"
            description="Upload a signature or seal"
            checked={state.options.showDigitalStamp}
            onChange={(value) => setOptions({ showDigitalStamp: value })}
          />
        </div>
      </InspectorSection>

      <InspectorSection title="Tax" hint="The rate is edited on the invoice itself.">
        <div className="grid grid-cols-3 gap-1.5" role="group" aria-label="Tax type">
          {TAX_MODES.map((mode) => (
            <button
              key={mode.id}
              type="button"
              aria-pressed={taxMode === mode.id}
              onClick={() => setTaxMode(mode.id)}
              className="ed-option flex-col !items-start !gap-0 !px-2.5"
            >
              <span className="text-[13px] font-semibold leading-5">{mode.label}</span>
              <span className="text-xs font-normal leading-4">{mode.description}</span>
            </button>
          ))}
        </div>

        <div className="mt-3 space-y-0.5">
          <SwitchRow
            label="GSTIN"
            description="Your GST number under the address"
            checked={state.options.showGSTIN}
            onChange={(value) => setOptions({ showGSTIN: value })}
          />
          <SwitchRow
            label="HSN / SAC column"
            checked={state.options.showHSNCode}
            onChange={(value) => setOptions({ showHSNCode: value })}
          />
          <SwitchRow
            label="Reverse charge note"
            checked={state.options.showReverseCharge}
            onChange={(value) => setOptions({ showReverseCharge: value })}
          />
        </div>
      </InspectorSection>
    </>
  )
}
