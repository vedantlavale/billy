"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ProfessionPreset } from "@/components/invoice/ProfessionPreset"
import { OptionsPanel } from "@/components/invoice/OptionsPanel"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"
import { TEMPLATES } from "@/lib/templates"
import { CURRENCIES } from "@/lib/currencies"
import { useAuth } from "@/lib/auth-context"
import posthog from "posthog-js"

interface CustomizePanelProps {
  onClose: () => void
}

/**
 * Slide-over drawer holding everything configurational about the invoice:
 * template, currency, profession presets, and optional-field toggles. Lives
 * over the preview pane so the editor/preview split stays untouched beneath.
 */
export function CustomizePanel({ onClose }: CustomizePanelProps) {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()
  const { isAuthenticated } = useAuth()

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  const selectTemplate = (id: string, pro: boolean) => {
    if (pro && !isAuthenticated) return
    posthog.capture("template_selected", { template_id: id, is_pro: pro })
    dispatch({ type: "UPDATE_FIELD", field: "templateId", value: id })
  }

  return (
    <aside
      aria-label="Customize invoice"
      className="absolute inset-y-0 right-0 z-30 flex w-[360px] max-w-[92vw] flex-col border-l border-[#EBEBEE] bg-white shadow-[-8px_0_30px_rgba(11,11,15,0.08)] animate-in slide-in-from-right-4 fade-in duration-200"
    >
      <header className="flex items-center justify-between border-b border-[#EBEBEE] px-5 py-3">
        <h2 className="text-sm font-semibold text-[#0B0B0F]">Customize</h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close customize panel"
          className="app-btn app-btn--ghost size-7 !p-0"
        >
          <svg
            width={13}
            height={13}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M6 6 L18 18" />
            <path d="M18 6 L6 18" />
          </svg>
        </button>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <section className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Template
          </p>
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATES.map((template) => {
              const locked = template.pro && !isAuthenticated
              return (
                <button
                  key={template.id}
                  type="button"
                  disabled={locked}
                  data-selected={state.templateId === template.id || undefined}
                  onClick={() => selectTemplate(template.id, template.pro ?? false)}
                  className="app-option justify-start px-3 py-2 text-xs"
                >
                  <span
                    className="inline-block h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: template.colors.accent }}
                  />
                  <span className="truncate">{template.name}</span>
                  {template.pro && (
                    <span className="ml-auto shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">
                      PRO
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </section>

        <section className="space-y-3 border-t border-[#EBEBEE] pt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
            Currency
          </p>
          <Select
            value={state.currency}
            onValueChange={(value) =>
              dispatch({ type: "UPDATE_FIELD", field: "currency", value })
            }
          >
            <SelectTrigger className="app-input h-9 w-full px-3 text-xs font-medium">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.code} value={currency.code}>
                  {currency.symbol} {currency.code} — {currency.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </section>

        <section className="border-t border-[#EBEBEE] pt-5">
          <ProfessionPreset />
        </section>

        <section className="border-t border-[#EBEBEE] pt-5">
          <OptionsPanel />
        </section>
      </div>
    </aside>
  )
}
