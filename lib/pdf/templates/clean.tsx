import * as React from "react"
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer"
import type { InvoiceData } from "@/lib/types"
import { getThemeToken, spacing } from "@/lib/theme"
import { Logo, Label, ItemsTable, TotalsBox, FooterContent } from "../components"

export function CleanPage({ data }: { data: InvoiceData }) {
  const t = getThemeToken("clean")
  const pad = spacing.pagePaddingClean
  const s = StyleSheet.create({
    page: { fontFamily: t.fontFamily, backgroundColor: t.colors.paper, color: t.colors.ink, fontSize: 10, lineHeight: 1.5 },
    section: { borderBottomWidth: 1, borderBottomColor: t.colors.border, paddingVertical: 12 },
  })

  return (
    <Page size="A4" style={s.page}>
      <View style={{ padding: pad }}>
        {/* Header */}
        <View style={[s.section, { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }]}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}>
            <Logo data={data} t={t} />
            <View>
              <Text style={{ fontSize: 22, fontWeight: 700, color: t.colors.ink, lineHeight: 1.2 }}>{data.businessName}</Text>
              <Text style={{ fontSize: 9, fontWeight: 700, color: t.colors.muted, textTransform: "uppercase", letterSpacing: 2, marginTop: 6 }}>{data.businessTagline}</Text>
            </View>
          </View>
          <View style={{ textAlign: "right" }}>
            <Text style={{ fontSize: 10, color: t.colors.muted, lineHeight: 1.6 }}>{data.businessAddress}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted }}>{data.businessEmail}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted }}>{data.businessPhone}</Text>
            {data.options.showGSTIN && data.gstin && <Text style={{ fontSize: 10, color: t.colors.muted }}>GSTIN: {data.gstin}</Text>}
          </View>
        </View>

        {/* Bill To */}
        <View style={[s.section, { flexDirection: "row", gap: 18 }]}>
          <View style={{ width: 90, flexShrink: 0 }}>
            <Label text="Bill To" t={t} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: 700, color: t.colors.ink, marginBottom: 6 }}>{data.clientName}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted, lineHeight: 1.5 }}>{data.clientAddress}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted, marginTop: 6 }}>{data.clientEmail}</Text>
          </View>
        </View>

        {/* Meta: Invoice No / Dates */}
        <View style={[s.section, { flexDirection: "row", gap: 18 }]}>
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
        <View style={s.section}>
          <ItemsTable data={data} t={t} />
          <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 18 }}>
            <TotalsBox data={data} t={t} />
          </View>
        </View>

        {/* Footer */}
        <View style={{ paddingTop: 20 }} wrap={false}>
          <FooterContent data={data} t={t} />
        </View>
      </View>
    </Page>
  )
}
