import * as React from 'react'
import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer'
import path from 'path'
import type { InvoiceData } from '@/lib/types'
import { calculateLineItemAmount, calculateTotals, formatCurrency } from '@/lib/invoice'
import { getThemeToken, DesignTheme, spacing, fontSize } from '@/lib/theme'

// ─── Font registration ────────────────────────────────────────────────────────
const fp = (f: string) => path.join(process.cwd(), 'public', 'fonts', f)

Font.register({ family: 'SourceSans3', fonts: [
  { src: fp('SourceSans3-400.ttf'), fontWeight: 400 },
  { src: fp('SourceSans3-600.ttf'), fontWeight: 600 },
  { src: fp('SourceSans3-700.ttf'), fontWeight: 700 },
]})
Font.register({ family: 'Montserrat', fonts: [
  { src: fp('Montserrat-400.ttf'), fontWeight: 400 },
  { src: fp('Montserrat-500.ttf'), fontWeight: 500 },
  { src: fp('Montserrat-700.ttf'), fontWeight: 700 },
]})
Font.register({ family: 'Outfit', fonts: [
  { src: fp('Outfit-400.ttf'), fontWeight: 400 },
  { src: fp('Outfit-500.ttf'), fontWeight: 500 },
  { src: fp('Outfit-700.ttf'), fontWeight: 700 },
]})
Font.register({ family: 'Inter', fonts: [
  { src: fp('Inter-400.ttf'), fontWeight: 400 },
  { src: fp('Inter-500.ttf'), fontWeight: 500 },
  { src: fp('Inter-700.ttf'), fontWeight: 700 },
]})
Font.register({ family: 'InstrumentSerif', fonts: [
  { src: fp('InstrumentSerif-400.ttf'), fontWeight: 400 },
  { src: fp('InstrumentSerif-400Italic.ttf'), fontWeight: 400, fontStyle: 'italic' },
]})


// ─── Shared helpers ───────────────────────────────────────────────────────────
function Initials({ name, t }: { name: string; t: DesignTheme }) {
  const initials = name.split(/\s+/).filter(Boolean).slice(0, 2)
    .map(w => w[0]?.toUpperCase()).join('') || 'BI'
  return (
    <View style={{
      width: 64, height: 64, borderRadius: 8,
      borderWidth: 1, borderColor: t.colors.border,
      backgroundColor: '#f1f5f9',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <Text style={{ fontSize: 18, fontWeight: 700, color: t.colors.muted, fontFamily: t.fontFamily }}>
        {initials}
      </Text>
    </View>
  )
}

function Logo({ data, t }: { data: InvoiceData; t: DesignTheme }) {
  if (data.logoUrl) {
    return (
      <Image src={data.logoUrl} style={{
        width: 64, height: 64, borderRadius: 8,
        borderWidth: 1, borderColor: t.colors.border, objectFit: 'contain',
      }} />
    )
  }
  return <Initials name={data.businessName} t={t} />
}

function Stamp({ data, t }: { data: InvoiceData; t: DesignTheme }) {
  if (data.stampUrl) {
    return <Image src={data.stampUrl} style={{ width: 80, height: 80, objectFit: 'contain' }} />
  }
  return (
    <View style={{
      width: 80, height: 80, borderRadius: 8,
      borderWidth: 1.5, borderStyle: 'dashed', borderColor: t.colors.border,
    }} />
  )
}

function Label({ text, t }: { text: string; t: DesignTheme }) {
  return (
    <Text style={{
      fontSize: 8, fontWeight: 700, color: t.colors.muted, fontFamily: t.fontFamily,
      textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 6,
    }}>
      {text}
    </Text>
  )
}

// ─── Line items table (shared) ────────────────────────────────────────────────
function ItemsTable({ data, t, headerBg, headerTextColor, evenRowBg, cellPad, bordered }:
  { data: InvoiceData; t: DesignTheme; headerBg?: string; headerTextColor?: string; evenRowBg?: string; cellPad?: number; bordered?: boolean }) {

  const showHSN = data.options.showHSNCode
  const pad = cellPad ?? 0
  const hColor = headerTextColor ?? t.colors.muted

  if (bordered) {
    return (
      <View style={{ width: '100%', marginTop: 4, borderWidth: 1, borderColor: t.colors.border }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row', alignItems: 'stretch',
          backgroundColor: headerBg ?? 'transparent',
          borderBottomWidth: 1, borderBottomColor: t.colors.border,
        }}>
          <View style={{ flex: 4, padding: 8, borderRightWidth: 1, borderRightColor: t.colors.border }}>
            <Text style={{ fontSize: 8, fontWeight: 700, color: hColor, textTransform: 'uppercase', letterSpacing: 1 }}>Description</Text>
          </View>
          {showHSN && (
            <View style={{ flex: 2, padding: 8, borderRightWidth: 1, borderRightColor: t.colors.border, alignItems: 'center' }}>
              <Text style={{ fontSize: 8, fontWeight: 700, color: hColor, textTransform: 'uppercase', letterSpacing: 1 }}>HSN/SAC</Text>
            </View>
          )}
          <View style={{ flex: 1, padding: 8, borderRightWidth: 1, borderRightColor: t.colors.border, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 8, fontWeight: 700, color: hColor, textTransform: 'uppercase', letterSpacing: 1 }}>Qty</Text>
          </View>
          <View style={{ flex: 2, padding: 8, borderRightWidth: 1, borderRightColor: t.colors.border, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 8, fontWeight: 700, color: hColor, textTransform: 'uppercase', letterSpacing: 1 }}>Rate</Text>
          </View>
          <View style={{ flex: 2, padding: 8, alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 8, fontWeight: 700, color: hColor, textTransform: 'uppercase', letterSpacing: 1 }}>Amount</Text>
          </View>
        </View>

        {/* Rows */}
        {data.lineItems.map((item, i) => {
          const amount = calculateLineItemAmount(item)
          const rowBg = evenRowBg && i % 2 !== 0 ? evenRowBg : 'transparent'
          const isLastRow = i === data.lineItems.length - 1
          return (
            <View key={item.id || i} wrap={false} style={{
              flexDirection: 'row', alignItems: 'stretch',
              backgroundColor: rowBg,
              ...(isLastRow ? {} : { borderBottomWidth: 1, borderBottomColor: t.colors.border })
            }}>
              <View style={{ flex: 4, padding: 8, borderRightWidth: 1, borderRightColor: t.colors.border }}>
                <Text style={{ fontSize: 10, color: t.colors.ink }}>{item.description}</Text>
              </View>
              {showHSN && (
                <View style={{ flex: 2, padding: 8, borderRightWidth: 1, borderRightColor: t.colors.border, alignItems: 'center' }}>
                  <Text style={{ fontSize: 10, color: t.colors.ink }}>{item.hsnCode || ''}</Text>
                </View>
              )}
              <View style={{ flex: 1, padding: 8, borderRightWidth: 1, borderRightColor: t.colors.border, alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 10, color: t.colors.ink }}>{item.quantity}</Text>
              </View>
              <View style={{ flex: 2, padding: 8, borderRightWidth: 1, borderRightColor: t.colors.border, alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 10, fontFamily: 'Inter', color: t.colors.ink }}>{formatCurrency(item.rate, data.currency)}</Text>
              </View>
              <View style={{ flex: 2, padding: 8, alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 10, fontFamily: 'Inter', color: t.colors.ink }}>{formatCurrency(amount, data.currency)}</Text>
              </View>
            </View>
          )
        })}
      </View>
    )
  }

  return (
    <View style={{ width: '100%', marginTop: 4 }}>
      {/* Header */}
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        borderBottomWidth: 1, borderBottomColor: t.colors.border,
        paddingVertical: 8,
        backgroundColor: headerBg ?? 'transparent',
        paddingHorizontal: pad,
      }}>
        <Text style={{ flex: 4, fontSize: 8, fontWeight: 700, color: hColor, textTransform: 'uppercase', letterSpacing: 1 }}>Description</Text>
        {showHSN && <Text style={{ flex: 2, fontSize: 8, fontWeight: 700, color: hColor, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>HSN/SAC</Text>}
        <Text style={{ flex: 1, fontSize: 8, fontWeight: 700, color: hColor, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right' }}>Qty</Text>
        <Text style={{ flex: 2, fontSize: 8, fontWeight: 700, color: hColor, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right', paddingRight: 4 }}>Rate</Text>
        <Text style={{ flex: 2, fontSize: 8, fontWeight: 700, color: hColor, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'right', paddingRight: 4 }}>Amount</Text>
      </View>

      {/* Rows */}
      {data.lineItems.map((item, i) => {
        const amount = calculateLineItemAmount(item)
        const rowBg = evenRowBg && i % 2 !== 0 ? evenRowBg : 'transparent'
        return (
          <View key={item.id || i} wrap={false} style={{
            flexDirection: 'row', alignItems: 'center',
            borderBottomWidth: 1, borderBottomColor: t.colors.border,
            paddingVertical: 10,
            backgroundColor: rowBg,
            paddingHorizontal: pad,
          }}>
            <Text style={{ flex: 4, fontSize: 10, color: t.colors.ink }}>{item.description}</Text>
            {showHSN && <Text style={{ flex: 2, fontSize: 10, color: t.colors.ink, textAlign: 'center' }}>{item.hsnCode || ''}</Text>}
            <Text style={{ flex: 1, fontSize: 10, color: t.colors.ink, textAlign: 'right' }}>{item.quantity}</Text>
            <Text style={{ flex: 2, fontSize: 10, fontFamily: 'Inter', color: t.colors.ink, textAlign: 'right', paddingRight: 4 }}>{formatCurrency(item.rate, data.currency)}</Text>
            <Text style={{ flex: 2, fontSize: 10, fontFamily: 'Inter', color: t.colors.ink, textAlign: 'right', paddingRight: 4 }}>{formatCurrency(amount, data.currency)}</Text>
          </View>
        )
      })}
    </View>
  )
}

// ─── Totals box (shared) ──────────────────────────────────────────────────────
function TotalsBox({ data, t, grandTotalBg, grandTotalTextColor, bordered }:
  { data: InvoiceData; t: DesignTheme; grandTotalBg?: string; grandTotalTextColor?: string; bordered?: boolean }) {

  const totals = calculateTotals(data)
  const gstEnabled = data.options.showCGST || data.options.showSGST || data.options.showIGST

  return (
    <View style={{
      width: 220,
      ...(bordered ? { borderWidth: 1, borderColor: t.colors.border, padding: 12 } : {})
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
        <Text style={{ fontSize: 10, color: t.colors.muted }}>Subtotal</Text>
        <Text style={{ fontSize: 10, fontFamily: 'Inter', color: t.colors.muted, paddingRight: 4 }}>{formatCurrency(totals.subtotal, data.currency)}</Text>
      </View>

      {/* Tax rows */}
      {!gstEnabled && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
          <Text style={{ fontSize: 10, color: t.colors.muted }}>{data.taxLabel || 'Tax'} ({data.taxRate.toFixed(2)}%)</Text>
          <Text style={{ fontSize: 10, fontFamily: 'Inter', color: t.colors.muted, paddingRight: 4 }}>{formatCurrency(totals.taxAmount, data.currency)}</Text>
        </View>
      )}
      {gstEnabled && data.options.showIGST && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
          <Text style={{ fontSize: 10, color: t.colors.muted }}>IGST ({data.taxRate.toFixed(2)}%)</Text>
          <Text style={{ fontSize: 10, fontFamily: 'Inter', color: t.colors.muted, paddingRight: 4 }}>{formatCurrency(totals.igstAmount, data.currency)}</Text>
        </View>
      )}
      {gstEnabled && !data.options.showIGST && data.options.showCGST && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
          <Text style={{ fontSize: 10, color: t.colors.muted }}>CGST ({(data.taxRate / 2).toFixed(2)}%)</Text>
          <Text style={{ fontSize: 10, fontFamily: 'Inter', color: t.colors.muted, paddingRight: 4 }}>{formatCurrency(totals.cgstAmount, data.currency)}</Text>
        </View>
      )}
      {gstEnabled && !data.options.showIGST && data.options.showSGST && (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
          <Text style={{ fontSize: 10, color: t.colors.muted }}>SGST ({(data.taxRate / 2).toFixed(2)}%)</Text>
          <Text style={{ fontSize: 10, fontFamily: 'Inter', color: t.colors.muted, paddingRight: 4 }}>{formatCurrency(totals.sgstAmount, data.currency)}</Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
        <Text style={{ fontSize: 10, color: t.colors.muted }}>Discount ({data.discountRate.toFixed(2)}%)</Text>
        <Text style={{ fontSize: 10, fontFamily: 'Inter', color: t.colors.muted, paddingRight: 4 }}>{formatCurrency(totals.discountAmount, data.currency)}</Text>
      </View>

      {/* Grand total */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 8,
        paddingTop: grandTotalBg ? 10 : 10,
        paddingBottom: grandTotalBg ? 10 : 0,
        paddingHorizontal: grandTotalBg ? 12 : 0,
        borderTopWidth: grandTotalBg ? 0 : 1,
        borderTopColor: t.colors.border,
        backgroundColor: grandTotalBg ?? 'transparent',
      }}>
        <Text style={{ fontSize: 13, fontWeight: 700, color: grandTotalTextColor ?? t.colors.ink }}>Total</Text>
        <Text style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Inter', color: grandTotalTextColor ?? t.colors.ink, paddingRight: grandTotalBg ? 0 : 4 }}>
          {formatCurrency(calculateTotals(data).total, data.currency)}
        </Text>
      </View>
    </View>
  )
}

// ─── Footer content (shared) ──────────────────────────────────────────────────
function FooterContent({ data, t, textColor }: { data: InvoiceData; t: DesignTheme; textColor?: string }) {
  const tc = textColor ?? t.colors.muted
  const lc = textColor ?? t.colors.muted

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
              {data.bankName ? `${data.bankName}\n` : ''}
              {data.bankAccount ? `${data.bankAccount}\n` : ''}
              {data.bankIfsc || ''}
            </Text>
          </View>
        )}
      </View>

      <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
        {data.options.showDigitalStamp && (
          <View style={{ alignItems: 'flex-end' }}>
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

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE: CLEAN
// ═══════════════════════════════════════════════════════════════════════════════
function CleanPage({ data }: { data: InvoiceData }) {
  const t = getThemeToken('clean')
  const pad = spacing.pagePaddingClean
  const s = StyleSheet.create({
    page: { fontFamily: t.fontFamily, backgroundColor: t.colors.paper, color: t.colors.ink, fontSize: 10, lineHeight: 1.5 },
    section: { borderBottomWidth: 1, borderBottomColor: t.colors.border, paddingVertical: 12 },
  })

  return (
    <Page size="A4" style={s.page}>
      <View style={{ padding: pad }}>

        {/* Header */}
        <View style={[s.section, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }]}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
            <Logo data={data} t={t} />
            <View>
              <Text style={{ fontSize: 22, fontWeight: 700, color: t.colors.ink, lineHeight: 1.2 }}>{data.businessName}</Text>
              <Text style={{ fontSize: 9, fontWeight: 700, color: t.colors.muted, textTransform: 'uppercase', letterSpacing: 2, marginTop: 6 }}>{data.businessTagline}</Text>
            </View>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: 10, color: t.colors.muted, lineHeight: 1.6 }}>{data.businessAddress}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted }}>{data.businessEmail}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted }}>{data.businessPhone}</Text>
            {data.options.showGSTIN && data.gstin && <Text style={{ fontSize: 10, color: t.colors.muted }}>GSTIN: {data.gstin}</Text>}
          </View>
        </View>

        {/* Bill To */}
        <View style={[s.section, { flexDirection: 'row', gap: 18 }]}>
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
        <View style={[s.section, { flexDirection: 'row', gap: 18 }]}>
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
              <Text style={{ fontSize: 12, fontWeight: 600, color: t.colors.ink }}>{data.poNumber || ''}</Text>
            </View>
          )}
        </View>

        {/* Line items */}
        <View style={s.section}>
          <ItemsTable data={data} t={t} />
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 18 }}>
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

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE: MINIMAL TEAL
// ═══════════════════════════════════════════════════════════════════════════════
function MinimalTealPage({ data }: { data: InvoiceData }) {
  const t = getThemeToken('minimal-teal')
  const pad = spacing.pagePaddingMinimalTeal

  return (
    <Page size="A4" style={{ fontFamily: t.fontFamily, backgroundColor: t.colors.paper, color: t.colors.ink, fontSize: 10, lineHeight: 1.5 }}>
      <View style={{ padding: pad }}>

        {/* Centred header */}
        <View style={{
          alignItems: 'center',
          borderBottomWidth: 2, borderBottomColor: t.colors.primary,
          paddingBottom: 16, marginBottom: 16,
        }}>
          <Logo data={data} t={t} />
          <Text style={{ fontSize: 16, fontWeight: 400, color: t.colors.primary, fontFamily: 'InstrumentSerif', textTransform: 'uppercase', marginTop: 12, lineHeight: 1.2 }}>I N V O I C E</Text>
          <Text style={{ fontSize: 26, fontWeight: 400, color: t.colors.ink, fontFamily: 'InstrumentSerif', marginTop: 8, lineHeight: 1.2 }}>{data.businessName}</Text>
          <Text style={{ fontSize: 14, fontWeight: 400, color: t.colors.primary, fontFamily: 'InstrumentSerif', fontStyle: 'italic', marginTop: 4, lineHeight: 1.2 }}>{data.businessTagline}</Text>
          <Text style={{ fontSize: 9, color: t.colors.muted, marginTop: 10, textAlign: 'center', lineHeight: 1.6 }}>
            {data.businessAddress}{'  '}•{'  '}{data.businessEmail}{'  '}•{'  '}{data.businessPhone}
            {data.options.showGSTIN && data.gstin ? `\nGSTIN: ${data.gstin}` : ''}
          </Text>
        </View>

        {/* Client + Meta side-by-side */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          {/* Bill To */}
          <View style={{ width: '48%' }}>
            <Label text="Bill To" t={t} />
            <Text style={{ fontSize: 13, fontWeight: 700, color: t.colors.ink, marginBottom: 4 }}>{data.clientName}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted, lineHeight: 1.5 }}>{data.clientAddress}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted, marginTop: 4 }}>{data.clientEmail}</Text>
          </View>

          {/* Invoice Meta */}
          <View style={{ width: '46%', alignItems: 'flex-end' }}>
            <View style={{ alignItems: 'flex-end', marginBottom: 8 }}>
              <Label text="Invoice No." t={t} />
              <Text style={{ fontSize: 12, fontWeight: 600, color: t.colors.ink }}>{data.invoiceNumber}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', marginBottom: 8 }}>
              <Label text="Issue Date" t={t} />
              <Text style={{ fontSize: 12, fontWeight: 600, color: t.colors.ink }}>{data.invoiceDate}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', marginBottom: 8 }}>
              <Label text="Due Date" t={t} />
              <Text style={{ fontSize: 12, fontWeight: 600, color: t.colors.ink }}>{data.dueDate}</Text>
            </View>
            {data.options.showPONumber && (
              <View style={{ alignItems: 'flex-end' }}>
                <Label text="PO Number" t={t} />
                <Text style={{ fontSize: 12, fontWeight: 600, color: t.colors.ink }}>{data.poNumber || ''}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Line items */}
        <ItemsTable data={data} t={t} />

        {/* Totals */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
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

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE: MODERN GREEN
// ═══════════════════════════════════════════════════════════════════════════════
function ModernGreenPage({ data }: { data: InvoiceData }) {
  const t = getThemeToken('modern-green')
  const innerPad = spacing.pagePaddingModernGreen

  return (
    <Page size="A4" style={{ fontFamily: t.fontFamily, backgroundColor: t.colors.paper, color: t.colors.ink, fontSize: 10, lineHeight: 1.5 }}>

      {/* Green header band */}
      <View style={{ backgroundColor: t.colors.primary, padding: innerPad, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 40, fontWeight: 700, color: t.colors.ink, letterSpacing: 2 }}>INVOICE</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 16, fontWeight: 700, color: t.colors.ink, lineHeight: 1.2 }}>{data.businessName}</Text>
              <Text style={{ fontSize: 9, fontWeight: 500, color: t.colors.muted, marginTop: 2, lineHeight: 1.2 }}>{data.businessTagline}</Text>
            </View>
            <Logo data={data} t={t} />
          </View>
        </View>

        {/* Business address bar below */}
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between',
          backgroundColor: '#ffffff', borderWidth: 1, borderColor: t.colors.border,
          marginTop: 16, padding: 12,
        }}>
          <Text style={{ fontSize: 10, color: t.colors.muted, lineHeight: 1.5 }}>{data.businessAddress}</Text>
          <View style={{ alignItems: 'flex-end' }}>
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
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 8, alignItems: 'flex-start' }}>
            <View style={{ width: 90, flexShrink: 0, paddingVertical: 8, paddingLeft: 8 }}>
              <Label text="Bill To" t={t} />
            </View>
            <View style={{ backgroundColor: '#ffffff', flex: 1, padding: 8, borderWidth: 1, borderColor: t.colors.border }}>
              <Text style={{ fontSize: 12, fontWeight: 700, color: t.colors.ink, marginBottom: 4 }}>{data.clientName}</Text>
              <Text style={{ fontSize: 10, color: t.colors.muted, lineHeight: 1.4 }}>{data.clientAddress}</Text>
              <Text style={{ fontSize: 10, color: t.colors.muted, marginTop: 4 }}>{data.clientEmail}</Text>
            </View>
          </View>
          {/* Meta */}
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[
              { label: 'Invoice No.', value: data.invoiceNumber },
              { label: 'Issue Date', value: data.invoiceDate },
              { label: 'Due Date', value: data.dueDate },
              ...(data.options.showPONumber ? [{ label: 'PO Number', value: data.poNumber || '' }] : []),
            ].map(item => (
              <View key={item.label} style={{ flex: 1, backgroundColor: '#ffffff', padding: 8, borderWidth: 1, borderColor: t.colors.border }}>
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
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
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

// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE: CORPORATE BLUE
// ═══════════════════════════════════════════════════════════════════════════════
function CorporateBluePage({ data }: { data: InvoiceData }) {
  const t = getThemeToken('corporate-blue')
  const pad = spacing.pagePaddingCorporateBlue

  return (
    <Page size="A4" style={{ fontFamily: t.fontFamily, backgroundColor: t.colors.paper, color: t.colors.ink, fontSize: 10, lineHeight: 1.5 }}>
      <View style={{ padding: pad }}>

        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', borderBottomWidth: 2, borderBottomColor: t.colors.ink, paddingBottom: 12, marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 14 }}>
            <Logo data={data} t={t} />
            <View>
              <Text style={{ fontSize: 22, fontWeight: 700, color: t.colors.ink, lineHeight: 1.2 }}>{data.businessName}</Text>
              <Text style={{ fontSize: 9, fontWeight: 500, color: t.colors.muted, textTransform: 'uppercase', letterSpacing: 1.5, marginTop: 5 }}>{data.businessTagline}</Text>
            </View>
          </View>
          <View style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: 10, color: t.colors.muted, lineHeight: 1.6 }}>{data.businessAddress}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted }}>{data.businessEmail}</Text>
            <Text style={{ fontSize: 10, color: t.colors.muted }}>{data.businessPhone}</Text>
            {data.options.showGSTIN && data.gstin && <Text style={{ fontSize: 10, color: t.colors.muted }}>GSTIN: {data.gstin}</Text>}
          </View>
        </View>

        {/* INVOICE label */}
        <Text style={{ fontSize: 28, fontWeight: 700, color: t.colors.ink, marginBottom: 12 }}>INVOICE</Text>

        {/* Bill To */}
        <View style={{ flexDirection: 'row', gap: 18, borderBottomWidth: 1, borderBottomColor: t.colors.border, paddingBottom: 12, marginBottom: 12 }}>
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
        <View style={{ flexDirection: 'row', gap: 18, borderBottomWidth: 1, borderBottomColor: t.colors.border, paddingBottom: 12, marginBottom: 12 }}>
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
              <Text style={{ fontSize: 12, fontWeight: 600, color: t.colors.ink }}>{data.poNumber || ''}</Text>
            </View>
          )}
        </View>

        {/* Line items */}
        <ItemsTable data={data} t={t} headerBg={t.colors.primary} headerTextColor="#ffffff" evenRowBg={t.colors.secondary} cellPad={8} />

        {/* Totals */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
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

// ─── Root export ──────────────────────────────────────────────────────────────
export function InvoicePDF({ data }: { data: InvoiceData }) {
  let page: React.ReactElement

  switch (data.templateId) {
    case 'modern-green':  page = <ModernGreenPage data={data} />; break
    case 'minimal-teal':  page = <MinimalTealPage data={data} />; break
    case 'corporate-blue': page = <CorporateBluePage data={data} />; break
    default:              page = <CleanPage data={data} />
  }

  return <Document>{page}</Document>
}

