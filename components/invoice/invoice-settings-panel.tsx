"use client"

import * as React from "react"
import { Collapsible } from "radix-ui"
import { HugeiconsIcon } from "@hugeicons/react"
import { SlidersHorizontalIcon, ArrowDown01Icon } from "@hugeicons/core-free-icons"

import { ProfessionPreset } from "@/components/invoice/ProfessionPreset"
import { OptionsPanel } from "@/components/invoice/OptionsPanel"
import { useInvoiceState } from "@/components/invoice/invoice-context"

/**
 * Presets and field toggles live behind a slim, collapsible header so the
 * canvas stays focused on the invoice itself. Collapsed by default; one click
 * reveals the full set of controls.
 */
export function InvoiceSettingsPanel() {
  const [open, setOpen] = React.useState(false)
  const state = useInvoiceState()

  const enabledCount = React.useMemo(
    () => Object.values(state.options ?? {}).filter(Boolean).length,
    [state.options],
  )

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className="w-full max-w-[794px] overflow-hidden rounded-2xl border border-[var(--invoice-panel-border)] bg-[var(--invoice-panel)] shadow-sm"
    >
      <Collapsible.Trigger asChild>
        <button
          type="button"
          className="group flex w-full items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors hover:bg-[var(--invoice-desk)]"
        >
          <span className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-full border border-[var(--invoice-panel-border)] bg-[var(--invoice-desk)] text-[var(--invoice-muted)]">
              <HugeiconsIcon icon={SlidersHorizontalIcon} size={15} />
            </span>
            <span className="text-sm font-medium text-[var(--invoice-ink)]">
              Invoice setup
            </span>
          </span>
          <span className="flex items-center gap-2.5 text-xs text-[var(--invoice-muted)]">
            <span className="hidden sm:inline">
              {open
                ? "Hide options"
                : enabledCount > 0
                  ? `${enabledCount} enabled`
                  : "Presets & fields"}
            </span>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={16}
              className="transition-transform duration-200 group-data-[state=open]:rotate-180"
            />
          </span>
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content className="collapsible-content">
        <div className="space-y-4 border-t border-[var(--invoice-panel-border)] px-5 pb-5 pt-4">
          <ProfessionPreset />
          <div className="border-t border-[var(--invoice-panel-border)] pt-4">
            <OptionsPanel />
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  )
}
