# Agent instructions

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Project overview

`main` is the **"Launching soon" waitlist site** served at trybilly.tech until
launch. The product (the invoice editor and the full landing page) lives on the
`launch-alpha` branch, a Turborepo with its own `AGENTS.md`; work on the editor
branches from there, not from here.

This branch is a single Next.js 16 app (App Router, React 19, Tailwind v4,
TypeScript) on Bun, built as a static export (`out/`) and served by the
assets-only Cloudflare Worker in `wrangler.jsonc`. There is no server and no
database.

- `app/page.tsx`: the page. Masked video heading, signup, sponsor invite and
  the blurred peek of the new app (`public/coming-soon/`).
- `components/coming-soon/waitlist-form.tsx`: posts straight to a Loops form
  (`NEXT_PUBLIC_LOOPS_FORM_ID`), then offers a Share on X button.
- `components/coming-soon/sponsors.tsx` and `lib/sponsors.ts`: the sponsor
  invite (a mailto to hello@trybilly.tech) and the sponsor list.
- `components/MaskedHeading.tsx`: the GSAP video-filled heading.
- `public/_redirects`, `public/_headers`: read by the Cloudflare Worker, since
  a static export can't use `redirects()` or `headers()`.

The repo stays private until launch, so nothing here links to GitHub. Say
billy "will be" open source.

## SDLC: how a change gets shipped

Every task moves through four beats, each backed by a skill in `skills/`. The
skills are the source of truth; `.claude/skills/` symlinks to them so the agent
harness discovers them, and the review workflow reads them straight out of the
repo.

1. **Isolate** (`/new-feature`). Understand the issue first and ask the user
   when it is unclear; hand a vague issue to `/triage`, which leaves an agent
   brief with acceptance criteria. Then fetch the default branch, check no open
   PR already owns the files, and branch. Never build on the default branch.
2. **Build** (`/code-structure`). Orchestration owns the why and when. A service
   layer owns the reusable how. When the structure itself is what makes the
   change hard, run `/improve-codebase-architecture`; each refactor it agrees
   with the user becomes its own issue rather than riding along in this PR.
3. **Prove** (`/evidence-driven-testing`). Capture the before state while the bug
   is still reproducible, then the after once it works. Screenshots for a visible
   surface, measured numbers for anything else. For a bug, run
   `/diagnosing-bugs` first: its reproduction command is the before evidence
   and its regression test is part of the after.
4. **Ship** (`/before-and-after`, then `/ship-pr`). Open the PR with the proof
   and `Closes #<issue>`, then loop on the review until the verdict is
   `Looks good` with nothing unresolved. The review checks the code *and*
   whether the PR does what the issue or brief asked.

Run `/unslop` over anything a person reads before you post it: commit messages,
PR title and body, docs, comments. Apply it to text you wrote, not to prose you
did not touch.

### Code review runs itself

`.github/workflows/claude-code-review.yml` reviews every PR on open and on every
push. Do not tag the bot by hand.

The review follows `skills/deep-review/SKILL.md`. It posts inline comments plus a
short summary that opens with a plain-language line and ends in a verdict:
`Looks good`, `Changes requested` or `Blocking issues`. `/ship-pr` reads that
verdict and loops.

The review is deliberately short. Findings are tagged P0 to P3, capped at five,
and each one says what is wrong, why it matters and what to change. A reviewer
should get through it in under a minute.

### What the review will not let through

These match section B of `skills/deep-review/SKILL.md`. Keep the two in step.

- A second invoice layout path. The canvas, the preview and the PDF must all
  render `InvoicePage`, switched only by `RenderModeProvider readOnly`,
  otherwise the PDF stops matching the screen.
- Read-only-mode styling that changes layout, size or spacing. It moves page
  breaks and clips content in the PDF.
- Renaming a section class that template CSS keys on, without updating every
  template.
- `PAGE_W`/`PAGE_H`/`PAGE_GAP` changed in `invoice-page.tsx` but not in
  `lib/pdf/client-export.tsx`, or the other way round. PDF pages get sliced
  through content.
- Remote image URLs reaching the rasteriser, or the export's font, image and
  layout waits removed.
- Any `InvoiceData` field sent over the network, including to PostHog. PostHog
  gets event names and anonymous properties only.
- Anything that breaks the static export: route handlers, server actions,
  middleware, `rewrites`/`redirects`/`headers` in `next.config.ts`, or dynamic
  routes without `generateStaticParams`.
- New code that adds a database, auth or server SDK.
- A change to the shape of `InvoiceData`, `InvoiceOptions` or `LineItem` with no
  default or migration for drafts already saved under `billy_invoice_data`.
- A change with a visible surface and no before/after proof.

### Commands and checks

```bash
bun install          # install
bunx tsc --noEmit    # typecheck (no script for it)
bun run lint         # eslint
bun run build        # static export → out/
bun run dev          # dev server on http://localhost:3000
```

- There are no tests on this branch. Say so in the PR body rather than
  claiming tests passed.
- `bun run lint` is clean (0 errors) as of 2026-09-30. Keep it that way.
- `bun run build` is the real check for the static-export rule. Run it when you
  touch routing, `next.config.ts` or anything under `app/`.

Run these before opening a PR, and say in the PR body what they printed.

### Hard invariants

- **The PDF must match the screen.** The whole product is "what you see is what
  you get". Anything that makes the export differ from the editor, such as a
  font, a page break, a missing image or a different layout, is a shipped bug
  even when the editor looks fine. Check the PDF itself, not just the screen.
- **Nothing leaves the browser except anonymous analytics.** The README promises
  that no data leaves the user's machine. Invoice content in a network request,
  PostHog included, breaks that promise.
- **There is no database and no server.** Nothing needs a shared-DB warning.
  Adding one is an architecture change for the user to decide, not an
  implementation detail.
- **Returning users have a saved draft.** `billy_invoice_data` in
  `localStorage` is loaded with no validation. A changed data shape without a
  load-time default crashes the editor for existing users. A fresh browser
  profile hides this, so test with an old draft present.

### Screenshots and recordings

- Stay on seeded test data. Crop to the component under test, so surrounding
  chrome does not pull real records into the frame.
- Never commit a screenshot or recording. Git keeps every blob forever, so a
  capture on a merged branch is in the default branch's history permanently. Run
  `skills/before-and-after/scripts/publish-captures.sh --pr <n> <files...>`,
  which uploads them to GitHub's attachment store and puts them in the PR body
  inline. Needs nothing but an authenticated `gh`.

### Multi-agent rules

- Never commit to the default branch, never force-push to it.
- Only `--force-with-lease`, and only on your own task branch.
- One branch per task. Do not reuse or modify another agent's branch or
  uncommitted work.
- Scope check before starting: skim open PRs' changed files. On overlap, stop and
  ask.
- Resolve lockfile conflicts by regenerating, never by hand-merging.
- A branch does not isolate ports, databases or caches. Confirm a port answers
  *your* process before trusting it.
- If a conflict cannot be resolved confidently, stop and report rather than
  guessing.

### Committing

Do not commit unless you are asked to. Finish the work and leave it; the commit
is the user's call. The same goes for pushing and opening PRs.
