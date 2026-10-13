# billy launch plan — founders + coming soon

Status as of 2026-09-27 (env vars added in Cloudflare, retriggering build).
Update the checkboxes as things happen.

## Where everything lives

| Thing | Branch / PR | Path |
|---|---|---|
| Coming-soon page + waitlist form | `main`, PR [#31](https://github.com/vedantlavale/billy/pull/31) | `apps/web/app/page.tsx`, `apps/web/components/coming-soon/waitlist-form.tsx` |
| Early Bird template, unlock, wall, scripts | `launch-alpha`, PR [#32](https://github.com/vedantlavale/billy/pull/32) | see below |
| This plan | same as founders PR | `docs/founders-launch-plan.md` |

Founders feature files (all on PR #32):
- `packages/invoice-core/src/founders.ts` — code format (`v1.<n>.<signature>`), signing, verification. Tested in `founders.test.ts`.
- `scripts/founders/keygen.ts` — already run once. Generated the signing key.
- `scripts/founders/launch.ts` — the launch-day script (full copy below).
- `apps/web/lib/founder.ts` — reads `#founder=<code>` from the URL, verifies it, remembers it in `localStorage`.
- `apps/web/components/invoice/invoice-editor.tsx` — calls the above on load, shows the welcome/error toast.
- `apps/web/components/invoice/inspector-panel.tsx` / `use-editor-commands.tsx` — locks the Early Bird template in the rail and hides it from ⌘K until unlocked.
- `apps/web/app/globals.css` — Early Bird template styling (sky-blue gradient header + hand-drawn underline).
- `apps/web/app/early-birds/page.tsx` + `.lx-founders*` in `landing.css` — the public wall at `/early-birds`.
- `apps/web/content/founders.json` — wall data. **Empty `[]` until launch day.**
- `apps/web/components/founders/early-bird-face.tsx` — the mascot face drawn from each early bird's number, so there are no avatar files.

## Secrets and accounts (already done)

- [x] Signing key generated: `~/.billy/founder-signing-key.json` — **backed up in password manager**.
- [x] Loops account created, domain `trybilly.tech` verified (DNS records added).
- [x] Loops form created, ID `cmujkeahx0k1w0j4adtzmompe`, wired into the waitlist form (hardcoded default, overridable via `NEXT_PUBLIC_LOOPS_FORM_ID`).
- [x] Waitlist form tested end-to-end: a real signup landed in Loops Audience with the right email, first name, `source: coming-soon`, `userGroup: founding-wall`.
- [x] Loops contact properties created: `founderNumber` (Number), `founderLink` (String).
- [ ] Loops API key generated (Settings → API) — grab this **on launch day**, don't need it before.
- [ ] Launch email drafted in Loops (Campaigns), using `{{founderNumber}}` and `{{founderLink}}` — see template below.

## Still to do before launch

- [ ] Merge PR #31 into `main` — makes the coming-soon + waitlist page live on `trybilly.tech`. **Do this before or when the teaser posts.**
- [ ] Merge PR #32 into `launch-alpha` — safe to do anytime now; `founders.json` is empty so nothing changes for real users yet.
- [ ] Draft the launch campaign in Loops (see email template below), save as draft.

## Launch day runbook

1. **Export the Loops audience** as CSV (Audience page → export/download).
2. **Get a Loops API key** (Settings → API).
3. **Dry run** — nothing is written or sent, just prints what would happen:
   ```bash
   cd <launch-alpha checkout>
   bun scripts/founders/launch.ts --csv ~/Downloads/loops-export.csv --dry-run
   ```
   Check the counts look right (X founders, Y on the wall) before continuing.
4. **Run for real:**
   ```bash
   LOOPS_API_KEY=<paste key> bun scripts/founders/launch.ts --csv ~/Downloads/loops-export.csv
   ```
   This:
   - numbers everyone by signup time (#1 = earliest)
   - signs each person's unlock link: `https://trybilly.tech/editor#founder=v1.<n>.<sig>`
   - writes `founderNumber` + `founderLink` onto every Loops contact
   - builds `apps/web/content/founders.json`: every early bird as a number, plus the name where they gave one
   - saves a private backup CSV to `~/.billy/founders-<date>.csv` (never committed)
5. **Commit and push** the updated `apps/web/content/founders.json` and any new `apps/web/public/founders/*.svg` files.
6. **Deploy `launch-alpha` to production** (however the Cloudflare/Vercel swap works for this repo).
7. **Send the launch campaign** from Loops — merge tags fill in per-person automatically.
8. **Point `trybilly.tech` at the `launch-alpha` deploy** instead of the coming-soon `main` deploy.

### If something breaks mid-run
- The script is safe to re-run: numbering is deterministic (same CSV → same numbers), and Loops contact updates are idempotent (just overwrite the same fields).
- `--skip-loops` lets you redo just the wall without writing to Loops again.
- If the signing key is ever lost: no new valid links can be made, and regenerating a new key invalidates every link already sent. There is no recovery — this is why it's backed up.

## Names after launch

An early bird who opens their link sees a "You're early bird #N" card on `/early-birds` with an "Add my name" (or "Change my name") button. It opens an email to `hello@trybilly.tech`, because there is no server to save a name to. Loops forms can't do it either: on an existing contact they only change `userGroup`, never `firstName`. Make sure that mailbox reaches you.

When a name request arrives:
1. Check the sender's address against `~/.billy/founders-<date>.csv` so the number really is theirs. Names are added by hand, so nothing unmoderated goes on the wall.
2. In Loops, set that contact's first name and set their user group to `early-bird-wall`.
3. Export the audience again and re-run `scripts/founders/launch.ts` (add `--skip-loops` to leave the contacts alone). It rewrites `apps/web/content/founders.json`. Don't hand-edit that file; the next run overwrites it.
4. Commit and deploy.

## Launch email template (Loops campaign)

Subject: **You're early bird #{{founderNumber}} 🎉**

```
Hey,

billy is live: trybilly.tech

You signed up before anyone else, so you're early bird #{{founderNumber}}.
That comes with one thing money can't buy after today: the Early Bird
template, a billy-blue design that's only for people who believed in
this before it existed.

Open your invoice editor here, already unlocked:
{{founderLink}}

Thanks for being early. Go make something.

— billy
```

Notes on the copy:
- No em-dashes in the body per house style (the sign-off "— billy" is the one deliberate exception).
- Keep the subject short, the number is the hook.
- `{{founderLink}}` opens the editor pre-unlocked, no extra steps for them.
- If an early-bird-wall opt-in was given, you can add a line: "You're also on the early birds wall: trybilly.tech/early-birds" — optional, not in the base template above.

## Full script (for reference — lives at `scripts/founders/launch.ts`)

See that file in the repo for the current version; this plan doesn't duplicate it to avoid drift. Run `--help`-equivalent by reading the top comment block, or just run with `--dry-run` first.
