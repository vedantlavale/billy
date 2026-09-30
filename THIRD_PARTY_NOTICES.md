# Third-party notices

billy is MIT licensed (see `LICENSE`). The agent skills under `skills/`,
`.agents/skills/` and `.claude/skills/` are development tooling, not part of the
website. Many come from other projects and keep their own terms, which take
precedence over `LICENSE` for those files.

## Licensed

| Path | Source | License |
| --- | --- | --- |
| `skills/codebase-design`, `diagnosing-bugs`, `domain-modeling`, `grilling`, `improve-codebase-architecture`, `triage` | [mattpocock/skills](https://github.com/mattpocock/skills) | MIT (file in each folder) |
| `skills/unslop`, `skills/code-structure` | cursor/plugins and michaelshimeles, per `skills/README.md` | MIT |
| `skills/before-and-after` | James Clements (vercel-labs), via michaelshimeles | **PolyForm Shield 1.0.0** (file in folder) |
| `.agents/skills/frontend-design` | [anthropics/skills](https://github.com/anthropics/skills) | Apache-2.0 (file in folder) |
| `.agents/skills/hallmark` | [nutlope/hallmark](https://github.com/nutlope/hallmark) | MIT |
| `.agents/skills/supabase`, `.agents/skills/supabase-postgres-best-practices` | [supabase/agent-skills](https://github.com/supabase/agent-skills) | MIT |
| `.claude/skills/integration-nextjs-app-router` | PostHog wizard | MIT |

PolyForm Shield is source-available, **not** open source: you may not use
`skills/before-and-after` to provide a product that competes with its
licensor's.

## Unclear terms

The upstream repos for these publish no license, so we can't grant rights to
them. They're kept for the maintainer's own use. If you fork billy, delete them
or get permission from their authors.

| Path | Upstream |
| --- | --- |
| `skills/evidence-driven-testing`, `skills/new-feature` | [michaelshimeles/skills](https://github.com/michaelshimeles/skills) (no license) |
| `skills/deep-review` | ours, partly based on [rdeepak-711/claude-code-skills](https://github.com/rdeepak-711/claude-code-skills) (no license) |
| `.agents/skills/design-system` and its copies in `.agent/`, `.codex/`, `.cursor/`, `.opencode/` | unknown |
