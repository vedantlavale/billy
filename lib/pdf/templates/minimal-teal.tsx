import * as React from "react"
import { Page, View, Text } from "@react-pdf/renderer"
import type { InvoiceData } from "@/lib/types"
import { getThemeToken, spacing } from "@/lib/theme"
import { Logo, Label, ItemsTable, TotalsBox, FooterContent } from "../components"

export function MinimalTealPage({ data }: { data: InvoiceData }) {
  const t = getThemeToken("minimal-teal")
  const pad = spacing.pagePaddingMinimalTeal

  return (
    <Page size="A4" style={{ fontFamily: t.fontFamily, backgroundColor: t.colors.paper, color: t.colors.ink, fontSize: 10, lineHeight: 1.5 }}>
      <View style={{ padding: pad }}>
        {/* Centred header */}
        <View style={{
          alignItems: "center",
          borderBottomWidth: 2, borderBottomColor: t.colors.primary,
          paddingBottom: 16, marginBottom: 16,
        }}>
          <Logo data={data} t={t} />
          <Text style={{ fontSize: 16, fontWeight: 400, color: t.colors.primary, fontFamily: "InstrumentSerif", textTransform: "uppercase", marginTop: 12, lineHeight: 1.2 }}>I N V O I C E</Text>
          <Text style={{ fontSize: 26, fontWeight: 400, color: t.colors.ink, fontFamily: "InstrumentSerif", marginTop: 8, lineHeight: 1.2 }}>{data.businessName}</Text>
          <Text style={{ fontSize: 14, fontWeight: 400, color: t.colors.primary, fontFamily: "InstrumentSerif", fontStyle: "italic", marginTop: 4, lineHeight: 1.2 }}>{data.businessTagline}</Text>
          <Text style={{ fontSize: 9, color: t.colors.muted, marginTop: 10, textAlign: "center", lineHeight: 1.6 }}>
            {data.businessAddress}{"  "}•{"  "}{data.businessEmail}{"  "}•{"  "}{data.businessPhone}
            {data.options.showGSTIN && data.gstin ? `\nGSTIN: ${data.gstin}` : ""}
          </Text>
        </View>

        {/* Client + Meta side-by-side */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
          {/* Bill To */}
          <View style={{ width: "48%" }}>
            <Label text="Bill To" t={t} />
            <Text style={{ fontSize: 13, fontWeight: 700, color: t.colors.ink, marginBottom: 4 }}>{data.clientName}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted, lineHeight: 1.5 }}>{data.clientAddress}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted, marginTop: 4 }}>{data.clientEmail}</Text>
          </View>

          {/* Invoice Meta */}
          <View style={{ width: "46%", alignItems: "flex-end" }}>
            <View style={{ alignItems: "flex-end", marginBottom: 8 }}>
              <Label text="Invoice No." t={t} />
              <Text style={{ fontSize: 12, fontWeight: 600, color: t.colors.ink }}>{data.invoiceNumber}</Text>
            </View>
            <View style={{ alignItems: "flex-end", marginBottom: 8 }}>
              <Label text="Issue Date" t={t} />
              <Text style={{ fontSize: 12, fontWeight: 600, color: t.colors.ink }}>{data.invoiceDate}</Text>
            </View>
            <View style={{ alignItems: "flex-end", marginBottom: 8 }}>
              <Label text="Due Date" t={t} />
              <Text style={{ fontSize: 12, fontWeight: 600, color: t.colors.ink }}>{data.dueDate}</Text>
            </View>
            {data.options.showPONumber && (
              <View style={{ alignItems: "flex-end" }}>
                <Label text="PO Number" t={t} />
                <Text style={{ fontSize: 12, fontWeight: 600, color: t.colors.ink }}>{data.poNumber || ""}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Line items */}
        <ItemsTable data={data} t={t} />

        {/* Totals */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12 }}>
          <TotalsBox data={data} t={t} grandTotalBg={t.colors.primary} grandTotalTextColor="#ffffff" />
        </View>

        {/* Footer */}
        <View style={{ marginTop: 16, borderTopWidth: 1, borderTopColor: t.colors.border, paddingTop: 12 }} wrap={false}>
          <FooterContent data={data} t={t} />
        </View>
      </View>
    </Page>
  )
}
