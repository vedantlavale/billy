'use client'

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { AddInvoiceIcon, Delete02Icon } from "@hugeicons/core-free-icons"

import { EditableNumber } from "@/components/invoice/editable-number"
import { EditableText } from "@/components/invoice/editable-text"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"
import { useReadOnly } from "@/components/invoice/render-mode"
import { calculateLineItemAmount, formatCurrency } from "@/lib/invoice"
import { Button } from "@/components/ui/button"

export function LineItemsTable() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()
  const readOnly = useReadOnly()
  const showHSN = state.options.showHSNCode

  return (
    <section className="line-items-section space-y-4">
      <div
        data-break-block
        className={`line-items-header grid gap-3 border-b border-slate-200 pb-3 text-xs font-semibold uppercase text-slate-400 ${
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
                  : `transition hover:border-slate-200 hover:bg-slate-50/70 focus-within:border-slate-300 focus-within:bg-white ${
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
                className="text-sm text-slate-800"
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
                  className="text-sm text-slate-700"
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
              <span className="text-right font-mono text-sm text-slate-700">
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
                  className="text-slate-400 opacity-0 transition hover:text-red-600 group-hover:opacity-100 focus-visible:opacity-100"
                  aria-label="Remove line item"
                >
                  <HugeiconsIcon icon={Delete02Icon} size={16} />
                </Button>
              )}
            </div>
          )
        })}
      </div>
      {!readOnly && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => dispatch({ type: "ADD_LINE_ITEM" })}
          data-break-block
          className="app-btn app-btn--ghost h-8 gap-2 px-3 text-xs font-medium"
        >
          <HugeiconsIcon icon={AddInvoiceIcon} size={16} />
          Add Item
        </Button>
      )}
    </section>
  )
}
