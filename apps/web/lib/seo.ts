import { GITHUB_URL } from "@/lib/links"

/** The canonical host: the apex redirects to www. */
export const SITE_URL = "https://www.trybilly.tech"
export const SITE_NAME = "billy"
export const SITE_DESCRIPTION =
  "billy is a free, open-source invoice editor. Click any line on the invoice and type, then download a print-ready PDF. No account, no watermark."
export const CONTACT_EMAIL = "hello@trybilly.tech"

/** Schema.org data for the landing page. The FAQ comes from the same list the page renders. */
export function buildJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: SITE_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/brand/mark.svg`,
        email: CONTACT_EMAIL,
        sameAs: [GITHUB_URL],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#app`,
        name: SITE_NAME,
        url: SITE_URL,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        description: SITE_DESCRIPTION,
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        featureList: [
          "Click-to-edit invoices",
          "Print-ready PDF export",
          "10 templates",
          "10 currencies",
          "GST, HSN and SAC support",
          "Works on a phone",
          "No account needed",
        ],
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: faqs.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  }
}
