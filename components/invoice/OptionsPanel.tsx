"use client"

import * as React from "react"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"
import { useAuth } from "@/lib/auth-context"

interface ToggleChipProps {
  label: string
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
  isProField?: boolean
}

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="12"
    height="12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)

const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="10"
    height="10"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="shrink-0 text-slate-400"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
)

function ToggleChip({
  label,
  checked,
  onChange,
  disabled,
  isProField,
}: ToggleChipProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-all select-none ${
        disabled
          ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed opacity-60"
          : checked
          ? "bg-[var(--invoice-ink)] border-[var(--invoice-ink)] text-white shadow-xs hover:opacity-90 cursor-pointer"
          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900 cursor-pointer"
      }`}
    >
      {checked && <CheckIcon />}
      {!checked && isProField && <LockIcon />}
      <span>{label}</span>
      {isProField && !checked && (
        <span className="rounded bg-amber-50 px-1 py-0.25 text-[8px] font-bold text-amber-700 uppercase tracking-wider">
          Pro
        </span>
      )}
    </button>
  )
}

export function OptionsPanel() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()
  const { profile } = useAuth()
  const isPro = profile?.plan === "pro"

  const setOption = (field: keyof typeof state.options, value: boolean) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "options",
      value: {
        ...state.options,
        [field]: value,
      },
    })
  }

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400 mb-2">
          Optional Fields
        </h3>
        <div className="flex flex-wrap gap-2">
          <ToggleChip
            label="PO Number"
            checked={state.options.showPONumber}
            onChange={(value) => setOption("showPONumber", value)}
          />
          <ToggleChip
            label="Bank Details"
            checked={state.options.showBankDetails}
            onChange={(value) => setOption("showBankDetails", value)}
          />
          <ToggleChip
            label="Digital Stamp"
            checked={state.options.showDigitalStamp}
            onChange={(value) => setOption("showDigitalStamp", value)}
          />
        </div>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            GST Features
          </h3>
          {!isPro && (
            <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
              Pro plan required
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <ToggleChip
            label="GSTIN"
            checked={state.options.showGSTIN}
            onChange={(value) => setOption("showGSTIN", value)}
            disabled={!isPro}
            isProField
          />
          <ToggleChip
            label="HSN/SAC Column"
            checked={state.options.showHSNCode}
            onChange={(value) => setOption("showHSNCode", value)}
            disabled={!isPro}
            isProField
          />
          <ToggleChip
            label="CGST"
            checked={state.options.showCGST}
            onChange={(value) => setOption("showCGST", value)}
            disabled={!isPro}
            isProField
          />
          <ToggleChip
            label="SGST"
            checked={state.options.showSGST}
            onChange={(value) => setOption("showSGST", value)}
            disabled={!isPro}
            isProField
          />
          <ToggleChip
            label="IGST"
            checked={state.options.showIGST}
            onChange={(value) => setOption("showIGST", value)}
            disabled={!isPro}
            isProField
          />
          <ToggleChip
            label="Reverse Charge"
            checked={state.options.showReverseCharge}
            onChange={(value) => setOption("showReverseCharge", value)}
            disabled={!isPro}
            isProField
          />
        </div>
      </div>
    </section>
  )
}
