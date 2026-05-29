import type { InvoiceData } from "@/lib/types"

export const professionPresets = {
  freelancer: {
    showBankDetails: true,
    showGSTIN: false,
    showHSNCode: false,
    showCGST: false,
    showSGST: false,
    showIGST: false,
    showReverseCharge: false,
    showPONumber: false,
    showDigitalStamp: true,
    taxLabel: "Tax",
  },
  gst_vendor: {
    showBankDetails: true,
    showGSTIN: true,
    showHSNCode: true,
    showCGST: true,
    showSGST: true,
    showIGST: false,
    showReverseCharge: true,
    showPONumber: false,
    showDigitalStamp: true,
    taxLabel: "GST",
  },
  agency: {
    showBankDetails: false,
    showGSTIN: false,
    showHSNCode: false,
    showCGST: false,
    showSGST: false,
    showIGST: false,
    showReverseCharge: false,
    showPONumber: true,
    showDigitalStamp: false,
    taxLabel: "Tax",
  },
  consultant: {
    showBankDetails: true,
    showGSTIN: false,
    showHSNCode: false,
    showCGST: false,
    showSGST: false,
    showIGST: false,
    showReverseCharge: false,
    showPONumber: false,
    showDigitalStamp: true,
    taxLabel: "Tax",
  },
  other: {
    showBankDetails: false,
    showGSTIN: false,
    showHSNCode: false,
    showCGST: false,
    showSGST: false,
    showIGST: false,
    showReverseCharge: false,
    showPONumber: false,
    showDigitalStamp: false,
    taxLabel: "Tax",
  },
} as const

export function applyProfessionPreset(
  invoice: InvoiceData,
  profession: keyof typeof professionPresets
): InvoiceData {
  const preset = professionPresets[profession]

  return {
    ...invoice,
    taxLabel: preset.taxLabel,
    options: {
      ...invoice.options,
      showBankDetails: preset.showBankDetails,
      showGSTIN: preset.showGSTIN,
      showHSNCode: preset.showHSNCode,
      showCGST: preset.showCGST,
      showSGST: preset.showSGST,
      showIGST: preset.showIGST,
      showReverseCharge: preset.showReverseCharge,
      showPONumber: preset.showPONumber,
      showDigitalStamp: preset.showDigitalStamp,
    },
  }
}
