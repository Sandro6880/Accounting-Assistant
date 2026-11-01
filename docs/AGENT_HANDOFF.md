# Agent handoff

Work only on this repository and one new roadmap checkpoint at a time. Read
AGENTS.md, README.md, ROADMAP.md, SECURITY.md and ARCHITECTURE.md first.

## Current delivery: reconstructed P0.C06 + P0.C07, In review

Owner reported the combined download unavailable. The prior ZIP/worktree is
missing and no saved copy was recovered. Checkpoint 5 is committed on origin/main
as `cca3fb7b4a9efc0373ff02c11e2e59415651cba7`, tree
`49a515eb64d3a10c62c8574d11d843e5bd4a2fdc`. This replacement rebuilds the same
bounded scope, not byte-identical prior files. No commit or push was made.

- P0.C06: twelve architecture decision IDs, seven existing roadmap work packets,
  conditional native candidates and explicit ownership/transaction/recovery gates.
- P0.C07: actual bounded 14-commit/177-blob history/source review, standard license
  comparison, notices/dependency/privacy inventories and unresolved questions.
- Current counts: 2 blocked, 5 in review, 85 planned, zero verified.
- Earlier checkpoint evidence is unchanged. P0.C01 browser checks and P0.C05
  native builds/actual-device measurements remain blocked.
- Main 26 tests and separate probe ten tests/build pass; this is not manual,
  device, rights, legal or release acceptance. No production adapter is activated.

See [REPOSITORY_REVIEW.md](REPOSITORY_REVIEW.md) for rights, native transitive
licenses, generated XML provenance, identity/signatures, unavailable archives,
unreachable-object and release limits. Genuine history and standard MPL remain.
No real documents/accounts/credential stores were accessed. No cleanup/rotation
or public/private communication was performed.

## Run and test

Use npm.cmd in Windows PowerShell. See [LOCAL_TESTING.md](LOCAL_TESTING.md).

```sh
npm ci
npm run check
npm run spike:install
npm run spike:check
npm run progress -- --json
```

Core and probe source fingerprints/scopes are independent; later runs overwrite
ignored result files. Browser journeys require a working Playwright host and
check:all; none passed claim is introduced here. No installer/APK is supplied.
The main app is still session memory and resets on refresh. Keep synthetic-only.

## Next bounded action

Review this delivery and outstanding P0 evidence. P1.C01 is next in roadmap order
but has not started. A future explicit owner continuation can authorize one
bounded ownership/schema slice with earlier acceptance debt recorded; never
silently promote P0, activate real data or bundle several P1 tasks. See
[NEXT_WORK.md](NEXT_WORK.md) and project/architecture-plan.json.
