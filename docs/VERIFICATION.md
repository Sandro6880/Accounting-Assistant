# Verification record — P0.C01

Repository inspection: **31 October 2026**, starting revision
`9b7741ccf2d6a6538781c9684d2130a92a99660a`.
Observed host: Linux x64, Node 24.22.1, npm 11.9.0.
All application records are wholly fictional `synthetic-v1` fixtures.

The earlier 0.1.0 preparation note described an archive without repository
history. This record instead documents the actual Git checkout. See
[BASELINE.md](BASELINE.md) for the revision, toolchain, scripts, capability
inventory, reproduced DOM workflow and source-review limits.

## Observed results

- `npm ci`: passed, exit 0, using the tracked npm lockfile.
- `npm run check`: passed on the clean starting revision. Strict typecheck,
  24 Node/DOM tests, production build and all 92 manifest IDs passed.
  The 24 tests comprise 18 domain/application/adapter checks, three React DOM
  interaction checks and three manifest checks. Nine isolated Test Lab
  assertions are exercised inside the Node suite, not counted as nine additional
  Node tests.
- `npm run progress`: executed separately; it did not promote any checkpoint.
- `npx playwright install chromium`: blocked, exit 1. Downloaded content was not
  a usable ZIP, including the installer's retries.
- `npm run check:all` with an isolated Chromium 153.0.8010.0 launcher: failed,
  exit 1. The core stages passed; browser cases failed before interaction.
- `npm run test:e2e` after correcting the alternative executable's permissions:
  failed, exit 1. The browser exited with SIGSEGV before page interaction.
  None of the six desktop/mobile-emulation journeys is claimed passed.

After the packet's documentation and blocked-status changes, `npm run check`
passed again: typecheck, all 24 tests, build and manifest validation exited 0.
The run recorded the starting Git revision with `gitDirty: true` and source
fingerprint `d7468a6a1cd7d17cdcc9634de6aa734cb90c6a8589202333f0249fd3864508c6`.
`npm run progress -- --json` then reported fresh core results, one blocked
checkpoint and 91 planned. A source comparison confirmed all 92 IDs and the
other 91 checkpoint records were unchanged; `git diff --check` and local links
in the changed Markdown files also passed review.

The final core run marks browser journeys not-run, not passed; the earlier
extended attempts remain blocked as recorded above. Generated execution reports
and launch traces stay ignored. `outputs/checks.json` always records the latest
runner invocation, which can replace an earlier core-only pass with an
extended-run failure or vice versa. Read its scope and individual stages together.

## P0.C01 decision and subsequent continuation

**P0.C01 is Blocked and unverified.** Its evidence is recorded in
`project/checkpoints.json`. The blocker is missing successful native-browser
journey evidence. Its baseline packet did not start another checkpoint.

The owner subsequently deferred verification and authorized P0.C02's source
comparison, followed by P0.C03's fictional profiles/platform matrix. Those two
checkpoints are In review. The later P0.C04 accounting/VAT definition is also
In review; the other 88 remain Planned. See
[CAPABILITY_AUDIT.md](CAPABILITY_AUDIT.md) and
[SYNTHETIC_PROFILES.md](SYNTHETIC_PROFILES.md) and
[ACCOUNTING_SCOPE.md](ACCOUNTING_SCOPE.md) for their own scopes, evidence and
checks. P0.C01's original checkpoint evidence and browser blocker are unchanged.
No new browser result is implied by continuing these definition packets.

`npm run progress -- --json` includes every status count. The existing human
progress summary prints verified, in-progress and planned counts only; it omits
blocked and in-review checkpoints. Use the manifest, JSON output or in-app Roadmap for that
status. Expanding progress reporting remains separate roadmap work.

For completion on a working browser host, run:

```sh
npm ci
npx playwright install chromium
npm run check:all
npm run progress -- --json
```

The runner records commands, actual exit codes, durations, runtime, Git
revision/dirty state, selected scope and checked-source fingerprint. A dirty
working-tree run is not a claim that changes were committed or pushed. Source
edits after a run make its evidence stale. Manifest validation checks evidence
structure, not truth or acceptance.

No manual browser layout review, hosted GitHub CI run, installed Windows app,
actual Android device, durable storage/recovery, authentication/encryption,
legal mapping, government transmission or repository-history/privacy audit
was certified. DOM checks and mobile emulation do not provide that evidence.

## Owner feedback after P0.C03

On 31 October 2026 the owner reported **“it works”** and authorized continuing.
This is recorded as a working-result confirmation with unspecified test scope.
No command log, six-journey report, filled checklist or actual-device details
were supplied with that message. It does not establish which automated/manual
checks ran, so no detailed results or earlier checkpoint states were fabricated.
P0.C04 proceeds under that continuation request; the prior records are retained.
