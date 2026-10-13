/** One person on the early birds wall. `name` is only set for people who gave one. */
export type EarlyBird = { number: number; name: string | null }

/** Where early birds send the name they want on the wall. Names are added by hand. */
export const WALL_EMAIL = "hello@trybilly.tech"

/** A mailto link that opens an email asking for `number`'s name to be shown on the wall. */
export function nameEmailHref(number: number): string {
  const subject = `Early bird #${number}: my name for the wall`
  const body = `Hi billy,\n\nI'm early bird #${number}. Please show this name on the early birds wall:\n\n`
  return `mailto:${WALL_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
