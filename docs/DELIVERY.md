# P0–P3 synthetic development delivery — 7 November 2026

Version 0.2.0, based on genuine Git revision
`bebddf78e24eab1d0949afd14f9f7e6bcfa1a876`, with uncommitted source changes.
No history, authorship, device results or owner sign-off was fabricated.
The user's current P0–P3 request authorizes continuing these dependencies in
sequence while earlier review/device debt remains explicit. It supersedes the
older one-checkpoint packet restriction for this delivery only.

## What changed

The original memory demo remains available. The desktop test application uses
the same portable financial rules with a separate SQLite adapter and a narrow,
sandboxed Electron bridge. It retains original IDs, exact bigint cents, separate
EUR/USD totals, posted facts and append-only history. A deterministic migration
adds legal entities, reporting scopes, memberships, activities, projects,
personal-income records and effective-dated profiles. Unknown tax facts remain
unknown; personal income never silently becomes business revenue.

New business archival retains history and rejects further writes. English and
German labels use canonical identifiers. A mandatory accounting/security module
registry rejects missing dependencies and makes disabled-module access read-only.
Desktop commands atomically store their replay receipt with financial state;
retrying a committed command with a lost response uses its original identity.

The desktop vault starts locked. Records and originals are authenticated AES-GCM
ciphertexts inside SQLite; this is record-level encryption, **not SQLCipher or
whole-database encryption**. Unlock keys are passphrase-derived and held only in
the main process. There is manual/idle locking, encrypted independent-passphrase
backup, restore into a new directory, and pre-migration ciphertext recovery copies.
Only fictional TXT/PDF/PNG/JPEG attachments up to 2 MiB are accepted; signature
screening is not malware scanning. Only TXT notes have an in-app reader.

## Checklist disposition

| IDs | Delivered code/evidence | Still required for acceptance |
| --- | --- | --- |
| P0.C01 | Pinned Node/npm, reproduced core/browser workflow and current check reports | Owner review; older failed browser records remain historical |
| P0.C02 | Original audit retained; current additions described here with source and tests | Review the updated capability boundary |
| P0.C03 | Fictional profiles, currency examples, third-business regression and device matrix retained | Device measurements |
| P0.C04 | Versioned Austrian/EU case inventory and disabled official-output adapter retained | Accounting/legal acceptance; no tax-final output enabled |
| P0.C05 | Separate native probe retained; portable probe checks/build run here | Physical Windows/Android save, camera, restart, transfer and notification measurements |
| P0.C06 | ADR-013/014 and explicit next work | Owner architecture acceptance |
| P0.C07 | Standard MPL file unchanged; genuine history preserved; bounded source inventory and artifact hashes | Contribution rights, asset provenance, full dependency/target privacy/legal review |
| P1.C01–C07 | Ownership migration, portable rules, transactional/replay contracts, date/import identities, canonical translations, registry, archival/profile history | Owner review of contracts and their limits |
| P1.C08 | Versioned requirements for all 92 IDs; named test outcomes, freshness and manual-review gates; negative regressions | Actual manual acceptance; a report cannot authenticate a human reviewer |
| P2.C01 | Portable Windows x64 desktop package; local database and original-byte attachment storage | Windows device execution/offline acceptance; package is unsigned, not an installer |
| P2.C02 | SQLite atomic commit, authenticated records, guarded schema migration and structured errors | Windows filesystem/update acceptance |
| P2.C03 | Local create/unlock/lock with no account or cloud credential | Windows usability/access review |
| P2.C04 | Linux abrupt-exit recovery and real SQLite-full rollback tests; desktop restart test | Physical cold boot, Windows low-disk/power-loss measurements |
| P3.C01–C02 | Consistent encrypted backup; separate-path restore verifies structured state, original bytes and hashes | Independent-device backup/restore review |
| P3.C03 | Scrypt/AES-GCM design, main-process keys, wrong-key/idle/manual-lock tests | Independent security/key-management review; not real-data approval |
| P3.C04 | Pre-migration recovery copy and failed-migration/restore tests | Actual application-update and independent-target recovery exercises |
| P3.C05 | Explicit synthetic destinations, denied unsafe overwrite/symlink paths, scoped commands/files and sensitive-action checks | Physical/independent review; genuine-data activation remains unavailable |

All 92 stable IDs are preserved. No checkpoint is automatically verified or
released. In-review means code and evidence await acceptance, not that a phase
has met every acceptance gate. P0.C05/P2 device requirements remain blocked here.

## Reproduce the checks

Use Node **24.22.1**, npm **11.9.0**, then from the repository root:

```sh
npm ci
npm run desktop:install
npx playwright install chromium
npm run check:desktop
npm run progress
npm run spike:install
npm run spike:check
```

In this cloud machine use `npm ci --cache /workspace/.npm-cache`,
`electron_config_cache=/workspace/.cache/electron npm run desktop:install`, and
`PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run check:desktop`.
The Playwright CDN is denied by this machine's network policy; the supported
installed-Chromium override was used instead. No network settings were changed.

`outputs/checks.json` identifies the checked executable-source fingerprint,
revision, dirty state, real command exits and named test results. Node and
desktop JUnit/JSON files are generated from their current runs; Playwright also
writes its current JSON results. Failure, skipped, expected-failure and not-run
are distinct. The progress manifest records requirements separately from review.
Evidence/status observations are excluded from the executable fingerprint to
avoid self-referential hashes; requirements and executable source remain included.

Linux container Electron tests use a temporary explicitly synthetic profile and
a headless Chromium platform. Only that test launcher uses `--no-sandbox` to
accommodate the container. The application and Windows package retain the
sandbox/context-isolation settings. Headless native screenshots were unavailable;
browser screenshots depict the actual **memory demo**, not the desktop vault.
Dialog selections in the desktop test are deterministic fictional test paths;
file operations, encryption, IPC and restart/restore are real.

## Try the delivery

See [DESKTOP_TESTING.md](DESKTOP_TESTING.md) and [RECOVERY.md](RECOVERY.md).
The source ZIP includes source, lockfiles, licenses and selected generated
reports; it excludes dependencies, real records, local vaults and `.git`.
It is a source snapshot, not a substitute for the genuine repository history.
The separate Windows ZIP contains a portable unsigned fictional-data build.
No environment configuration was reapplied or published, and no changes were
pushed to GitHub.

Remaining engineering limits: no signed installer/updater, Android accounting
application, PDF/image viewer, multi-process/multi-user editing, real taxpayer
activation, legal mapping or production security certification. Backup plaintext
payloads are bounded to 24 MiB before encryption; this test build is not intended
for large archives. Local hostile/administrator access, forensic memory erasure,
hardware failure and all possible filesystem races are outside the demonstrated
security boundary. Independent off-device backups remain necessary.

Next: run the supplied Windows/physical Android matrix, retain the actual
results, and review the P1 contracts, encryption and recovery design. Fix any
observed defects before accepting P2/P3 or enabling genuine-data work.
