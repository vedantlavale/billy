import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/seo"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/editor`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/early-birds`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/gst-invoice-generator`, changeFrequency: "monthly", priority: 0.8 },
  ]
}
