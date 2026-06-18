import * as React from "react"
import { Page, View, Text, StyleSheet } from "@react-pdf/renderer"
import type { InvoiceData } from "@/lib/types"
import { getThemeToken, spacing } from "@/lib/theme"
import { Logo, ItemsTable, TotalsBox, FooterContent } from "../components"

export function MonoClassicPage({ data }: { data: InvoiceData }) {
  const t = getThemeToken("mono-classic")
  const pad = spacing.pagePaddingMonoClassic
  const s = StyleSheet.create({
    page: { fontFamily: t.fontFamily, backgroundColor: "#ffffff", color: "#000000", fontSize: 10, lineHeight: 1.5 },
    label: { fontSize: 10, color: "#000000", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4, fontWeight: 600 },
    whiteText: { color: "#ffffff" },
    blackText: { color: "#000000" },
  })

  return (
    <Page size="A4" style={s.page}>
      <View style={{ padding: pad, paddingTop: 40 }}>
        {/* Header - Left Aligned */}
        <View style={{ borderBottomWidth: 1, borderBottomColor: "#000000", paddingBottom: 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
            <Logo data={data} t={t} />
            <View>
              <Text style={{ fontSize: 20, fontWeight: 600, color: "#000000" }}>{data.businessName}</Text>
              {data.businessTagline && <Text style={{ fontSize: 10, color: "#000000", marginTop: 2 }}>{data.businessTagline}</Text>}
            </View>
          </View>
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontSize: 36, fontWeight: 500, color: "#000000", letterSpacing: -1, lineHeight: 1 }}>INVOICE</Text>
          </View>
        </View>

        {/* Business Info - Left Aligned */}
        <View style={{ paddingTop: 32, marginBottom: 16, width: "45%" }}>
          <Text style={{ fontSize: 10, color: "#000000", marginTop: 8, marginBottom: 6, lineHeight: 1.4 }}>{data.businessAddress}</Text>
          <Text style={{ fontSize: 10, color: "#000000", marginBottom: 6, lineHeight: 1.4 }}>{data.businessEmail}</Text>
          <Text style={{ fontSize: 10, color: "#000000", lineHeight: 1.4 }}>{data.businessPhone}</Text>
          {data.options.showGSTIN && data.gstin && <Text style={{ fontSize: 10, color: "#000000", marginTop: 6, lineHeight: 1.4 }}>GSTIN: {data.gstin}</Text>}
        </View>

        {/* Bill To - Left Aligned */}
        <View style={{ marginBottom: 32, width: "45%" }}>
          <Text style={s.label}>Billed To</Text>
          <Text style={{ fontSize: 14, fontWeight: 600, color: "#000000", marginBottom: 10, lineHeight: 1.3 }}>{data.clientName}</Text>
          <Text style={{ fontSize: 10, color: "#000000", marginBottom: 6, lineHeight: 1.4 }}>{data.clientAddress}</Text>
          <Text style={{ fontSize: 10, color: "#000000", lineHeight: 1.4 }}>{data.clientEmail}</Text>
        </View>

        {/* Meta Grid - Left Aligned */}
        <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#000000", marginTop: 40, paddingVertical: 12, paddingRight: 200 }}>
          <View style={{ flexDirection: "row", marginBottom: 8 }}>
            <View style={{ width: 120 }}>
              <Text style={s.label}>Invoice No.</Text>
              <Text style={{ fontSize: 12, fontWeight: 600, color: "#000000" }}>{data.invoiceNumber}</Text>
            </View>
            <View style={{ width: 120 }}>
              <Text style={s.label}>Date</Text>
              <Text style={{ fontSize: 12, fontWeight: 600, color: "#000000" }}>{data.invoiceDate}</Text>
            </View>
          </View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: 120 }}>
              <Text style={s.label}>Due Date</Text>
              <Text style={{ fontSize: 12, fontWeight: 600, color: "#000000" }}>{data.dueDate}</Text>
            </View>
            {data.options.showPONumber && (
              <View style={{ width: 120 }}>
                <Text style={s.label}>PO Number</Text>
                <Text style={{ fontSize: 12, fontWeight: 600, color: "#000000" }}>{data.poNumber}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Line items */}
        <View style={{ marginTop: 32 }}>
          <ItemsTable data={data} t={t} headerBg="transparent" headerTextColor="#000000" cellPad={12} />
        </View>

        {/* Totals - Left Aligned */}
        <View style={{ flexDirection: "row", justifyContent: "flex-start", marginTop: 32 }}>
          <View style={{ minWidth: 240 }}>
            <TotalsBox data={data} t={t} grandTotalBg="transparent" grandTotalTextColor="#000000" />
          </View>
        </View>

        {/* Footer - Left Aligned */}
        <View style={{ marginTop: 40, borderTopWidth: 1, borderTopColor: "#000000", paddingTop: 12 }} wrap={false}>
          <View style={{ alignItems: "flex-start" }}>
            <FooterContent data={data} t={t} />
          </View>
        </View>
      </View>
    </Page>
  )
}
