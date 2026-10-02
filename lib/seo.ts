export const SITE_URL = "https://trybilly.tech"
export const SITE_NAME = "billy"
export const SITE_TITLE = "billy | Free, open source invoice editor, launching soon"
export const SITE_DESCRIPTION =
  "billy is a completely free, open source invoice editor. Click any field on the invoice and type, then export a print-ready PDF. No sign-up fees, no watermark. Join the waitlist for early access."

export const KEYWORDS = [
  "completely free invoice generator",
  "free invoice maker",
  "open source invoice editor",
  "open source invoicing software",
  "free invoice template",
  "invoice generator",
  "invoice editor",
  "PDF invoice maker",
  "online invoice generator",
  "invoice software for freelancers",
  "small business invoicing",
  "invoice without sign up",
  "no watermark invoice",
  "billy invoice",
  "billy waitlist",
]

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/brand/mark.svg`,
      email: "hello@trybilly.tech",
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
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: SITE_TITLE,
      description: SITE_DESCRIPTION,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#app` },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: SITE_NAME,
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: SITE_DESCRIPTION,
      keywords: KEYWORDS.join(", "),
      isAccessibleForFree: true,
      isFamilyFriendly: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "Completely free",
        "Open source",
        "Click-to-edit invoices",
        "Print-ready PDF export",
        "No watermark",
      ],
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
}
