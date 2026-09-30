# Contributing to billy

Thanks for helping out. billy is small, so the process is light.

## Before you start

- **Bugs and ideas:** open an issue first, so we can agree on the fix before you
  write code.
- **Small fixes** (typos, obvious bugs): open a PR directly.
- Look for issues labeled `good first issue` or `help wanted`.

## Workflow

1. Fork the repo and branch from the right base:
   - `launch-alpha` for anything in the editor or the landing page
   - `main` for the waitlist page
2. Install with `bun install` and run `bun dev`.
3. Keep each PR to one change. Before you push, make sure `bun run lint` and
   `bun run build` pass.
4. Open the PR against the same base branch and link the issue it fixes
   (`Closes #123`). For UI changes, include before and after screenshots at
   desktop (1280px) and phone (375px) widths.

## Style

- Match the code around your change: its naming, comment density and idioms.
- UI follows `DESIGN.md` on `launch-alpha`.
- User-facing copy uses plain punctuation. Please avoid em-dashes.

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](LICENSE).
