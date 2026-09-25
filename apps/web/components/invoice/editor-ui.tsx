"use client"

import * as React from "react"

import { Switch } from "@/components/motion/switch"

/**
 * Small building blocks for the editor chrome (inspector, top bar). Styling
 * lives in globals.css under `.ed-*` so the whole chrome follows root
 * DESIGN.md from one place.
 */

export function InspectorSection({
  title,
  hint,
  icon,
  action,
  children,
}: {
  title: string
  hint?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="ed-section">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="ed-section-title">
            {icon}
            {title}
          </h2>
          {hint && <p className="ed-section-hint">{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

/**
 * A labelled row with the animated beUI switch on the right. The whole row is
 * a <label> for the switch, so clicking the text toggles it too.
 */
export function SwitchRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (value: boolean) => void
  disabled?: boolean
}) {
  const id = React.useId()
  const descriptionId = `${id}-description`
  return (
    <label htmlFor={id} className="ed-switch-row" data-disabled={disabled || undefined}>
      <span className="min-w-0">
        <span className="block">{label}</span>
        {description && (
          <span id={descriptionId} className="block text-xs font-normal leading-4">
            {description}
          </span>
        )}
      </span>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        ariaDescribedBy={description ? descriptionId : undefined}
      />
    </label>
  )
}

export function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="ed-kbd">{children}</kbd>
}

const noopSubscribe = () => () => {}

/** "⌘" on Apple platforms, "Ctrl" elsewhere (and during SSR, to stay hydration-safe). */
export function useModKey() {
  return React.useSyncExternalStore(
    noopSubscribe,
    () => (/Mac|iPhone|iPad/.test(navigator.userAgent) ? "⌘" : "Ctrl"),
    () => "Ctrl",
  )
}

function useMediaQuery(query: string) {
  const subscribe = React.useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query)
      list.addEventListener("change", onChange)
      return () => list.removeEventListener("change", onChange)
    },
    [query],
  )
  return React.useSyncExternalStore(subscribe, () => window.matchMedia(query).matches, () => false)
}

/** True on touch-first devices, where keyboard hints mean nothing. */
export function useCoarsePointer() {
  return useMediaQuery("(pointer: coarse)")
}

/** A phone held sideways: wide enough to fit the page, too short to type in it. */
export function useShortScreen() {
  return useMediaQuery("(max-height: 500px)")
}

function readFlag(key: string, fallback: boolean) {
  try {
    const stored = localStorage.getItem(key)
    return stored === null ? fallback : stored === "1"
  } catch {
    return fallback
  }
}

/**
 * A boolean kept in localStorage — used for the rails' open/closed state.
 *
 * /editor is statically prerendered, so the server and the first client
 * render must agree. Both use `fallback`; the stored value is adopted after
 * hydration, the same way the canvas hint does it (#11). Reading
 * localStorage during render brings the mismatch straight back.
 *
 * Deliberately its own key, never part of `billy_invoice_data`: this is a
 * preference about the chrome, not invoice data.
 */
export function usePersistedFlag(key: string, fallback: boolean) {
  const stored = React.useSyncExternalStore(
    noopSubscribe,
    () => readFlag(key, fallback),
    () => fallback,
  )
  const [override, setOverride] = React.useState<boolean | null>(null)
  const set = React.useCallback(
    (next: boolean) => {
      setOverride(next)
      try {
        localStorage.setItem(key, next ? "1" : "0")
      } catch {}
    },
    [key],
  )
  return [override ?? stored, set] as const
}
