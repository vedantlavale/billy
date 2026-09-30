# Third-party notices

billy is MIT licensed (see `LICENSE`). A few files come from other projects
and keep their own terms, which take precedence over `LICENSE` for them.

## In the app

| Path | Source | License |
| --- | --- | --- |
| `apps/web/components/icons/rune.tsx` | [Nexvyn/runeicons](https://github.com/Nexvyn/runeicons) | Apache-2.0 (`LICENSE-RUNE`) |
| `apps/web/components/motion/`, `apps/web/lib/ease.ts` | [beUI](https://github.com/starc007/ui-components) by Saurabh Chauhan, restyled | MIT (`components/motion/LICENSE`) |

## Agent skills (development tooling, not shipped)

| Path | Source | License |
| --- | --- | --- |
| `skills/codebase-design`, `diagnosing-bugs`, `domain-modeling`, `grilling`, `improve-codebase-architecture`, `triage` | [mattpocock/skills](https://github.com/mattpocock/skills) | MIT (file in each folder) |
| `skills/unslop`, `skills/code-structure` | cursor/plugins and michaelshimeles, per `skills/README.md` | MIT |
| `skills/before-and-after` | James Clements (vercel-labs), via michaelshimeles | **PolyForm Shield 1.0.0** (file in folder) |

PolyForm Shield is source-available, **not** open source: you may not use
`skills/before-and-after` to provide a product that competes with its
licensor's.

### Unclear terms

The upstream repos for these publish no license, so we can't grant rights to
them. If you fork billy, delete them or get permission from their authors.

| Path | Upstream |
| --- | --- |
| `skills/evidence-driven-testing`, `skills/new-feature` | [michaelshimeles/skills](https://github.com/michaelshimeles/skills) (no license) |
| `skills/deep-review` | ours, partly based on [rdeepak-711/claude-code-skills](https://github.com/rdeepak-711/claude-code-skills) (no license) |
