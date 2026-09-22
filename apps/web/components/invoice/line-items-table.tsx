'use client'

import * as React from "react"

import { EditableNumber } from "@/components/invoice/editable-number"
import { EditableText } from "@/components/invoice/editable-text"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"
import { useReadOnly } from "@/components/invoice/render-mode"
import { calculateLineItemAmount, formatCurrency } from "@billy/invoice-core"
import { Button } from "@/components/ui/button"
import { PlusIcon, TrashIcon } from "@/components/icons/rune"

export function LineItemsTable() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()
  const readOnly = useReadOnly()
  const showHSN = state.options.showHSNCode

  return (
    <section className="line-items-section space-y-4">
      <div
        data-break-block
        className={`line-items-header grid gap-3 border-b border-[var(--invoice-border)] pb-3 text-xs font-semibold uppercase text-[var(--invoice-subtle)] ${
          showHSN
            ? "grid-cols-[2fr_0.8fr_0.6fr_0.8fr_0.8fr]"
            : "grid-cols-[2fr_0.6fr_0.8fr_0.8fr]"
        }`}
      >
        <span>Description</span>
        {showHSN && <span>HSN/SAC</span>}
        <span className="text-right">Qty</span>
        <span className="text-right">Rate</span>
        <span className="text-right">Amount</span>
      </div>
      <div className="line-items-body space-y-3">
        {state.lineItems.map((item) => {
          const amount = calculateLineItemAmount(item)

          return (
            <div
              key={item.id}
              data-break-block
              className={`line-item-row group grid items-center gap-3 rounded-md border border-transparent px-2 py-3 ${
                readOnly
                  ? showHSN
                    ? "grid-cols-[2fr_0.8fr_0.6fr_0.8fr_0.8fr]"
                    : "grid-cols-[2fr_0.6fr_0.8fr_0.8fr]"
                  : `transition hover:border-[var(--invoice-border)] hover:bg-[rgba(0,112,215,0.04)] focus-within:border-[var(--invoice-border)] focus-within:bg-white ${
                      showHSN
                        ? "grid-cols-[2fr_0.8fr_0.6fr_0.8fr_0.8fr_auto]"
                        : "grid-cols-[2fr_0.6fr_0.8fr_0.8fr_auto]"
                    }`
              }`}
            >
              <EditableText
                value={item.description}
                onCommit={(value) =>
                  dispatch({
                    type: "UPDATE_LINE_ITEM",
                    id: item.id,
                    field: "description",
                    value,
                  })
                }
                placeholder="Service or item description"
                className="text-sm text-[var(--invoice-ink)]"
              />
              {showHSN && (
                <EditableText
                  value={item.hsnCode}
                  onCommit={(value) =>
                    dispatch({
                      type: "UPDATE_LINE_ITEM",
                      id: item.id,
                      field: "hsnCode",
                      value,
                    })
                  }
                  placeholder="HSN/SAC"
                  className="text-sm text-[var(--invoice-muted)]"
                />
              )}
              <EditableNumber
                value={item.quantity}
                onCommit={(value) =>
                  dispatch({
                    type: "UPDATE_LINE_ITEM",
                    id: item.id,
                    field: "quantity",
                    value,
                  })
                }
                min={0}
                step={1}
                decimals={0}
                className="justify-end text-sm"
              />
              <EditableNumber
                value={item.rate}
                onCommit={(value) =>
                  dispatch({
                    type: "UPDATE_LINE_ITEM",
                    id: item.id,
                    field: "rate",
                    value,
                  })
                }
                min={0}
                step={0.01}
                currency={state.currency}
                className="justify-end text-sm"
              />
              <span className="text-right font-mono text-sm text-[var(--invoice-muted)]">
                {formatCurrency(amount, state.currency)}
              </span>
              {!readOnly && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={() =>
                    dispatch({ type: "REMOVE_LINE_ITEM", id: item.id })
                  }
                  className="text-[var(--invoice-subtle)] opacity-0 transition hover:text-[#D92D20] group-hover:opacity-100 focus-visible:opacity-100"
                  aria-label="Remove line item"
                >
                  <TrashIcon size={16} />
                </Button>
              )}
            </div>
          )
        })}
      </div>
      {!readOnly && (
        <button
          type="button"
          onClick={() => dispatch({ type: "ADD_LINE_ITEM" })}
          data-break-block
          className="flex w-full items-center justify-center gap-2 rounded-[7px] border border-dashed border-[#D1D5DB] py-2.5 text-sm font-medium text-[#37352f] transition-colors hover:border-[#0070D7] hover:bg-[#0070D7]/[0.04] hover:text-[#0070D7] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0070D7]"
          style={{ fontFamily: "var(--font-inter), Inter, sans-serif" }}
        >
          <PlusIcon size={16} />
          Add line item
        </button>
      )}
    </section>
  )
}
