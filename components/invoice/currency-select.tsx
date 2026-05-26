"use client"

import * as React from "react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useInvoiceDispatch, useInvoiceState } from "@/components/invoice/invoice-context"
import { CURRENCIES, getCurrency } from "@/lib/currencies"

export function CurrencySelect() {
  const state = useInvoiceState()
  const dispatch = useInvoiceDispatch()

  return (
    <Select
      value={state.currency}
      onValueChange={(value) =>
        dispatch({ type: "UPDATE_FIELD", field: "currency", value })
      }
    >
      <SelectTrigger className="w-[160px]">
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
  )
}
