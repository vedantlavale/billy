import { createClient } from "@/lib/supabase/client"

export const INVOICE_ASSETS_BUCKET = "invoice-assets"
const MAX_BYTES = 2 * 1024 * 1024 // 2MB

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result)
      else reject(new Error("Failed to read file"))
    }
    reader.onerror = () => reject(new Error("Failed to read file"))
    reader.readAsDataURL(file)
  })
}

/**
 * Uploads a logo/stamp image to object storage and returns its public URL.
 *
 * Falls back to an inline base64 data URL when the user isn't signed in, so the
 * anonymous editor preview still works. Saving and PDF generation both require
 * auth, so anything that actually persists is uploaded by a signed-in user and
 * stored as a short URL rather than a multi-MB blob.
 */
export async function uploadInvoiceAsset(
  file: File,
  kind: "logo" | "stamp"
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.")
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image is too large (max 2MB).")
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Preview-only (not signed in): keep the image inline.
  if (!user) {
    return fileToDataUrl(file)
  }

  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "png"
  const objectPath = `${user.id}/${kind}-${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from(INVOICE_ASSETS_BUCKET)
    .upload(objectPath, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    })

  if (error) {
    throw new Error(error.message || "Upload failed")
  }

  const { data } = supabase.storage.from(INVOICE_ASSETS_BUCKET).getPublicUrl(objectPath)
  return data.publicUrl
}

/**
 * Best-effort removal of a previously uploaded asset. Ignores data URLs and
 * URLs that don't belong to our bucket so callers can pass any logoUrl/stampUrl.
 */
export async function deleteInvoiceAsset(url: string | null): Promise<void> {
  if (!url) return
  const marker = `/storage/v1/object/public/${INVOICE_ASSETS_BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return // base64 or foreign URL — nothing to delete

  const objectPath = url.slice(idx + marker.length)
  try {
    const supabase = createClient()
    await supabase.storage.from(INVOICE_ASSETS_BUCKET).remove([objectPath])
  } catch {
    // Orphaned assets are harmless; don't block the user on cleanup failures.
  }
}
