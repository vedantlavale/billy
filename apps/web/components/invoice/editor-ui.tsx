"use client"

import * as React from "react"

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
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className="ed-switch-row"
    >
      <span className="min-w-0">
        <span className="block">{label}</span>
        {description && (
          <span className="block text-xs font-normal leading-4">{description}</span>
        )}
      </span>
      <span className="ed-switch" data-on={checked} aria-hidden />
    </button>
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
