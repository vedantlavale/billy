import * as React from "react"
import { Page, View, Text } from "@react-pdf/renderer"
import type { InvoiceData } from "@/lib/types"
import { getThemeToken, spacing } from "@/lib/theme"
import { Logo, Label, ItemsTable, TotalsBox, FooterContent } from "../components"

export function ModernGreenPage({ data }: { data: InvoiceData }) {
  const t = getThemeToken("modern-green")
  const innerPad = spacing.pagePaddingModernGreen

  return (
    <Page size="A4" style={{ fontFamily: t.fontFamily, backgroundColor: t.colors.paper, color: t.colors.ink, fontSize: 10, lineHeight: 1.5 }}>
      {/* Green header band */}
      <View style={{ backgroundColor: t.colors.primary, padding: innerPad, paddingBottom: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 40, fontWeight: 700, color: t.colors.ink, letterSpacing: 2 }}>INVOICE</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: 16, fontWeight: 700, color: t.colors.ink, lineHeight: 1.2 }}>{data.businessName}</Text>
              <Text style={{ fontSize: 9, fontWeight: 500, color: t.colors.muted, marginTop: 2, lineHeight: 1.2 }}>{data.businessTagline}</Text>
            </View>
            <Logo data={data} t={t} />
          </View>
        </View>

        {/* Business address bar below */}
        <View style={{
          flexDirection: "row", justifyContent: "space-between",
          backgroundColor: "#ffffff", borderWidth: 1, borderColor: t.colors.border,
          marginTop: 16, padding: 12,
        }}>
          <Text style={{ fontSize: 10, color: t.colors.muted, lineHeight: 1.5 }}>{data.businessAddress}</Text>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 10, color: t.colors.muted }}>{data.businessEmail}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted }}>{data.businessPhone}</Text>
            {data.options.showGSTIN && data.gstin && <Text style={{ fontSize: 10, color: t.colors.muted }}>GSTIN: {data.gstin}</Text>}
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal: innerPad, paddingBottom: innerPad, paddingTop: 16 }}>
        {/* Client + Meta in bordered boxes on green bg */}
        <View style={{ backgroundColor: t.colors.primary, borderWidth: 1, borderColor: t.colors.border, padding: 8 }}>
          {/* Bill To */}
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 8, alignItems: "flex-start" }}>
            <View style={{ width: 90, flexShrink: 0, paddingVertical: 8, paddingLeft: 8 }}>
              <Label text="Bill To" t={t} />
            </View>
            <View style={{ backgroundColor: "#ffffff", flex: 1, padding: 8, borderWidth: 1, borderColor: t.colors.border }}>
              <Text style={{ fontSize: 12, fontWeight: 700, color: t.colors.ink, marginBottom: 4 }}>{data.clientName}</Text>
              <Text style={{ fontSize: 10, color: t.colors.muted, lineHeight: 1.4 }}>{data.clientAddress}</Text>
              <Text style={{ fontSize: 10, color: t.colors.muted, marginTop: 4 }}>{data.clientEmail}</Text>
            </View>
          </View>
          {/* Meta */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            {[
              { label: "Invoice No.", value: data.invoiceNumber },
              { label: "Issue Date", value: data.invoiceDate },
              { label: "Due Date", value: data.dueDate },
              ...(data.options.showPONumber ? [{ label: "PO Number", value: data.poNumber || "" }] : []),
            ].map(item => (
              <View key={item.label} style={{ flex: 1, backgroundColor: "#ffffff", padding: 8, borderWidth: 1, borderColor: t.colors.border }}>
                <Label text={item.label} t={t} />
                <Text style={{ fontSize: 11, fontWeight: 700, color: t.colors.ink }}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Line items */}
        <View style={{ marginTop: 12 }}>
          <ItemsTable data={data} t={t} headerBg={t.colors.primary} cellPad={8} bordered />
        </View>

        {/* Totals */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 12 }}>
          <TotalsBox data={data} t={t} bordered />
        </View>
      </View>

      {/* Footer */}
      <View style={{ backgroundColor: t.colors.primary, paddingHorizontal: innerPad, paddingVertical: 16, marginTop: 12 }} wrap={false}>
        <FooterContent data={data} t={t} />
      </View>
    </Page>
  )
}
