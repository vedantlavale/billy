import * as React from "react"
import { Page, View, Text } from "@react-pdf/renderer"
import type { InvoiceData } from "@/lib/types"
import { getThemeToken, spacing } from "@/lib/theme"
import { Logo, Label, ItemsTable, TotalsBox, FooterContent } from "../components"

export function CorporateBluePage({ data }: { data: InvoiceData }) {
  const t = getThemeToken("corporate-blue")
  const pad = spacing.pagePaddingCorporateBlue

  return (
    <Page size="A4" style={{ fontFamily: t.fontFamily, backgroundColor: t.colors.paper, color: t.colors.ink, fontSize: 10, lineHeight: 1.5 }}>
      <View style={{ padding: pad }}>
        {/* Header */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", borderBottomWidth: 2, borderBottomColor: t.colors.ink, paddingBottom: 12, marginBottom: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
            <Logo data={data} t={t} />
            <View>
              <Text style={{ fontSize: 22, fontWeight: 700, color: t.colors.ink, lineHeight: 1.2 }}>{data.businessName}</Text>
              <Text style={{ fontSize: 9, fontWeight: 500, color: t.colors.muted, textTransform: "uppercase", letterSpacing: 1.5, marginTop: 5 }}>{data.businessTagline}</Text>
            </View>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={{ fontSize: 10, color: t.colors.muted, lineHeight: 1.6 }}>{data.businessAddress}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted }}>{data.businessEmail}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted }}>{data.businessPhone}</Text>
            {data.options.showGSTIN && data.gstin && <Text style={{ fontSize: 10, color: t.colors.muted }}>GSTIN: {data.gstin}</Text>}
          </View>
        </View>

        {/* INVOICE label */}
        <Text style={{ fontSize: 28, fontWeight: 700, color: t.colors.ink, marginBottom: 12 }}>INVOICE</Text>

        {/* Bill To */}
        <View style={{ flexDirection: "row", gap: 18, borderBottomWidth: 1, borderBottomColor: t.colors.border, paddingBottom: 12, marginBottom: 12 }}>
          <View style={{ width: 90, flexShrink: 0 }}>
            <Label text="Bill To" t={t} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: 700, color: t.colors.ink, marginBottom: 4 }}>{data.clientName}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted, lineHeight: 1.5 }}>{data.clientAddress}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted, marginTop: 6 }}>{data.clientEmail}</Text>
          </View>
        </View>

        {/* Meta */}
        <View style={{ flexDirection: "row", gap: 18, borderBottomWidth: 1, borderBottomColor: t.colors.border, paddingBottom: 12, marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Label text="Invoice No." t={t} />
            <Text style={{ fontSize: 12, fontWeight: 600, color: t.colors.ink }}>{data.invoiceNumber}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Label text="Issue Date" t={t} />
            <Text style={{ fontSize: 12, fontWeight: 600, color: t.colors.ink }}>{data.invoiceDate}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Label text="Due Date" t={t} />
            <Text style={{ fontSize: 12, fontWeight: 600, color: t.colors.ink }}>{data.dueDate}</Text>
          </View>
          {data.options.showPONumber && (
            <View style={{ flex: 1 }}>
              <Label text="PO Number" t={t} />
              <Text style={{ fontSize: 12, fontWeight: 600, color: t.colors.ink }}>{data.poNumber || ""}</Text>
            </View>
          )}
        </View>

        {/* Line items */}
        <ItemsTable data={data} t={t} headerBg={t.colors.primary} headerTextColor="#ffffff" evenRowBg={t.colors.secondary} cellPad={8} />

        {/* Totals */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12 }}>
          <TotalsBox data={data} t={t} grandTotalBg={t.colors.primary} grandTotalTextColor="#ffffff" />
        </View>

        {/* Footer */}
        <View style={{ borderTopWidth: 1, borderTopColor: t.colors.border, paddingTop: 12, marginTop: 12 }} wrap={false}>
          <FooterContent data={data} t={t} />
        </View>
      </View>
    </Page>
  )
}
