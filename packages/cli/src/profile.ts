import { mkdir, readFile, writeFile } from "node:fs/promises"
import { homedir } from "node:os"
import { dirname, join } from "node:path"

import type { BillyServerOptions } from "@billy/mcp"

/**
 * What the user tells Billy once: who they are and how they usually bill.
 * Every `billy new` and every tool call over `billy mcp` starts from it.
 */
export type Profile = NonNullable<BillyServerOptions["defaults"]>

export function profilePath(): string {
  const base = process.env.XDG_CONFIG_HOME || join(homedir(), ".config")
  return join(base, "billy", "profile.json")
}

export async function loadProfile(path = profilePath()): Promise<Profile> {
  try {
    const parsed: unknown = JSON.parse(await readFile(path, "utf8"))
    return typeof parsed === "object" && parsed !== null && !Array.isArray(parsed) ? (parsed as Profile) : {}
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return {}
    throw new Error(`Couldn't read ${path}: ${(error as Error).message}`)
  }
}

export async function saveProfile(profile: Profile, path = profilePath()): Promise<void> {
  await mkdir(dirname(path), { recursive: true })
  await writeFile(path, `${JSON.stringify(profile, null, 2)}\n`, { mode: 0o600 })
}
