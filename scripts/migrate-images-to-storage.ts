/**
 * One-time backfill: move base64 logo/stamp images out of invoices.data and
 * into the `invoice-assets` storage bucket, replacing them with public URLs.
 *
 * Prerequisites:
 *   1. Apply supabase/migrations/00008_invoice_assets_storage.sql first.
 *   2. Set SUPABASE_SERVICE_ROLE_KEY (and NEXT_PUBLIC_SUPABASE_URL) in your env.
 *
 * Run:  npx tsx scripts/migrate-images-to-storage.ts
 *
 * Safe to re-run: rows whose logoUrl/stampUrl are already URLs are skipped.
 */
import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

// --- Minimal .env loader (avoids adding a dotenv dependency) -----------------
function loadEnv(file: string) {
  const p = path.join(process.cwd(), file)
  if (!fs.existsSync(p)) return
  for (const line of fs.readFileSync(p, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (!m) continue
    const key = m[1]
    let val = m[2].trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = val
  }
}
loadEnv(".env")
loadEnv(".env.local")

const BUCKET = "invoice-assets"
const MIME_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceKey) {
  console.error(
    "Missing env. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running."
  )
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
})

function parseDataUrl(value: unknown): { buffer: Buffer; ext: string; contentType: string } | null {
  if (typeof value !== "string" || !value.startsWith("data:")) return null
  const match = value.match(/^data:([^;]+);base64,(.+)$/)
  if (!match) return null
  const contentType = match[1]
  const ext = MIME_EXT[contentType] || "png"
  return { buffer: Buffer.from(match[2], "base64"), ext, contentType }
}

async function uploadAsset(
  userId: string,
  invoiceId: string,
  kind: "logo" | "stamp",
  parsed: { buffer: Buffer; ext: string; contentType: string }
): Promise<string> {
  const objectPath = `${userId}/${kind}-${invoiceId}.${parsed.ext}`
  const { error } = await supabase.storage.from(BUCKET).upload(objectPath, parsed.buffer, {
    contentType: parsed.contentType,
    cacheControl: "31536000",
    upsert: true,
  })
  if (error) throw new Error(`upload failed for ${objectPath}: ${error.message}`)
  return supabase.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl
}

async function main() {
  const PAGE = 200
  let from = 0
  let migrated = 0
  let scanned = 0

  for (;;) {
    const { data: rows, error } = await supabase
      .from("invoices")
      .select("id, user_id, data")
      .order("created_at", { ascending: true })
      .range(from, from + PAGE - 1)

    if (error) throw error
    if (!rows || rows.length === 0) break

    for (const row of rows) {
      scanned++
      const data = row.data || {}
      let changed = false

      for (const kind of ["logo", "stamp"] as const) {
        const field = kind === "logo" ? "logoUrl" : "stampUrl"
        const parsed = parseDataUrl(data[field])
        if (!parsed) continue
        try {
          data[field] = await uploadAsset(row.user_id, row.id, kind, parsed)
          changed = true
        } catch (err) {
          console.error(`  ! invoice ${row.id} ${field}:`, (err as Error).message)
        }
      }

      if (changed) {
        const { error: updErr } = await supabase
          .from("invoices")
          .update({ data })
          .eq("id", row.id)
        if (updErr) {
          console.error(`  ! failed to update invoice ${row.id}:`, updErr.message)
        } else {
          migrated++
          console.log(`  ✓ migrated invoice ${row.id}`)
        }
      }
    }

    if (rows.length < PAGE) break
    from += PAGE
  }

  console.log(`\nDone. Scanned ${scanned} invoices, migrated ${migrated}.`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
