"use client"

import * as React from "react"
import posthog from "posthog-js"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { InspectorSection } from "@/components/invoice/editor-ui"
import { PAYMENT_TERMS, addDays, currentTermDays } from "@/lib/payment-terms"
import { OptionsPanel } from "@/components/invoice/OptionsPanel"
import { ProfessionPreset } from "@/components/invoice/ProfessionPreset"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"
import { useToast } from "@/components/ui/toast"
import { useFounder } from "@/lib/founder"
import {
  CURRENCIES,
  TEMPLATES,
  calculateTotals,
  formatCurrency,
  type Template,
} from "@billy/invoice-core"
import {
  CheckIcon,
  LockIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  LayoutGridIcon,
  PointerIcon,
  SlidersIcon,
  XIcon,
} from "@/components/icons/rune"

function formatDueDate(iso: string) {
  const date = new Date(`${iso}T00:00:00`)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })
}

function daysUntil(iso: string) {
  const due = new Date(`${iso}T00:00:00`).getTime()
  if (Number.isNaN(due)) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((due - today.getTime()) / 86_400_000)
}

function dueLabel(iso: string) {
  const days = daysUntil(iso)
  if (days === null) return null
  if (days === 0) return "Due today"
  if (days > 0) return `Due in ${days} day${days === 1 ? "" : "s"}`
  return `${-days} day${days === -1 ? "" : "s"} overdue`
}

const noopSubscribe = () => () => {}

/**
 * /editor is statically prerendered, so anything that depends on the
 * visitor's locale or today's date must wait until after hydration or React
 * throws a text mismatch (#11). Until then the summary shows the ISO date.
 */
function useHydrated() {
  return React.useSyncExternalStore(noopSubscribe, () => true, () => false)
}

function Summary() {
  const state = useInvoiceState()
  const hydrated = useHydrated()
  const totals = React.useMemo(() => calculateTotals(state), [state])
  const itemCount = state.lineItems.length
  const due = hydrated ? dueLabel(state.dueDate) : null

  return (
    <section className="ed-section">
      <div className="ed-summary">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold leading-4">Amount due</span>
          {due && <span className="ed-chip">{due}</span>}
        </div>
        <p className="ed-summary-amount">{formatCurrency(totals.total, state.currency)}</p>
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 border-t border-[#E5E7EB] pt-3 text-xs leading-4">
          <dt>Billed to</dt>
          <dd className="truncate text-right font-semibold">{state.clientName || "Not set"}</dd>
          <dt>Due date</dt>
          <dd className="text-right font-semibold">{hydrated ? formatDueDate(state.dueDate) : state.dueDate}</dd>
          <dt>Line items</dt>
          <dd className="text-right font-semibold">{itemCount}</dd>
        </dl>
      </div>
    </section>
  )
}

/** A tiny abstract drawing of the template, coloured with its own palette. */
function TemplateThumb({ template }: { template: Template }) {
  const c = template.colors
  const band = ["modern-green", "corporate-blue", "studio", "letterhead", "founders"].includes(template.id)
  return (
    <span className="ed-template-thumb block" style={{ backgroundColor: c.paper }} aria-hidden>
      {band && (
        <span
          className="absolute inset-x-0 top-0 h-[26%]"
          style={{ background: template.id === "founders" ? "linear-gradient(120deg, #2f6bff, #3c8dff 60%, #6fd0ff)" : c.primary }}
        />
      )}
      <span className="absolute left-[10%] top-[10%] h-[8%] w-[34%] rounded-[2px]" style={{ backgroundColor: c.ink, opacity: 0.85 }} />
      <span className="absolute right-[10%] top-[11%] h-[4%] w-[22%] rounded-[2px]" style={{ backgroundColor: c.muted, opacity: 0.6 }} />
      <span className="absolute left-[10%] right-[10%] top-[40%] h-[7%] rounded-[2px]" style={{ backgroundColor: c.accent, opacity: 0.9 }} />
      {[52, 62, 72].map((top) => (
        <span
          key={top}
          className="absolute left-[10%] right-[10%] h-px"
          style={{ top: `${top}%`, backgroundColor: c.border }}
        />
      ))}
      <span className="absolute bottom-[10%] right-[10%] h-[7%] w-[30%] rounded-[2px]" style={{ backgroundColor: c.accent }} />
    </span>
  )
}

function TemplateGrid() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()
  const founder = useFounder()
  const { toast } = useToast()

  const select = (template: Template) => {
    if (template.foundersOnly && !founder && state.templateId !== template.id) {
      toast("The Early Bird template is for billy's early birds.", "info")
      return
    }
    posthog.capture("template_selected", { template_id: template.id, is_pro: template.pro })
    dispatch({ type: "UPDATE_FIELD", field: "templateId", value: template.id })
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      {TEMPLATES.map((template) => {
        const selected = state.templateId === template.id
        const locked = Boolean(template.foundersOnly && !founder && !selected)
        return (
          <button
            key={template.id}
            type="button"
            aria-pressed={selected}
            aria-disabled={locked || undefined}
            title={locked ? "For billy's early birds" : template.description}
            onClick={() => select(template)}
            className="ed-template"
            data-locked={locked || undefined}
          >
            <span className="relative block">
              <TemplateThumb template={template} />
              {/* The badge sits on the thumbnail so the name gets the whole
                  cell width — at this rail width it was truncating to
                  "Corporate …" and "Mono Eleg…". */}
              {selected ? (
                <span className="ed-template-badge" aria-hidden>
                  <CheckIcon size={11} strokeWidth={3} />
                </span>
              ) : locked ? (
                <span className="ed-template-pro ed-template-founders">
                  <LockIcon size={9} strokeWidth={2.5} /> Early Bird
                </span>
              ) : (
                template.pro && <span className="ed-template-pro">Pro</span>
              )}
            </span>
            <span className="block truncate px-0.5 text-[12px] font-semibold leading-4">
              {template.name}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function CurrencyField() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()

  return (
    <InspectorSection title="Currency">
      <Select
        value={state.currency}
        onValueChange={(value) => dispatch({ type: "UPDATE_FIELD", field: "currency", value })}
      >
        <SelectTrigger className="!h-10 !rounded-[7px] !border-[#E5E7EB] !px-3 !text-sm !font-medium !text-[#37352f] hover:!bg-[#F3F4F6]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="!rounded-lg !border-[#E5E7EB]">
          {CURRENCIES.map((currency) => (
            <SelectItem key={currency.code} value={currency.code} className="!text-sm">
              {currency.symbol} {currency.code} · {currency.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </InspectorSection>
  )
}

function PaymentTerms() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()
  const current = currentTermDays(state.invoiceDate, state.dueDate)

  return (
    <InspectorSection title="Payment terms" hint="Sets the due date from the issue date.">
      <div className="ed-terms" role="group" aria-label="Payment terms">
        {PAYMENT_TERMS.map((term) => (
          <button
            key={term.days}
            type="button"
            aria-pressed={current === term.days}
            onClick={() =>
              dispatch({ type: "UPDATE_FIELD", field: "dueDate", value: addDays(state.invoiceDate, term.days) })
            }
            className="ed-option"
          >
            {term.label}
          </button>
        ))}
      </div>
    </InspectorSection>
  )
}

/** Everything that isn't the template gallery: totals, terms, options. */
function SetupSections() {
  return (
    <>
      <Summary />
      <PaymentTerms />
      <CurrencyField />
      <ProfessionPreset />
      <OptionsPanel />
      <section className="ed-section">
        <p className="flex items-start gap-2 text-xs leading-4">
          <PointerIcon size={14} className="mt-px shrink-0" aria-hidden />
          Everything else, from names and dates to line items and rates, is edited by clicking
          it on the invoice.
        </p>
      </section>
    </>
  )
}

/**
 * One rail. Collapsed it becomes a slim strip on the same edge rather than
 * disappearing, so the way back in stays where the rail was.
 */
function Rail({
  side,
  title,
  icon,
  collapsed,
  onToggle,
  children,
}: {
  side: "left" | "right"
  title: string
  icon: React.ReactNode
  collapsed: boolean
  onToggle: (next: boolean) => void
  children: React.ReactNode
}) {
  if (collapsed) {
    return (
      <div className="ed-rail-strip hidden lg:flex" data-side={side}>
        <button
          type="button"
          onClick={() => onToggle(false)}
          className="ed-rail-tab"
          title={`Show ${title.toLowerCase()}`}
          aria-label={`Show ${title.toLowerCase()}`}
          aria-expanded={false}
        >
          {icon}
        </button>
        <span className="ed-rail-hint" aria-hidden>
          {side === "left" ? <ChevronRightIcon size={13} /> : <ChevronLeftIcon size={13} />}
        </span>
      </div>
    )
  }

  return (
    <aside className="ed-inspector ed-chrome hidden lg:flex" data-side={side} aria-label={title}>
      <div className="ed-rail-head">
        <h2 className="ed-rail-title">
          {icon}
          {title}
        </h2>
        <button
          type="button"
          onClick={() => onToggle(true)}
          className="ed-btn ed-btn--ghost ed-btn--icon"
          title={`Hide ${title.toLowerCase()}`}
          aria-label={`Hide ${title.toLowerCase()}`}
          aria-expanded
        >
          {side === "left" ? <ChevronLeftIcon size={16} /> : <ChevronRightIcon size={16} />}
        </button>
      </div>
      <div className="ed-inspector-scroll">{children}</div>
    </aside>
  )
}

export function TemplateRail({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: (next: boolean) => void
}) {
  return (
    <Rail
      side="left"
      title="Templates"
      icon={<LayoutGridIcon size={15} aria-hidden />}
      collapsed={collapsed}
      onToggle={onToggle}
    >
      <section className="ed-section">
        <TemplateGrid />
      </section>
    </Rail>
  )
}

export function SetupRail({
  collapsed,
  onToggle,
}: {
  collapsed: boolean
  onToggle: (next: boolean) => void
}) {
  return (
    <Rail
      side="right"
      title="Setup"
      icon={<SlidersIcon size={15} aria-hidden />}
      collapsed={collapsed}
      onToggle={onToggle}
    >
      <SetupSections />
    </Rail>
  )
}

/**
 * Below `lg` there is no room for rails, so both panes stack in one
 * slide-over opened from the top bar. The template gallery lives here too —
 * it is the only way to reach it on a narrow screen.
 */
export function InspectorDrawer({ onClose }: { onClose: () => void }) {
  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <>
      <div className="ed-backdrop animate-in fade-in duration-200" onClick={onClose} aria-hidden />
      <aside
        aria-label="Invoice settings"
        className="ed-inspector ed-chrome fixed inset-y-0 left-0 z-50 flex max-w-[92vw] shadow-[8px_0_30px_-12px_rgba(55,53,47,0.25)] animate-in slide-in-from-left-4 fade-in duration-200"
      >
        <div className="ed-rail-head">
          <h2 className="ed-rail-title">Invoice settings</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close settings"
            className="ed-btn ed-btn--ghost ed-btn--icon"
          >
            <XIcon size={16} />
          </button>
        </div>
        <div className="ed-inspector-scroll">
          <SetupSections />
          <InspectorSection title="Template">
            <TemplateGrid />
          </InspectorSection>
        </div>
      </aside>
    </>
  )
}
