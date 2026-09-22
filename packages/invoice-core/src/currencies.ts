export interface Currency {
  code: string
  symbol: string
  locale: string
  name: string
}

export const CURRENCIES: Currency[] = [
  { code: "INR", symbol: "₹", locale: "en-IN", name: "Indian Rupee" },
  { code: "USD", symbol: "$", locale: "en-US", name: "US Dollar" },
  { code: "EUR", symbol: "€", locale: "de-DE", name: "Euro" },
  { code: "GBP", symbol: "£", locale: "en-GB", name: "British Pound" },
  { code: "JPY", symbol: "¥", locale: "ja-JP", name: "Japanese Yen" },
  { code: "AUD", symbol: "A$", locale: "en-AU", name: "Australian Dollar" },
  { code: "CAD", symbol: "C$", locale: "en-CA", name: "Canadian Dollar" },
  { code: "SGD", symbol: "S$", locale: "en-SG", name: "Singapore Dollar" },
  { code: "AED", symbol: "د.إ", locale: "ar-AE", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", locale: "ar-SA", name: "Saudi Riyal" },
]

export function getCurrency(code: string): Currency {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0]
}

export function getCurrencySymbol(code: string): string {
  return getCurrency(code).symbol
}

export function getCurrencyLocale(code: string): string {
  return getCurrency(code).locale
}
