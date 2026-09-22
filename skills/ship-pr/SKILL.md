---
name: ship-pr
description: Open a PR with before/after proof, then loop on the bot's review until the verdict is 'Looks good' with no unresolved comments. Use when the work is built and proven and it is time to open or finish a pull request, or when the user says "ship it", "open a PR", or "get this PR clean".
allowed-tools:
  - Bash(gh pr:*)
  - Bash(gh api:*)
  - Bash(gh run:*)
  - Bash(git:*)
  - Read
  - Grep
  - Glob
  - Task
  - TodoWrite
---

# Ship a PR

Open the PR, then keep fixing until the review is clean. This is the shape of
`greploop`, pointed at the `code-review` skill in this kit rather than a paid
service, so it works on any repo with no third-party install.

The review runs automatically on `pull_request` open and on every push, from
`.github/workflows/claude-code-review.yml`. Nobody tags `@claude` by hand.

## Inputs

- **PR number**, optional. Detect from the current branch.
- **`--max-iterations N`**, default 5. Cap the review-fix-push cycles.

## 1. Open the PR

Before opening, make sure the work is proven. Run `/before-and-after` and have
the pair ready, or the measured numbers when the change has no visible surface.

```bash
git push -u origin <branch>
gh pr create --base main --title "<title>" --body "<body>"
```

The body must have, in this order:

```markdown
Closes #<issue>

## What changed
<plain prose, what and why>

## How it was tested
<the commands you ran and what they printed, not a claim that you ran them>

## Before and after
<the table or the numbers>

## Risks and follow-ups
<what could break, what is deliberately left>
```

`Closes #<issue>` is not decoration: `deep-review` finds the issue through it and
checks the PR against it, including any agent brief `/triage` posted there. Drop
the line only when there is genuinely no issue, and say so in `What changed`.

Run the title and body through `/unslop` before posting. No em dashes, no emojis,
no filler.

Never open against anything but the default branch, and never push to it directly.

## 2. Wait for the review

The workflow triggers itself. Do not post `@claude` to trigger it, that fires the
other workflow and gives a different, shallower answer.

```bash
HEAD_SHA=$(gh pr view <N> --json headRefOid -q .headRefOid)

for i in $(seq 1 60); do
  STATUS=$(gh run list --workflow=claude-code-review.yml --limit 10 \
    --json headSha,status,conclusion,databaseId \
    -q "[.[] | select(.headSha==\"$HEAD_SHA\")] | first")
  [ -n "$STATUS" ] && echo "$STATUS" | grep -q '"status":"completed"' && break
  sleep 10
done
```

If no run appears for the head SHA after ten minutes, check the workflow is
enabled and that the review workflow's auth secret is set on the repo. Say so rather
than looping forever.

## 3. Read the verdict

The review posts one summary comment ending in a verdict line, which is the last
line of the comment:

```
## Verdict

✅ Looks good
```

```bash
gh pr view <N> --json comments -q '.comments[-1].body'
gh api repos/{owner}/{repo}/pulls/<N>/comments --jq '.[] | {path, line, body}'
```

Read the inline comments too. The summary lists them but the inline ones carry
the line anchors.

## 4. Loop

| Verdict | Do |
|---|---|
| `✅ Looks good`, no unresolved comments | Done. Go to step 5 |
| `⚠️ Changes requested` | Fix the P1 and P2 findings, push, re-review |
| `❌ Blocking issues` | Go back to building. A P0 is a security, data loss or cross-tenant finding. Fix, re-prove, push, re-review |

Findings are tagged P0 to P3. P3 is advisory, it appears in the summary only and
does not hold the loop. Everything P2 and above needs a fix or a reply saying why
it is not a problem.

Going back to building means the whole beat, not a patch. If a finding says the
feature does not do what the PR claims, re-run `/before-and-after` after fixing
and update the PR body with the new proof. Stale proof is worse than none.

For each finding, either fix it or reply on the thread saying why it is not a
problem. Do not leave a finding unanswered. Resolve threads you have addressed:

```bash
gh api graphql -f query='mutation($t:ID!){resolveReviewThread(input:{threadId:$t}){thread{isResolved}}}' -f t=<thread-id>
```

Push, and the review re-runs on the new SHA. It does not suppress itself on a
second look, so a push always gets a fresh verdict.

Stop after `--max-iterations` cycles and report where it stands rather than
looping forever. If the same finding survives two fixes, stop and ask. You are
probably misreading it.

## 5. Finish

Report the PR URL and the final verdict. Do not merge unless you are told to.

Keep the branch until the PR is merged or closed.
