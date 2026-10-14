/**
 * Makes the founder signing key, once.
 *
 *   bun scripts/founders/keygen.ts
 *
 * The private key goes to ~/.billy/founder-signing-key.json and never into the
 * repo. Back it up (a password manager is fine): without it no new founder
 * codes can be made, and a new key would invalidate every code already sent.
 * The public key is written into packages/invoice-core/src/founders.ts.
 */
import { chmod, mkdir, readFile, writeFile } from "node:fs/promises"
import { existsSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

import { toBase64Url } from "../../packages/invoice-core/src/founders"

const dir = join(homedir(), ".billy")
const keyPath = join(dir, "founder-signing-key.json")
const sourcePath = join(import.meta.dir, "../../packages/invoice-core/src/founders.ts")

if (existsSync(keyPath)) {
  console.error(`A key already exists at ${keyPath}. Refusing to overwrite it: codes signed with it would stop working.`)
  process.exit(1)
}

const pair = (await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"])) as CryptoKeyPair
const publicKey = toBase64Url(await crypto.subtle.exportKey("raw", pair.publicKey))
const privateKey = toBase64Url(await crypto.subtle.exportKey("pkcs8", pair.privateKey))

await mkdir(dir, { recursive: true })
await writeFile(keyPath, JSON.stringify({ publicKey, privateKey, created: new Date().toISOString() }, null, 2) + "\n")
await chmod(keyPath, 0o600)

const source = await readFile(sourcePath, "utf8")
await writeFile(sourcePath, source.replace(/export const FOUNDER_PUBLIC_KEY = "[^"]*"/, `export const FOUNDER_PUBLIC_KEY = "${publicKey}"`))

console.log(`Private key: ${keyPath} (back this up)`)
console.log(`Public key:  ${publicKey} (written into packages/invoice-core/src/founders.ts)`)
