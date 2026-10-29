# Starter .gitignore

Place the supplied `.gitignore` in the repository root, beside `package.json`
and `LICENSE`. The filename starts with a dot and has no `.txt` extension.
If the repository already has a `.gitignore`, merge the rules and retain any
project-specific exclusions. Review existing negation rules (`!`) as well.

This starter covers the documented React/TypeScript, Node and Cloudflare stack,
local accounting storage, generated tests, common editor files, and optional
future Android, Electron and Tauri build output. Those future sections do not
mean the app already uses those packaging tools.

## Data and examples

- Prefer storing real accounting data outside the source checkout. This file
  is the starter ignore configuration for the accounting project.
- Root folders such as `data/`, `private-data/`, `receipts/`, `contracts/`,
  `uploads/`, `imports/`, `exports/` and `backups/` are reserved for ignored
  local content. They do not configure where the app actually saves files.
- Development and testing use wholly fictional data. Keep shareable fixtures in
  `tests/fixtures/`, for example `tests/fixtures/receipts/example-receipt.pdf`.
- Database binaries and key material are excluded even in fixture folders.
  Prefer SQL schema/seed scripts and generate disposable databases during tests.
  Review any necessary exception individually; never whitelist real credentials.
- `.env.example`, `.env.*.example` and matching `.template` files can be
  committed, as can equivalent `.dev.vars` examples. They must contain only
  placeholders or harmless fictional values. Example filenames do not sanitize
  their contents.
- The active dependency lockfile, source, migrations, tests, CI configuration,
  reviewed hosting configuration and source assets remain available to commit.
  Blanket PDF/CSV/JSON/ZIP exclusions would hide valid project material.
- Keep credentials out of tracked configuration such as `.npmrc`, VS Code
  settings/tasks, Wrangler configuration and hosting manifests. Use environment
  variables or the platform's secret store instead.

## Review before committing

Run these commands from your actual repository root:

```sh
git status --short
git status --short --ignored
git check-ignore -v -- .env .wrangler/state/example.sqlite
git ls-files -ci --exclude-standard
```

`git check-ignore` shows the rule matching each example path. The final command
lists files that are already tracked even though current ignore rules match
them. Inspect any results before committing; do not remove files blindly.

After reviewing the rules:

```sh
git add .gitignore
git diff --cached -- .gitignore
git commit -m "Add starter ignore rules for local data and generated files"
```

Git ignore rules apply to untracked files. They do not remove tracked files or
past commits, prevent a forced add, validate file contents, or encrypt local
data. If a secret was already committed, revoke/rotate it and address the
existing history separately. Do not treat an ignored folder as a backup.

Reference: [Git's official gitignore documentation](https://git-scm.com/docs/gitignore).
