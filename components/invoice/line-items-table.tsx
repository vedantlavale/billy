'use client'

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { AddInvoiceIcon, Delete02Icon } from "@hugeicons/core-free-icons"

import { EditableNumber } from "@/components/invoice/editable-number"
import { EditableText } from "@/components/invoice/editable-text"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"
import { calculateLineItemAmount, formatCurrency } from "@/lib/invoice"
import { Button } from "@/components/ui/button"

export function LineItemsTable() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-[2fr_0.6fr_0.8fr_0.8fr] gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
        <span>Description</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Rate</span>
        <span className="text-right">Amount</span>
      </div>
      <div className="space-y-3">
        {state.lineItems.map((item) => {
          const amount = calculateLineItemAmount(item)

          return (
            <div
              key={item.id}
              className="group grid grid-cols-[2fr_0.6fr_0.8fr_0.8fr_auto] items-center gap-3 rounded-lg border border-transparent px-2 py-3 transition hover:border-slate-200"
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
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() =>
                  dispatch({ type: "REMOVE_LINE_ITEM", id: item.id })
                }
                className="opacity-0 transition group-hover:opacity-100"
                aria-label="Remove line item"
              >
                <HugeiconsIcon icon={Delete02Icon} size={16} />
              </Button>
            </div>
          )
        })}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => dispatch({ type: "ADD_LINE_ITEM" })}
        className="gap-2 rounded-full border-slate-200 text-slate-600 hover:text-slate-900"
      >
        <HugeiconsIcon icon={AddInvoiceIcon} size={16} />
        Add Item
      </Button>
    </section>
  )
}
