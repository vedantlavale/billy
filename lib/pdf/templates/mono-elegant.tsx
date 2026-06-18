import * as React from "react"
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer"
import type { InvoiceData } from "@/lib/types"
import { getThemeToken, spacing } from "@/lib/theme"
import { Logo, ItemsTable, TotalsBox, FooterContent } from "../components"

export function MonoElegantPage({ data }: { data: InvoiceData }) {
  const t = getThemeToken("mono-elegant")
  const pad = spacing.pagePaddingMonoElegant
  const s = StyleSheet.create({
    page: { fontFamily: t.fontFamily, backgroundColor: t.colors.paper, color: t.colors.ink, fontSize: 11, lineHeight: 1.5 },
    label: { fontSize: 9, color: t.colors.muted, textTransform: "uppercase", letterSpacing: 2, marginBottom: 6, fontFamily: "Inter" },
  })

  return (
    <Page size="A4" style={s.page}>
      <View style={{ padding: pad }}>
        {/* Header Grid: INVOICE | Logo/Brand | Business Details */}
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderTopWidth: 1, borderTopColor: "#000", borderBottomWidth: 1, borderBottomColor: "#000", paddingVertical: 24, marginBottom: 32 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontFamily: "InstrumentSerif", fontSize: 40, letterSpacing: 2, color: "#000" }}>INVOICE</Text>
          </View>
          <View style={{ flex: 1, alignItems: "center" }}>
            <Logo data={data} t={t} />
            <Text style={{ fontSize: 18, fontFamily: "InstrumentSerif", marginTop: 8, color: "#000" }}>{data.businessName}</Text>
            {data.businessTagline && <Text style={{ fontSize: 10, fontFamily: "InstrumentSerif", fontStyle: "italic", marginTop: 4, color: t.colors.muted }}>{data.businessTagline}</Text>}
          </View>
          <View style={{ flex: 1, alignItems: "flex-end", textAlign: "right" }}>
            <Text style={{ fontSize: 9, fontFamily: "Inter", color: t.colors.muted }}>{data.businessAddress}</Text>
            <Text style={{ fontSize: 9, fontFamily: "Inter", color: t.colors.muted }}>{data.businessEmail}</Text>
            <Text style={{ fontSize: 9, fontFamily: "Inter", color: t.colors.muted }}>{data.businessPhone}</Text>
            {data.options.showGSTIN && data.gstin && <Text style={{ fontSize: 9, fontFamily: "Inter", color: t.colors.muted }}>GSTIN: {data.gstin}</Text>}
          </View>
        </View>

        {/* Bill To Centered */}
        <View style={{ alignItems: "center", marginBottom: 32 }}>
          <Text style={s.label}>Billed To</Text>
          <Text style={{ fontSize: 16, fontFamily: "InstrumentSerif", marginBottom: 4, color: "#000" }}>{data.clientName}</Text>
          <Text style={{ fontSize: 10, fontFamily: "Inter", color: t.colors.muted }}>{data.clientAddress}</Text>
          <Text style={{ fontSize: 10, fontFamily: "Inter", color: t.colors.muted, marginTop: 2 }}>{data.clientEmail}</Text>
        </View>

        {/* Meta Grid */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", borderTopWidth: 1, borderTopColor: "#000", borderBottomWidth: 1, borderBottomColor: "#000", paddingVertical: 16, marginBottom: 32 }}>
          <View style={{ alignItems: "center" }}>
            <Text style={s.label}>Invoice No.</Text>
            <Text style={{ fontSize: 12, fontFamily: "InstrumentSerif", color: "#000" }}>{data.invoiceNumber}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={s.label}>Issue Date</Text>
            <Text style={{ fontSize: 12, fontFamily: "InstrumentSerif", color: "#000" }}>{data.invoiceDate}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text style={s.label}>Due Date</Text>
            <Text style={{ fontSize: 12, fontFamily: "InstrumentSerif", color: "#000" }}>{data.dueDate}</Text>
          </View>
          {data.options.showPONumber && (
            <View style={{ alignItems: "center" }}>
              <Text style={s.label}>PO Number</Text>
              <Text style={{ fontSize: 12, fontFamily: "InstrumentSerif", color: "#000" }}>{data.poNumber}</Text>
            </View>
          )}
        </View>

        {/* Line Items */}
        <View style={{ borderTopWidth: 1, borderTopColor: "#000" }}>
          <ItemsTable data={data} t={t} headerBg="transparent" headerTextColor="#000" cellPad={12} />
        </View>

        {/* Totals */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 32 }}>
          <View style={{ minWidth: 250, borderTopWidth: 1, borderTopColor: "#000", paddingTop: 16 }}>
            <TotalsBox data={data} t={t} grandTotalBg="transparent" grandTotalTextColor="#000" />
          </View>
        </View>

        {/* Footer */}
        <View style={{ borderTopWidth: 1, borderTopColor: "#000", marginTop: 64, paddingTop: 24, alignItems: "center" }} wrap={false}>
          <FooterContent data={data} t={t} />
        </View>
      </View>
    </Page>
  )
}
