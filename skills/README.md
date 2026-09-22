# Skills

Agent skills for the four-beat SDLC. These files are the source of truth.
`.claude/skills/<name>` symlinks to each folder here so Claude Code discovers
them, and `.github/workflows/claude-code-review.yml` reads the review rubric
straight out of this directory.

The four-beat workflow they implement is described in `AGENTS.md` at the repo
root.

## What we adopted, and what we changed

Most of these come from
[michaelshimeles/skills](https://github.com/michaelshimeles/skills), the
collection from the "software factory" walkthrough. We took five of the seven,
changed three of them, and wrote two of our own.

| Skill | Source | Status |
|---|---|---|
| `deep-review` | ours, plus the spec axis and smell baseline from mattpocock `code-review` | Replaces the stock `code-review` plugin |
| `ship-pr` | this kit, shaped after `greploop` | Same loop, pointed at this reviewer |
| `before-and-after` | vercel-labs, via michaelshimeles | Adopted, changed |
| `evidence-driven-testing` | michaelshimeles | Adopted, rewritten around the headless path |
| `new-feature` | michaelshimeles | Adopted, reduced |
| `code-structure` | michaelshimeles | Adopted as-is |
| `unslop` | cursor/plugins, via michaelshimeles | Adopted as-is |
| `triage` | mattpocock | Adopted, tracker config inlined as a GitHub label table |
| `improve-codebase-architecture` | mattpocock | Adopted as-is |
| `diagnosing-bugs` | mattpocock | Adopted as-is |
| `codebase-design`, `grilling`, `domain-modeling` | mattpocock | Adopted as-is. Dependencies of the three above |
| `greploop` | greptileai | **Not adopted.** Needs Greptile installed on the repo |
| `greploop-apps` | michaelshimeles | **Not adopted.** Same reason |

### deep-review

The reason this exists. The stock `code-review@claude-code-plugins` plugin has
two properties that made the bot look weak here:

- It stops as soon as it finds it has already commented on a PR, so it never
  re-reviews a push.
- By design it flags only compile errors, definite logic errors and CLAUDE.md
  violations, and explicitly declines to flag security, performance or quality.
  That is a deliberate high-precision choice, and it is much narrower than what
  CodeRabbit and Greptile report.

Ours reviews on every invocation and scores against six groups: correctness,
tenant isolation, security and data handling, performance, repo conventions, and
tests. Group B is the one that matters most: your project's own invariants, which no
generic reviewer can infer. It ships empty with a worked example. Fill it in. Every finding is
verified by a second agent whose job is to disprove it before it gets posted, so
the extra breadth does not turn into noise.

Output is kept short on purpose, and it is written for two readers. It opens
with an "In short" line of one or two plain sentences, no file paths and no
jargon, so a partner can tell from three lines whether the work is safe to ship.
The technical detail sits underneath: each finding is scored 0 to 100 internally
and anything under 80 is dropped, so a review lands at 0 to 5 findings tagged P0
to P3, each stating the problem, the impact and the fix in under 100 words. It
ends with a verdict line, `Looks good`, `Changes requested` or `Blocking issues`,
which is what `ship-pr` loops on. The format follows
[rdeepak-711/claude-code-skills](https://github.com/rdeepak-711/claude-code-skills/blob/main/skills/deep-review/SKILL.md);
the rubric it applies is ours.

### ship-pr

`greploop` is a good loop wrapped around a service we do not pay for. We kept the
loop and pointed it at this kit's reviewer: open the PR with proof, read the verdict,
go back and build if it is below 5, push, get a fresh verdict. The review fires
itself on push, so nothing has to be tagged by hand.

### before-and-after

Two changes from upstream.

The default upload adapter was `0x0.st`, a public paste host with no auth and no
delete, which is wrong for anything showing customer data. The default is now
the gist adapter, which creates a secret unlisted gist (not access-controlled:
anyone with the URL can read it). The one-line change is in
`scripts/upload-and-copy.sh`.

The skill also carries the rule about capturing only seeded test data, and adds
`publish-captures.sh`, which attaches captures to a PR as an artifact instead of
committing them.

### evidence-driven-testing

Upstream leads with a screen recorder. It needs ffmpeg built with `libx264` and
the `ass` filter, plus macOS Screen Recording permission that a human has to
grant. Ours leads with headless Playwright and curl probes, which work without
setup, and treats the recording as the option you check for rather than assume.

### triage, improve-codebase-architecture, diagnosing-bugs

From [mattpocock/skills](https://github.com/mattpocock/skills).

- `/triage` turns a vague issue into an **agent brief**: verified, with
  acceptance criteria and scope. `new-feature` hands off to it when an issue
  needs more than a few questions, and `deep-review` checks PRs against the
  brief.
- `/improve-codebase-architecture` finds where the code structure hurts, draws
  it as an HTML report with before/after diagrams, then works through the fix
  you pick with you.
- `/diagnosing-bugs` refuses to guess: build a command that reproduces the bug,
  shrink it, rank hypotheses, then fix with a regression test.

They call `grilling`, `domain-modeling` and `codebase-design`, so those come
too. The only change is in `triage`: upstream reads the tracker and label
mapping from a separate setup skill; here it is a table in the skill that
`/setup-sdlc` fills in.

### new-feature

Clarifies the issue with the user before branching when it is unclear.
Upstream's worktree mechanics are dropped. Most agent harnesses manage worktrees
themselves. What was worth keeping is the sync, the scope check against open
PRs, and the warnings about what a branch does *not* isolate: shared databases,
dev server ports, lockfiles and build output.

## Licenses

`before-and-after` carries PolyForm Shield 1.0.0 from vercel-labs, included in
its folder. `unslop` and `code-structure` are MIT. The mattpocock skills are
MIT, licence in each folder.

## One conflict worth knowing

`unslop` pattern 13 bans em dashes and also rules out parentheses as a
substitute. The standing rule for this repo permits parentheses: replace a dash
with a comma, colon, parentheses or a period, and use `،` and `؛` in Arabic.

**The repo rule wins.** Parentheses are fine. What is not fine is an em dash or
an en dash in anything a user sees. Everything else in `unslop` applies as
written.
