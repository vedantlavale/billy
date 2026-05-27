async function getLocalChromePath(): Promise<string | null> {
  const commonPaths = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/snap/bin/chromium",
  ]
  const { accessSync } = await import("fs")
  for (const p of commonPaths) {
    try {
      accessSync(p)
      return p
    } catch {}
  }
  return null
}

async function resolveChromium() {
  if (process.platform === "linux") {
    try {
      const mod = await import("@sparticuz/chromium")
      const chromium = mod.default || mod
      return {
        args: chromium.args,
        executablePath: await chromium.executablePath(),
      }
    } catch {}
  }

  const localPath = await getLocalChromePath()
  if (!localPath) {
    throw new Error(
      "No Chromium found. Install Google Chrome or run: bun add puppeteer && bun run puppeteer browsers install chrome",
    )
  }
  return {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: localPath,
  }
}

export async function generatePdf(htmlString: string): Promise<Buffer> {
  const puppeteer = await import("puppeteer-core")
  const chromium = await resolveChromium()

  const browser = await puppeteer.launch({
    ...chromium,
    headless: true,
    defaultViewport: { width: 1200, height: 800 },
  })

  try {
    const page = await browser.newPage()

    await page.setContent(htmlString, {
      waitUntil: "domcontentloaded",
      timeout: 15_000,
    })

    await Promise.race([
      page.evaluate(() => document.fonts.ready),
      new Promise((r) => setTimeout(r, 3_000)),
    ])

    const pdf = await page.pdf({ format: "A4", printBackground: true })
    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
}
