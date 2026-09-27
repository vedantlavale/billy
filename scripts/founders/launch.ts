/**
 * Launch-day founders run. Turns the Loops waitlist export into early bird
 * numbers, personal unlock links, and the early bird wall.
 *
 *   LOOPS_API_KEY=... bun scripts/founders/launch.ts --csv ~/Downloads/loops-audience.csv
 *
 * Flags:
 *   --csv <file>     Loops audience export (required)
 *   --dry-run        Print what would happen; write nothing, call nothing
 *   --skip-loops     Don't write founderNumber / founderLink back to Loops
 *   --skip-avatars   Don't look up blobatars
 *
 * What it does:
 *   1. Numbers everyone by signup time, earliest first (#1, #2, ...).
 *   2. Signs a code for each number and builds their link:
 *      https://trybilly.tech/editor#founder=v1.<n>.<signature>
 *   3. Writes founderNumber and founderLink onto each Loops contact, so the
 *      launch email can use {founderNumber} and {founderLink}. Create those two
 *      custom contact properties in Loops first (Number and String).
 *   4. For people who opted into the wall (userGroup "early-bird-wall" and a
 *      name), fetches a blobatar (blobatar.dev, deterministic per email) and writes
 *      apps/web/content/founders.json and apps/web/public/founders/<n>.jpg.
 *      Only the name, number and a hosted avatar are published, never emails.
 *   5. Saves a private record (email, number, link) to ~/.billy, not the repo.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import { join } from "node:path"
import { parseArgs } from "node:util"

import { formatFounderCode, founderMessage, fromBase64Url, verifyFounderCode } from "../../packages/invoice-core/src/founders"

const SITE = process.env.BILLY_URL ?? "https://trybilly.tech"
const ROOT = join(import.meta.dir, "../..")
const WALL_JSON = join(ROOT, "apps/web/content/founders.json")
const AVATAR_DIR = join(ROOT, "apps/web/public/founders")

const { values } = parseArgs({
  options: {
    csv: { type: "string" },
    "dry-run": { type: "boolean", default: false },
    "skip-loops": { type: "boolean", default: false },
    "skip-avatars": { type: "boolean", default: false },
  },
})
if (!values.csv) fail("Pass the Loops export with --csv <file>.")
const dry = values["dry-run"]!

function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

/** RFC 4180-ish CSV: quoted fields, doubled quotes, commas and newlines inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ""
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') (field += '"'), i++
      else if (ch === '"') quoted = false
      else field += ch
    } else if (ch === '"') quoted = true
    else if (ch === ",") row.push(field), (field = "")
    else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++
      row.push(field), rows.push(row), (row = []), (field = "")
    } else field += ch
  }
  if (field || row.length) row.push(field), rows.push(row)
  return rows.filter((r) => r.some((c) => c.trim()))
}

// ---- read the export ------------------------------------------------------

const [header, ...body] = parseCsv(await readFile(values.csv!, "utf8"))
const norm = (h: string) => h.toLowerCase().replace(/[^a-z]/g, "")
const col = (...names: string[]) => header.findIndex((h) => names.includes(norm(h)))
const iEmail = col("email", "emailaddress")
const iName = col("firstname", "name")
const iGroup = col("usergroup")
const iCreated = header.findIndex((h) => /created|subscribed|signedup|dateadded|joined/.test(norm(h)))
if (iEmail < 0) fail(`No email column in ${values.csv}. Headers: ${header.join(", ")}`)
if (iCreated < 0) console.warn("No signup-time column found; numbering in file order.")

type Person = { email: string; name: string; wall: boolean; created: number; order: number }
const seen = new Set<string>()
const people: Person[] = []
body.forEach((r, order) => {
  const email = (r[iEmail] ?? "").trim().toLowerCase()
  if (!email || seen.has(email)) return
  seen.add(email)
  const created = iCreated >= 0 ? Date.parse(r[iCreated] ?? "") : NaN
  people.push({
    email,
    name: iName >= 0 ? (r[iName] ?? "").trim() : "",
    wall: iGroup >= 0 && /wall/i.test(r[iGroup] ?? ""),
    created: Number.isFinite(created) ? created : Number.MAX_SAFE_INTEGER,
    order,
  })
})
people.sort((a, b) => a.created - b.created || a.order - b.order)
console.log(`${people.length} founders from ${values.csv}`)

// ---- sign ----------------------------------------------------------------

const keyFile = join(homedir(), ".billy", "founder-signing-key.json")
const key = JSON.parse(await readFile(keyFile, "utf8").catch(() => fail(`No signing key at ${keyFile}. Run keygen first.`)))
const privateKey = await crypto.subtle.importKey("pkcs8", fromBase64Url(key.privateKey), { name: "Ed25519" }, false, ["sign"])

const founders = []
for (const [i, p] of people.entries()) {
  const n = i + 1
  const code = formatFounderCode(n, await crypto.subtle.sign("Ed25519", privateKey, founderMessage(n) as Uint8Array<ArrayBuffer>))
  if ((await verifyFounderCode(code, key.publicKey)) !== n) fail(`Code for #${n} failed to verify; is the key pair intact?`)
  founders.push({ ...p, n, link: `${SITE}/editor#founder=${code}` })
}

// ---- write back to Loops -------------------------------------------------

if (!values["skip-loops"]) {
  const apiKey = process.env.LOOPS_API_KEY
  if (!apiKey && !dry) fail("Set LOOPS_API_KEY, or pass --skip-loops.")
  for (const f of founders) {
    if (dry) continue
    const res = await fetch("https://app.loops.so/api/v1/contacts/update", {
      method: "PUT",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ email: f.email, founderNumber: f.n, founderLink: f.link }),
    })
    if (!res.ok) console.error(`Loops update failed for #${f.n}: ${res.status} ${await res.text()}`)
    await Bun.sleep(120) // Loops allows about 10 requests a second
  }
  console.log(dry ? `Would update ${founders.length} Loops contacts.` : `Updated ${founders.length} Loops contacts.`)
}

// ---- the wall -------------------------------------------------------------

const wall = []
if (!dry) await mkdir(AVATAR_DIR, { recursive: true })
for (const f of founders.filter((f) => f.wall && f.name)) {
  let avatar: string | null = null
  if (!values["skip-avatars"] && !dry) {
    // blobatar.dev: a deterministic generated avatar from the email, no key,
    // no account. Same seed always renders the same blob, so everyone gets a
    // consistent, on-brand avatar even without a Gravatar set up.
    const res = await fetch(`https://blobatar.dev/avatar/${encodeURIComponent(f.email)}?size=256`)
    if (res.ok && (res.headers.get("content-type") ?? "").includes("svg")) {
      await writeFile(join(AVATAR_DIR, `${f.n}.svg`), new Uint8Array(await res.arrayBuffer()))
      avatar = `/founders/${f.n}.svg`
    }
  }
  wall.push({ number: f.n, name: f.name.slice(0, 40), avatar })
}
if (!dry) await writeFile(WALL_JSON, JSON.stringify(wall, null, 2) + "\n")
console.log(`${dry ? "Would put" : "Put"} ${wall.length} founders on the wall (${wall.filter((w) => w.avatar).length} with a blobatar).`)

// ---- private record ---------------------------------------------------------

const record = join(homedir(), ".billy", `founders-${new Date().toISOString().slice(0, 10)}.csv`)
const csv = ["number,email,name,wall,link", ...founders.map((f) => [f.n, f.email, JSON.stringify(f.name), f.wall, f.link].join(","))].join("\n")
if (!dry) await writeFile(record, csv + "\n", { mode: 0o600 })
console.log(dry ? "Dry run: nothing written." : `Private record: ${record}`)
