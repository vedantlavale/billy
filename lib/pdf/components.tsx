import * as React from "react"
import { View, Text, Image } from "@react-pdf/renderer"
import type { InvoiceData } from "@/lib/types"
import { calculateLineItemAmount, calculateTotals, formatCurrency } from "@/lib/invoice"
import { DesignTheme } from "@/lib/theme"

export function Initials({ name, t }: { name: string; t: DesignTheme }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2)
    .map(w => w[0]?.toUpperCase()).join("") || "BI"
  return (
    <View style={{
      width: 64, height: 64, borderRadius: 8,
      borderWidth: 1, borderColor: t.colors.border,
      backgroundColor: "#f1f5f9",
      alignItems: "center", justifyContent: "center",
    }}>
      <Text style={{ fontSize: 18, fontWeight: 700, color: t.colors.muted, fontFamily: t.fontFamily }}>
        {initials}
      </Text>
    </View>
  )
}

export function Logo({ data, t }: { data: InvoiceData; t: DesignTheme }) {
  if (data.logoUrl) {
    return (
      <Image src={data.logoUrl} style={{
        width: 64, height: 64, borderRadius: 8,
        borderWidth: 1, borderColor: t.colors.border, objectFit: "contain",
      }} />
    )
  }
  return <Initials name={data.businessName} t={t} />
}

export function Stamp({ data, t }: { data: InvoiceData; t: DesignTheme }) {
  if (data.stampUrl) {
    return <Image src={data.stampUrl} style={{ width: 80, height: 80, objectFit: "contain" }} />
  }
  return (
    <View style={{
      width: 80, height: 80, borderRadius: 8,
      borderWidth: 1.5, borderStyle: "dashed", borderColor: t.colors.border,
    }} />
  )
}

export function Label({ text, t }: { text: string; t: DesignTheme }) {
  return (
    <Text style={{
      fontSize: 8, fontWeight: 700, color: t.colors.muted, fontFamily: t.fontFamily,
      textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 6,
    }}>
      {text}
    </Text>
  )
}

export function ItemsTable({ data, t, headerBg, headerTextColor, evenRowBg, cellPad, bordered }:
  { data: InvoiceData; t: DesignTheme; headerBg?: string; headerTextColor?: string; evenRowBg?: string; cellPad?: number; bordered?: boolean }) {

  const showHSN = data.options.showHSNCode
  const pad = cellPad ?? 0
  const hColor = headerTextColor ?? t.colors.muted

  if (bordered) {
    return (
      <View style={{ width: "100%", marginTop: 4, borderWidth: 1, borderColor: t.colors.border }}>
        {/* Header */}
        <View style={{
          flexDirection: "row", alignItems: "stretch",
          backgroundColor: headerBg ?? "transparent",
          borderBottomWidth: 1, borderBottomColor: t.colors.border,
        }}>
          <View style={{ flex: 4, padding: 8, borderRightWidth: 1, borderRightColor: t.colors.border }}>
            <Text style={{ fontSize: 8, fontWeight: 700, color: hColor, textTransform: "uppercase", letterSpacing: 1 }}>Description</Text>
          </View>
          {showHSN && (
            <View style={{ flex: 2, padding: 8, borderRightWidth: 1, borderRightColor: t.colors.border, alignItems: "center" }}>
              <Text style={{ fontSize: 8, fontWeight: 700, color: hColor, textTransform: "uppercase", letterSpacing: 1 }}>HSN/SAC</Text>
            </View>
          )}
          <View style={{ flex: 1, padding: 8, borderRightWidth: 1, borderRightColor: t.colors.border, alignItems: "flex-end" }}>
            <Text style={{ fontSize: 8, fontWeight: 700, color: hColor, textTransform: "uppercase", letterSpacing: 1 }}>Qty</Text>
          </View>
          <View style={{ flex: 2, padding: 8, borderRightWidth: 1, borderRightColor: t.colors.border, alignItems: "flex-end" }}>
            <Text style={{ fontSize: 8, fontWeight: 700, color: hColor, textTransform: "uppercase", letterSpacing: 1 }}>Rate</Text>
          </View>
          <View style={{ flex: 2, padding: 8, alignItems: "flex-end" }}>
            <Text style={{ fontSize: 8, fontWeight: 700, color: hColor, textTransform: "uppercase", letterSpacing: 1 }}>Amount</Text>
          </View>
        </View>

        {/* Rows */}
        {data.lineItems.map((item, i) => {
          const amount = calculateLineItemAmount(item)
          const rowBg = evenRowBg && i % 2 !== 0 ? evenRowBg : "transparent"
          const isLastRow = i === data.lineItems.length - 1
          return (
            <View key={item.id || i} wrap={false} style={{
              flexDirection: "row", alignItems: "stretch",
              backgroundColor: rowBg,
              ...(isLastRow ? {} : { borderBottomWidth: 1, borderBottomColor: t.colors.border })
            }}>
              <View style={{ flex: 4, padding: 8, borderRightWidth: 1, borderRightColor: t.colors.border }}>
                <Text style={{ fontSize: 10, color: t.colors.ink }}>{item.description}</Text>
              </View>
              {showHSN && (
                <View style={{ flex: 2, padding: 8, borderRightWidth: 1, borderRightColor: t.colors.border, alignItems: "center" }}>
                  <Text style={{ fontSize: 10, color: t.colors.ink }}>{item.hsnCode || ""}</Text>
                </View>
              )}
              <View style={{ flex: 1, padding: 8, borderRightWidth: 1, borderRightColor: t.colors.border, alignItems: "flex-end" }}>
                <Text style={{ fontSize: 10, color: t.colors.ink }}>{item.quantity}</Text>
              </View>
              <View style={{ flex: 2, padding: 8, borderRightWidth: 1, borderRightColor: t.colors.border, alignItems: "flex-end" }}>
                <Text style={{ fontSize: 10, fontFamily: "Inter", color: t.colors.ink }}>{formatCurrency(item.rate, data.currency)}</Text>
              </View>
              <View style={{ flex: 2, padding: 8, alignItems: "flex-end" }}>
                <Text style={{ fontSize: 10, fontFamily: "Inter", color: t.colors.ink }}>{formatCurrency(amount, data.currency)}</Text>
              </View>
            </View>
          )
        })}
      </View>
    )
  }

  return (
    <View style={{ width: "100%", marginTop: 4 }}>
      {/* Header */}
      <View style={{
        flexDirection: "row", alignItems: "center",
        borderBottomWidth: 1, borderBottomColor: t.colors.border,
        paddingVertical: 8,
        backgroundColor: headerBg ?? "transparent",
        paddingHorizontal: pad,
      }}>
        <Text style={{ flex: 4, fontSize: 8, fontWeight: 700, color: hColor, textTransform: "uppercase", letterSpacing: 1 }}>Description</Text>
        {showHSN && <Text style={{ flex: 2, fontSize: 8, fontWeight: 700, color: hColor, textTransform: "uppercase", letterSpacing: 1, textAlign: "center" }}>HSN/SAC</Text>}
        <Text style={{ flex: 1, fontSize: 8, fontWeight: 700, color: hColor, textTransform: "uppercase", letterSpacing: 1, textAlign: "right" }}>Qty</Text>
        <Text style={{ flex: 2, fontSize: 8, fontWeight: 700, color: hColor, textTransform: "uppercase", letterSpacing: 1, textAlign: "right", paddingRight: 4 }}>Rate</Text>
        <Text style={{ flex: 2, fontSize: 8, fontWeight: 700, color: hColor, textTransform: "uppercase", letterSpacing: 1, textAlign: "right", paddingRight: 4 }}>Amount</Text>
      </View>

      {/* Rows */}
      {data.lineItems.map((item, i) => {
        const amount = calculateLineItemAmount(item)
        const rowBg = evenRowBg && i % 2 !== 0 ? evenRowBg : "transparent"
        return (
          <View key={item.id || i} wrap={false} style={{
            flexDirection: "row", alignItems: "center",
            borderBottomWidth: 1, borderBottomColor: t.colors.border,
            paddingVertical: 10,
            backgroundColor: rowBg,
            paddingHorizontal: pad,
          }}>
            <Text style={{ flex: 4, fontSize: 10, color: t.colors.ink }}>{item.description}</Text>
            {showHSN && <Text style={{ flex: 2, fontSize: 10, color: t.colors.ink, textAlign: "center" }}>{item.hsnCode || ""}</Text>}
            <Text style={{ flex: 1, fontSize: 10, color: t.colors.ink, textAlign: "right" }}>{item.quantity}</Text>
            <Text style={{ flex: 2, fontSize: 10, fontFamily: "Inter", color: t.colors.ink, textAlign: "right", paddingRight: 4 }}>{formatCurrency(item.rate, data.currency)}</Text>
            <Text style={{ flex: 2, fontSize: 10, fontFamily: "Inter", color: t.colors.ink, textAlign: "right", paddingRight: 4 }}>{formatCurrency(amount, data.currency)}</Text>
          </View>
        )
      })}
    </View>
  )
}

export function TotalsBox({ data, t, grandTotalBg, grandTotalTextColor, bordered }:
  { data: InvoiceData; t: DesignTheme; grandTotalBg?: string; grandTotalTextColor?: string; bordered?: boolean }) {

  const totals = calculateTotals(data)
  const gstEnabled = data.options.showCGST || data.options.showSGST || data.options.showIGST

  return (
    <View style={{
      width: 220,
      ...(bordered ? { borderWidth: 1, borderColor: t.colors.border, padding: 12 } : {})
    }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
        <Text style={{ fontSize: 10, color: t.colors.muted }}>Subtotal</Text>
        <Text style={{ fontSize: 10, fontFamily: "Inter", color: t.colors.muted, paddingRight: 4 }}>{formatCurrency(totals.subtotal, data.currency)}</Text>
      </View>

      {/* Tax rows */}
      {!gstEnabled && (
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
          <Text style={{ fontSize: 10, color: t.colors.muted }}>{data.taxLabel || "Tax"} ({data.taxRate.toFixed(2)}%)</Text>
          <Text style={{ fontSize: 10, fontFamily: "Inter", color: t.colors.muted, paddingRight: 4 }}>{formatCurrency(totals.taxAmount, data.currency)}</Text>
        </View>
      )}
      {gstEnabled && data.options.showIGST && (
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
          <Text style={{ fontSize: 10, color: t.colors.muted }}>IGST ({data.taxRate.toFixed(2)}%)</Text>
          <Text style={{ fontSize: 10, fontFamily: "Inter", color: t.colors.muted, paddingRight: 4 }}>{formatCurrency(totals.igstAmount, data.currency)}</Text>
        </View>
      )}
      {gstEnabled && !data.options.showIGST && data.options.showCGST && (
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
          <Text style={{ fontSize: 10, color: t.colors.muted }}>CGST ({(data.taxRate / 2).toFixed(2)}%)</Text>
          <Text style={{ fontSize: 10, fontFamily: "Inter", color: t.colors.muted, paddingRight: 4 }}>{formatCurrency(totals.cgstAmount, data.currency)}</Text>
        </View>
      )}
      {gstEnabled && !data.options.showIGST && data.options.showSGST && (
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
          <Text style={{ fontSize: 10, color: t.colors.muted }}>SGST ({(data.taxRate / 2).toFixed(2)}%)</Text>
          <Text style={{ fontSize: 10, fontFamily: "Inter", color: t.colors.muted, paddingRight: 4 }}>{formatCurrency(totals.sgstAmount, data.currency)}</Text>
        </View>
      )}

      <View style={{ flexDirection: "row", justifyContent: "space-between", paddingVertical: 4 }}>
        <Text style={{ fontSize: 10, color: t.colors.muted }}>Discount ({data.discountRate.toFixed(2)}%)</Text>
        <Text style={{ fontSize: 10, fontFamily: "Inter", color: t.colors.muted, paddingRight: 4 }}>{formatCurrency(totals.discountAmount, data.currency)}</Text>
      </View>

      {/* Grand total */}
      <View style={{
        flexDirection: "row", justifyContent: "space-between", alignItems: "center",
        marginTop: 8,
        paddingTop: grandTotalBg ? 10 : 10,
        paddingBottom: grandTotalBg ? 10 : 0,
        paddingHorizontal: grandTotalBg ? 12 : 0,
        borderTopWidth: grandTotalBg ? 0 : 1,
        borderTopColor: t.colors.border,
        backgroundColor: grandTotalBg ?? "transparent",
      }}>
        <Text style={{ fontSize: 13, fontWeight: 700, color: grandTotalTextColor ?? t.colors.ink }}>Total</Text>
        <Text style={{ fontSize: 13, fontWeight: 700, fontFamily: "Inter", color: grandTotalTextColor ?? t.colors.ink, paddingRight: grandTotalBg ? 0 : 4 }}>
          {formatCurrency(calculateTotals(data).total, data.currency)}
        </Text>
      </View>
    </View>
  )
}

export function FooterContent({ data, t, textColor }: { data: InvoiceData; t: DesignTheme; textColor?: string }) {
  const tc = textColor ?? t.colors.muted
  const lc = textColor ?? t.colors.muted

  return (
    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
      <View style={{ flex: 1, paddingRight: 24 }}>
        <View>
          <Label text="Notes" t={{ ...t, colors: { ...t.colors, muted: lc } }} />
          <Text style={{ fontSize: 9, color: tc, lineHeight: 1.5 }}>{data.notes}</Text>
        </View>
        <View style={{ marginTop: 14 }}>
          <Label text="Payment Terms" t={{ ...t, colors: { ...t.colors, muted: lc } }} />
          <Text style={{ fontSize: 9, color: tc, lineHeight: 1.5 }}>{data.paymentTerms}</Text>
        </View>
        {data.options.showBankDetails && (
          <View style={{ marginTop: 14 }}>
            <Label text="Bank Details" t={{ ...t, colors: { ...t.colors, muted: lc } }} />
            <Text style={{ fontSize: 9, color: tc, lineHeight: 1.5 }}>
              {data.bankName ? `${data.bankName}\n` : ""}
              {data.bankAccount ? `${data.bankAccount}\n` : ""}
              {data.bankIfsc || ""}
            </Text>
          </View>
        )}
      </View>

      <View style={{ alignItems: "flex-end", justifyContent: "flex-end" }}>
        {data.options.showDigitalStamp && (
          <View style={{ alignItems: "flex-end" }}>
            <Label text="Stamp / Authorised Signatory" t={{ ...t, colors: { ...t.colors, muted: lc } }} />
            <Stamp data={data} t={t} />
          </View>
        )}
        {data.options.showReverseCharge && data.reverseChargeLabel && (
          <Text style={{ fontSize: 9, color: tc, fontWeight: 600, marginTop: 10 }}>
            {data.reverseChargeLabel}
          </Text>
        )}
      </View>
    </View>
  )
}
