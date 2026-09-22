# Notes on the agentic SDLC setup

Why the workflows and skills in this repo look the way they do. Each of these
was a failure first, not a theory. Copied in from the agentic-sdlc-kit.

## Things that cost real time to work out

Each of these was a failure first. They are the reason the configs look the way
they do.

**The review runs green and says nothing.** Four causes, usually stacked:
- The prompt did not pass `--comment`. The plugin's own instructions say that
  without it, stop and post nothing. This alone explains most silent reviewers.
- `pull-requests: read` instead of `write`, so it cannot post.
- `fetch-depth: 1`, so there is no base branch to diff against.
- No `--allowedTools`, so tool calls get denied and the run bails in three turns.

**The review runs green, then posts nothing, on a newer Claude Code.** Newer
versions launch subagents in the background by default. The reviewer fans out
to its rubric agents, ends its turn with "pausing until the agents report
back", the headless session exits, and nothing is posted. The run log's last
`result` line gives it away. Fixed two ways: `CLAUDE_CODE_DISABLE_BACKGROUND_TASKS: "1"`
on the action step, and a rule in `deep-review` to never end the turn with a
subagent running. The skill rule works as soon as it is on the PR branch; the
env var needs the workflow on the default branch first.

**The GitHub App is not the Anthropic credential.** Installing the Claude GitHub
App on an organisation grants GitHub access: reading the PR, posting comments,
acting as `claude[bot]`. It grants nothing at Anthropic. Running the model needs
a second, separate credential, `CLAUDE_CODE_OAUTH_TOKEN`, and that is a repo or
org **Actions secret**, not part of the App.

The failure is confusing because everything GitHub-side succeeds first. The log
reads `App token successfully obtained`, `Using GITHUB_TOKEN from OIDC`,
`Permission level retrieved: admin`, it installs Claude Code, and only then:

```
Error: Either ANTHROPIC_API_KEY, CLAUDE_CODE_OAUTH_TOKEN, or workload identity
federation is required when using direct Anthropic API.
```

So a repo where the review works and a repo where it does not can look identical
in org settings. The difference is one Actions secret.

There are two ways to get one onto a repo.

**`/install-github-app`, run inside Claude Code in the repo.** This is how the
secret usually appears without anyone remembering they set it. The command
installs the GitHub App, sets `CLAUDE_CODE_OAUTH_TOKEN` as a repo secret, and
opens a PR adding its own `claude.yml` and `claude-code-review.yml`, all in one
flow. It is the quickest route for a single repo.

One catch if you use it alongside this kit: the review workflow it adds is the
stock one, which is the shallow reviewer this kit exists to replace. Take the
App and the secret from it, then keep this kit's
`.github/workflows/claude-code-review.yml` and delete or ignore the one it
wrote. `claude.yml` is worth keeping either way: it handles tagging the bot for
a one-off request, which is a different job from the automatic review.

**Or set the secret yourself.** Once for the whole org rather than per repo:

```bash
gh secret set CLAUDE_CODE_OAUTH_TOKEN --org <org> --visibility all
```

That needs org admin (`gh auth refresh -h github.com -s admin:org`). Per repo:

```bash
gh secret set CLAUDE_CODE_OAUTH_TOKEN --repo <org>/<repo>
```

`claude setup-token` mints one. Check what a repo actually has with
`gh secret list --repo <org>/<repo>`; an empty list is the usual answer.

**A workflow change cannot test itself.** `claude-code-action` refuses to run
when the workflow file differs from the copy on the default branch. It is an
anti-tampering guard: otherwise any PR could edit the workflow and read the
token. So the PR that adds or edits the review workflow will not be reviewed.
Merge it first. Keep prompt changes in the skill file, which *is* read from the
branch under review, rather than in the workflow.

**`--allowedTools` is variadic, so no tool spec may contain a space.**
`Bash(gh pr view:*)` word-splits into three broken specs. Use `Bash(gh:*)`.

**Never interpolate `${{ }}` into a `run:` body.** The expression is pasted into
the script text before the shell sees it, so a crafted branch name, PR title or
issue body executes on the runner. Pass it through `env:`. This is the most
common real vulnerability in a repo's own automation, and it is easy to miss
because a workflow reads like configuration rather than code.

**Never commit screenshots.** Git keeps every blob forever, and if the repo
merges rather than squashes, a capture on a merged branch is in the default
branch's history permanently. Deleting it later reclaims nothing.

**A private repo needs GitHub's own attachment store for inline images.**
GitHub fetches every PR-body image through a proxy that is not logged in as the
reader, so a URL into a private repo is broken for everyone, and a bucket or a
secret gist only moves where the public copy lives. Attachments are the
exception, because GitHub serves them itself. There *is* an API for this even
though it is undocumented: `POST https://uploads.github.com/user-attachments/assets`
with a Bearer token, which is what `publish-captures.sh` uses. Do not conclude
from "the docs say nothing" that an endpoint does not exist; this kit had a
whole branch-and-artifact workaround built on exactly that assumption before
anyone tried a single curl.

**Deleting a branch does not delete the bytes.** GitHub keeps unreachable
objects fetchable by SHA and will not collect on request, so pushing anything to
a throwaway branch is not a way to make it temporary.
