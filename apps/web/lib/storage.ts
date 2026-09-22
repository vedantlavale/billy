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
 * Billy is fully client-side. Logo/stamp images are embedded inline as base64
 * data URLs and live only inside the invoice (and the browser's localStorage
 * draft) — nothing is uploaded to any server.
 */
export async function uploadInvoiceAsset(
  file: File,
  _kind: "logo" | "stamp",
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.")
  }
  if (file.size > MAX_BYTES) {
    throw new Error("Image is too large (max 2MB).")
  }
  return fileToDataUrl(file)
}
