# Offline Accounting Workspace

An accounting workspace for freelancers and small businesses, with guided bookkeeping, organized evidence, annual history and obligation timelines. The first planned accounting profile is an Austrian sole trader, with applicable EU transaction rules, EUR reporting, EUR/USD source records and switchable English/German.

The goal is to make a recorded amount traceable: annual report → entry or asset calculation → original supporting document. Offline Windows use and Android capture come before optional online synchronization. Development and every test use wholly fictional data.

## Project status

This starter supplies project documentation, the selected license and repository configuration. It contains no application source or Git history. Implementation status must be established from the actual project checkout before a feature is described as working.

A documented browser-based reference application informs the plan below. Its capabilities and scripts are starting points to inspect, not evidence that they are already implemented in this repository. P0.C01 establishes the actual starting point. A roadmap item becomes verified only when its implementation and required evidence exist at a recorded revision.

| Area | Documented reference baseline to verify | Planned work |
| --- | --- | --- |
| Bookkeeping | Draft creation, posting, full reversal, integer-cent arithmetic and business/private allocation | Saved-draft editing, conflict handling, imports, reconciliation and period controls |
| Evidence | Receipt validation, private owner-scoped downloads and linked records | Systematic contract archive, recovery, retention and multi-year evidence links |
| Reporting | Provisional income/expense view and CSV output | Reviewed deductions, assets, VAT cases, year history and supported official mappings |
| Verification | Domain checks, isolated SQL tests, reference checks and a browser Test Lab | Unified local runner, checkpoint progress, UI/security/device and recovery checks |
| Platforms | Browser interface and portable local development | Durable installed Windows and Android workflows; optional online sync later |

Full tax preparation, installed offline apps, the local production unlock and the unified progress runner are planned. A provisional income/expense report is not a complete statutory return. The launch commands below follow the documented 0.3.1 reference baseline; checkpoint P0.C01 must confirm the actual source, package scripts and behavior before this repository is described as reproducibly runnable.

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

Add these files to the project checkout. Merge existing project-specific ignore rules and review any existing license or third-party notices before replacing files. The full `.gitignore` supersedes the earlier additions-only checklist; after merging its contents, remove an obsolete `.gitignore.additions` from the checkout if present. Retain genuine Git history and attribution. A documentation ZIP does not replace that history.

## Who it is for

Freelancers and self-employed people who want organized income and expenses, receipt and contract records, a review queue, and a clear sequence of tasks around deadlines. Multiple businesses use the same setup and modules, with separate records and verified legal reporting scope. A brand or business label alone does not establish a separate taxpayer.

Development, demonstrations and AI-assisted work operate only on synthetic businesses, accounts, documents and payments. A later completed local production installation may support genuine records after its release and security gates pass. Genuine records remain outside source control and outside development or AI workspaces.

## Technology and architecture

| Component | Reference technology or planned direction |
| --- | --- |
| Interface | React and TypeScript |
| Web runtime | Vinext with API routes and a Cloudflare Worker |
| Structured storage | Cloudflare D1 and Drizzle migrations in the reference web adapter |
| Evidence storage | R2 in the reference web adapter; protected local files for the planned installed adapter |
| Installed platform candidate | Tauri 2 with local SQLite, subject to Windows/Android feasibility checks |
| Verification | Reference Node test runner and isolated SQLite integration checks; planned unified local suite and Test Lab progress |

Use one modular domain and application core, with adapters for storage, identity, files, notifications and later synchronization. Financial rules stay outside pages and platform APIs. Typed module capabilities supply navigation and reusable business/year contexts. Required ownership, audit, recovery and validation controls cannot be disabled by hiding a module. Avoid duplicating pages for individual businesses.

The reference hosted adapter does not require connecting to live cloud data during development. P0 records the actual adapter and toolchain decisions for this project. Installed offline durability is separate from running a development server on the same machine.

## Run locally

These commands apply to the documented reference application once its source and scripts are present and verified. A documentation-only checkout has no application to launch; complete P0.C01 first.

Use the toolchain pinned by the actual repository. The reference baseline uses **Node.js 24 LTS**, **pnpm 11.25.0** and `pnpm-lock.yaml`. Confirm `package.json`, its scripts and the lockfile before installing or changing versions. From a compatible source checkout:

```sh
pnpm install --frozen-lockfile
npm run typecheck
npm test
npm run build
npm run db:local
npm run dev
```

Open the loopback URL printed by the development server. `db:local` applies the versioned migrations to local emulator state; the synthetic seed is a separate explicit action. Use the application demo action only with its isolated fictional workspace. Do not connect a bank, production database or real document folder.

The portable development profile simulates a local test identity. It is suitable only for the loopback synthetic workspace. It is not the future password-protected production mode, and it must never be exposed as internet authentication. The managed hosted profile uses a gateway identity; deployment elsewhere needs a verified identity adapter.

Local runtime state such as `.wrangler/` and `.sites-runtime/` stays outside source control. Use `.env.example` only as a template if configuration is needed; it contains comments, not live credentials. Check [the security policy](SECURITY.md) before changing access or storage behavior.

## Run the documented reference checks

After P0 confirms the application source and matching package scripts, the reference checks are:

```sh
npm run typecheck
npm test
npm run build
```

For focused checks:

```sh
npm run test:domain
npm run test:integration
npm run test:docs
```

The reference SQL tests use isolated in-memory SQLite and must not connect to hosted records. The reference browser **Test Lab** runs its own registered accounting checks and can export JSON. Verify which of these are actually present in the checkout. Browser results are client-reported; they do not establish that Node, SQL, authorization or device tests executed.

This starter's ignore rules were checked with Git against 138 wholly fictional paths. Documentation checks also verify local links, checkpoint IDs and package contents. These checks do not execute or validate application behavior. No application tests were run as part of this documentation-only revision.

### Planned unified local suite

P1.C08 defines the checkpoint/check manifest, P4.C08 adds progress visibility and P12.C05 delivers the unified runner. The proposed commands `npm run check` and `npm run progress` are not claimed as existing package scripts yet.

The runner must cover applicable type/static checks, exact-money rules, posting and corrections, isolated storage, evidence handling, business separation, interfaces, security and builds. Required offline-device, restore and legal-mapping reviews remain separately recorded evidence. Failures return a nonzero exit status; unimplemented, skipped, blocked and not-run items remain visible.

Each report records the source revision, runtime, platform, command, fixture version, executed test layer, checkpoint IDs, results and limitations. Human-readable output and JSON must agree. Passing executed tests does not mean all roadmap features are complete. A checkpoint is verified only when its own implementation, checks and required review evidence pass.

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

Keep genuine commits, authorship and useful task descriptions. Implement one bounded checkpoint at a time, run checks for the changed behavior, record the result and update the roadmap. Do not fabricate run results, releases, users or deployed functionality. Keep existing attribution and comply with dependency and contribution licenses.

The included [.gitignore](.gitignore) covers environment values, signing keys, local databases and evidence folders, dependency caches, builds, generated test output and optional Android/desktop artifacts. Keep the active lockfile, schema migrations, source, tests and fictional fixtures in Git. [GITIGNORE_SETUP.md](GITIGNORE_SETUP.md) explains reserved root paths and safe setup. Ignore rules do not remove tracked files or past commits, inspect contents, prevent a forced add or encrypt data. Inspect tracked content, history and distributed artifacts as part of repository preparation.

## License

This project is licensed under the **Mozilla Public License 2.0 (MPL-2.0)**. See the complete, unchanged [LICENSE](LICENSE).

MPL 2.0 permits commercial use. Its file-level source-sharing requirements apply when covered software is distributed; it is not a noncommercial license. Preserve existing third-party licenses, copyright notices and attribution, and license only material for which the necessary rights are held.

For JavaScript/TypeScript source files covered by MPL 2.0, add the following notice near the top. Use the appropriate comment syntax for other languages, or the Exhibit A notice from `LICENSE`:

```ts
// SPDX-License-Identifier: MPL-2.0
```

No name or year placeholders need to be filled in within the standard license text. An accurate copyright notice may be added separately. See [Mozilla's application guidance and FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/) for source notices and distribution obligations.
