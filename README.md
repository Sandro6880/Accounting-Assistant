# Offline Accounting Workspace

An accounting workspace for freelancers and small businesses, with guided bookkeeping, organized evidence, annual history and obligation timelines. The first planned accounting profile is an Austrian sole trader, with applicable EU transaction rules, EUR reporting, EUR/USD source records and switchable English/German.

The goal is to make a recorded amount traceable: annual report → entry or asset calculation → original supporting document. Offline Windows use and Android capture come before optional online synchronization. Development and every test use wholly fictional data.

## Project status

Version **0.1.0** is a runnable React/TypeScript/Vite application with fictional records in session memory. It includes draft creation, posting, full reversals, separate EUR/USD totals, English/German controls, fictional business creation, an executable browser Test Lab and a roadmap view.

**P0.C01** retains its deferred browser-verification blocker. **P0.C02/P0.C03/P0.C04** remain In review. The current **P0.C05** packet supplies a separate synthetic Tauri platform probe, ten portable probe tests and a Windows/Android device guide. The existing accounting core still has 26 tests. P0.C05 is Blocked pending native compilation and actual device measurements; no installer/APK or native pass is claimed. The other 87 checkpoints remain Planned, with none verified. See [the spike guide](docs/PLATFORM_SPIKE.md) and [verification](docs/VERIFICATION.md).

For testing on your own Windows machine, follow [LOCAL_TESTING.md](docs/LOCAL_TESTING.md): exact PowerShell commands, all five app views, expected totals, third-business creation, reset and a blank results template. The app still starts with the same two fictional businesses and baseline figures; create Example Workshop through Businesses to exercise the third profile.

| Area | Implemented starting point | Planned work |
| --- | --- | --- |
| Bookkeeping | Draft creation, posting, linked full reversal and exact bigint cents | Saved-draft editing, business/private allocation, imports, reconciliation and period controls |
| Evidence | No document model, upload or download adapter yet | Original-file storage, ownership, contracts, recovery and retention |
| Reporting | Provisional posted totals with EUR and USD kept separate | CSV/review exports, EUR valuations, reviewed deductions, assets and official mappings |
| Verification | Core runner, JSON results, manifest validation, 26 Node/DOM tests, nine isolated Test Lab assertions and six configured browser journeys | Stronger evidence verification, storage/security/device and recovery checks |
| Platforms | Loopback browser development and preview; refresh discards records | Durable installed Windows and Android workflows; optional online sync later |

Full tax preparation, installed offline apps and production access controls remain planned. Unvalued USD is excluded from EUR totals and makes EUR reporting incomplete. There is no backend, SQL database, receipt archive or financial export in this revision. The commands below match the actual npm scripts and lockfile.

## Starter files

| File | Purpose |
| --- | --- |
| [README.md](README.md) | Product direction, status, local workflow and license |
| [ROADMAP.md](ROADMAP.md) | Phases, stable checkpoints, dependencies and proof requirements |
| [SECURITY.md](SECURITY.md) | Synthetic-data policy, security targets and reporting |
| [LICENSE](LICENSE) | Complete, unchanged Mozilla Public License 2.0 text |
| [.gitignore](.gitignore) | Starter exclusions for secrets, local records and generated output |
| [.env.example](.env.example) | Comment-only configuration template with no live values |
| [GITIGNORE_SETUP.md](GITIGNORE_SETUP.md) | Ignore-file setup, reserved paths and review commands |
| [src/](src/) | Domain rules, application use cases, memory adapter and React views |
| [tests/](tests/) | Node/DOM checks and Playwright browser journeys |
| [package.json](package.json) / [package-lock.json](package-lock.json) | Pinned runtime dependencies and actual npm scripts |
| [project/checkpoints.json](project/checkpoints.json) | Current states and evidence for all 92 roadmap IDs |
| [docs/BASELINE.md](docs/BASELINE.md) | P0.C01 revision, capability inventory, fixture and observed results |
| [docs/CAPABILITY_AUDIT.md](docs/CAPABILITY_AUDIT.md) | P0.C02 implemented/partial/missing comparison with source and coverage evidence |
| [docs/SYNTHETIC_PROFILES.md](docs/SYNTHETIC_PROFILES.md) | P0.C03 profiles, currency examples, platform matrix and bounded phone target |
| [docs/LOCAL_TESTING.md](docs/LOCAL_TESTING.md) | Windows commands and current-app manual testing walkthrough |
| [docs/TEST_REPORT_TEMPLATE.md](docs/TEST_REPORT_TEMPLATE.md) | Blank result sheet to copy into ignored outputs |
| [tests/fixtures/p0-c03/profiles.json](tests/fixtures/p0-c03/profiles.json) | Versioned fictional profile/currency catalog exercised through the existing application boundary |
| [docs/ACCOUNTING_SCOPE.md](docs/ACCOUNTING_SCOPE.md) / [project/accounting-scope.json](project/accounting-scope.json) | P0.C04 method, case coverage/exclusions, official source register and disabled report-target contract |
| [spikes/p0-c05/](spikes/p0-c05/) / [device guide](docs/PLATFORM_SPIKE.md) | Isolated native candidate, pinned dependencies, ten portable checks and actual device instructions |
| [Device results template](docs/PLATFORM_SPIKE_RESULTS_TEMPLATE.md) | Blank Windows/Android measurement sheet; no native results prefilled |

These files are already part of this repository. Preserve the existing Git history, MPL-2.0 notices and active npm lockfile when applying changes. The full `.gitignore` supersedes the earlier additions-only checklist. A source or update ZIP does not replace repository history.

## Who it is for

Freelancers and self-employed people who want organized income and expenses, receipt and contract records, a review queue, and a clear sequence of tasks around deadlines. Multiple businesses use the same setup and modules, with separate records and verified legal reporting scope. A brand or business label alone does not establish a separate taxpayer.

Development, demonstrations and AI-assisted work operate only on synthetic businesses, accounts, documents and payments. A later completed local production installation may support genuine records after its release and security gates pass. Genuine records remain outside source control and outside development or AI workspaces.

## Technology and architecture

| Component | Current implementation or planned direction |
| --- | --- |
| Interface | React 19.3.1 and TypeScript 7.0.2 |
| Web runtime | Vite 8.3.5; client-side application with no API routes or backend |
| Structured storage | Synthetic `MemoryRepository`; no persistence or migrations |
| Evidence storage | Not implemented |
| Installed platform candidate | Tauri 2 with local SQLite, subject to Windows/Android feasibility checks |
| Verification | Node test runner, React/JSDOM interaction checks, Playwright and npm check/progress scripts |

Use one modular domain and application core, with adapters for storage, identity, files, notifications and later synchronization. Financial rules stay outside pages and platform APIs. Typed module capabilities supply navigation and reusable business/year contexts. Required ownership, audit, recovery and validation controls cannot be disabled by hiding a module. Avoid duplicating pages for individual businesses.

No cloud account, backend service, credentials or application environment variables are needed. See [the architecture decisions](docs/ARCHITECTURE.md). Installed offline durability is separate from running a development server on the same machine.

## Run locally

Use **Node.js 24.22.1** (both `.nvmrc` and `.node-version`) and **npm 11.9.0** (`packageManager` in `package.json`). The supported Node range is `>=24.22.1 <25`. From the repository root:

```sh
npm ci
npm run check
npm run progress
npm run dev
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173). The app starts with the fictional `synthetic-v1` fixture. Refresh or **Reset demo** discards changes; no records are saved to disk or browser storage. Do not enter genuine financial data.

For a production-build preview, run `npm run build` followed by `npm run preview`, then open [http://127.0.0.1:4173](http://127.0.0.1:4173). Both servers bind to loopback and use strict ports. There is no `db:local` script or database to initialize.

`.env.example` is a comment-only template; no configuration values are needed. No local or hosted identity adapter is implemented. Check [the security policy](SECURITY.md) before changing access or storage behavior.

## Run the actual checks

`npm run check` executes type checking, the Node/DOM suite, the production build and manifest validation. It leaves browser journeys explicitly not-run. The individual scripts are:

```sh
npm run typecheck
npm test
npm run build
npm run progress:validate
```

For browser journeys:

```sh
npx playwright install chromium
npm run check:all
```

Playwright runs three journeys in each of desktop Chromium and Pixel 7 Chromium emulation: draft/post/reversal, business/language switching, and Test Lab/session reset. Mobile emulation does not test an installed Android app. Browser installation and launch were blocked during P0.C01; none of the six journeys is claimed passed. On Linux CI, the supplied workflow installs browser dependencies with `npx playwright install --with-deps chromium`.

The in-app **Test Lab** executes nine isolated domain assertions. It does not read the local runner's results, export JSON or establish that Node, SQL, security or device tests ran. The `test:domain`, `test:integration` and `test:docs` scripts from earlier reference documentation do not exist in this checkout. The available Node script is `npm test`.

For the separate synthetic platform probe:

```powershell
npm.cmd run spike:install
npm.cmd run spike:check
npm.cmd run spike:preview
```

Its interface preview is `http://127.0.0.1:1420`; native operations report blocked
in a browser. Its independent report is `outputs/p0-c05-checks.json`. See the
[Windows/Android guide](docs/PLATFORM_SPIKE.md) for actual native build/testing
steps. The accounting app's memory storage and port 5173 remain unchanged.

### Result reporting and its limits

The existing runner writes actual exit codes, command durations, Node version, Git revision/dirty state, selected scope and a checked-source fingerprint to ignored `outputs/checks.json`. `npm run progress` reports checkpoint counts separately and flags stale checked source. `npm run progress -- --json` prints the same progress data as JSON. A later runner invocation replaces `outputs/checks.json`, so retain a run externally when its evidence is needed.

P1.C08 still needs stronger checkpoint/check and manual-evidence contracts; P4.C08 and P12.C05 have further Test Lab/release-runner requirements. The current validator checks evidence structure, not its truth. Installed-device, storage, recovery, security and legal-mapping evidence remains outside the current runner. Passing tests never automatically verifies a checkpoint.

## Planned accounting workflow

1. Create a business through a guided setup, allowing explicit unknown legal or VAT facts.
2. Capture a fictional income/expense record and attach its original sample evidence.
3. Review business allocation, supported tax treatment, EUR valuation and any asset classification.
4. Post through validated commands; correct posted facts through linked adjustments or reversals.
5. Reconcile statement movements without double-counting transfers, fees or payouts.
6. Browse each financial year and drill down from totals to records, evidence and retained calculation versions.
7. Generate applicable chronological obligation timelines and reminders, with filing and payment tracked separately.
8. Prepare supported reports from complete reviewed records, keeping preparation, transmission, acceptance and payment distinct.

An expense category does not automatically establish a lawful deduction. Asset rules, dates, business use, VAT and evidence must be reviewed for the supported year and case. Official-format and legal support is enabled per validated profile, form and year; missing inputs remain explicit.

## Roadmap

The full [ROADMAP.md](ROADMAP.md) contains **17 phases and 92 stable checkpoints**, each with a proof requirement. All checkpoint verification starts pending until the source and evidence are inspected. Work proceeds in small units, normally about two to six hours where feasible, with a meaningful test or demonstration and a recorded decision after each checkpoint.

| Phase | Outcome |
| --- | --- |
| P0 | Reproduce the baseline, inspect history and define supported synthetic cases |
| P1 | Separate domain rules, business ownership, module contracts and the test manifest |
| P2 | Deliver durable installed Windows operation |
| P3 | Verify backup, restore, local unlock and synthetic workspace isolation |
| P4 | Complete editing, business creation, bilingual UI and Test Lab progress |
| P4A | Preserve EUR/USD sources and reviewed EUR valuations |
| P4B | Organize documents, contracts and previous financial years |
| P5 | Deliver offline Android capture and safe transfer |
| P6 | Add supported obligation timelines, reminders and help |
| P6A | Validate required Austrian, EU and non-EU transaction cases |
| P7 | Import and reconcile fictional statements safely |
| P8 | Implement supported invoices, credits and payment tracking |
| P8A | Implement reviewed deductions, asset records and GWG/AfA schedules |
| P9 | Integrate closing, reports and the selected official-format readiness gate |
| P10 | Add optional online backup and sync after identity/security decisions |
| P11 | Add team roles, permissions and operational controls |
| P12 | Harden releases and deliver the local runner, recovery guide and archive exit path |

Optional public subscriptions, payment execution, payroll and broader legal profiles are future decisions. They are not dependencies for developing the present synthetic accounting workflow.

### Next bounded work

The current packet is **P0.C05 only**, Blocked pending installed Windows/actual Android build and measurement evidence. Follow [PLATFORM_SPIKE.md](docs/PLATFORM_SPIKE.md) for this same checkpoint; P0.C06 has not started. The earlier reviews remain pending. The separate probe does not add financial persistence, tax output, protected recovery or paired transfer to the main app.

These planned tasks alone represent **24–36 hours** of useful work, subject to the baseline inspection. They are not completed-task claims or a commitment to charge a fixed duration.

| Task | Scope and proof | Estimate |
| --- | --- | --- |
| T01 | Reproduce baseline scripts and inventory implemented versus missing behavior at an exact revision | 4–6 h |
| T02 | Define checkpoint/check manifest and prove that missing evidence prevents verified status | 4–6 h |
| T03 | Add truthful local result reporting with pass, fail, blocked, skipped and not-run states | 4–6 h |
| T04 | Implement a bounded saved-draft edit path and exercise stale-revision recovery | 4–6 h |
| T05 | Guard synthetic seed/reset targets and prove that an ambiguous destination is rejected | 4–6 h |
| T06 | Add focused unauthorized-access regressions around owned records and evidence | 4–6 h |

## Data and security rules

- Every fixture, uploaded sample, screenshot, issue attachment and AI prompt uses wholly fictional data. Masked copies of actual records are not fixtures.
- Keep local test databases and evidence directories isolated. Seeds and destructive tests must reject unmarked or production destinations.
- Real records, exports, backups, authentication secrets and keys belong outside source control and development or AI workspaces.
- Future local production access requires local verification, auto-lock, protected storage and tested recovery. A UI password dialog alone does not secure files.
- Future online access requires server-enforced identity and business authorization, secure sessions, stronger verification and revocation. A local development identity is never an online credential.
- Review file uploads, logs, CSV output and support exports as potential disclosure paths. Generated test reports contain synthetic details only.

See [SECURITY.md](SECURITY.md) for the threat model and acceptance checks.

## Development and evidence

For the Agent: Keep genuine commits, authorship and useful task descriptions. Implement one bounded checkpoint at a time, run checks for the changed behavior, record the result and update the roadmap. Do not fabricate run results, releases, users or deployed functionality. Keep existing attribution and comply with dependency and contribution licenses.

The included [.gitignore](.gitignore) covers environment values, signing keys, local databases and evidence folders, dependency caches, builds, generated test output and optional Android/desktop artifacts. Keep the active lockfile, schema migrations, source, tests and fictional fixtures in Git. [GITIGNORE_SETUP.md](GITIGNORE_SETUP.md) explains reserved root paths and safe setup. Ignore rules do not remove tracked files or past commits, inspect contents, prevent a forced add or encrypt data. Inspect tracked content, history and distributed artifacts as part of repository preparation.

## License

This project is licensed under the **Mozilla Public License 2.0 (MPL-2.0)**. See the complete, unchanged [LICENSE](LICENSE).

MPL 2.0 permits commercial use. Its file-level source-sharing requirements apply when covered software is distributed; it is not a noncommercial license. Preserve existing third-party licenses, copyright notices and attribution, and license only material for which the necessary rights are held.

For JavaScript/TypeScript source files covered by MPL 2.0, add the following notice near the top. Use the appropriate comment syntax for other languages, or the Exhibit A notice from `LICENSE`:

```ts
// SPDX-License-Identifier: MPL-2.0
```

No name or year placeholders need to be filled in within the standard license text. An accurate copyright notice may be added separately. See [Mozilla's application guidance and FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/) for source notices and distribution obligations.
