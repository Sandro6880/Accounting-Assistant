# P0.C01 — repository baseline inspection

Inspected on **31 October 2026**. This record covers P0.C01 only. P0.C02 and
later checkpoints have not been started by this packet.

## Revision and acceptance

- Repository: `https://github.com/Sandro6880/Accounting-Assistant`.
- Inspected revision: `9b7741ccf2d6a6538781c9684d2130a92a99660a` on `main`.
- The initial checkout was clean. Initial core-check source fingerprint:
  `46618ad7ea1b9ee83f65c3ecd9b9b832b70ec7065232c44712d13b97c1a7eb8f`.
- Working branch for this packet: `work/p0-c01-baseline-verification`.
- Objective: establish the actual application, toolchain, runnable scripts,
  capability inventory and observed synthetic workflow at an exact revision.
- Dependency: the 0.1.0 source checkout is present. A new scaffold is unnecessary.
- Acceptance requires repository-specific evidence and reproduced applicable
  checks. The browser workflow is configured but has not executed successfully.
- Status: **Blocked, unverified**. Successful core checks do not substitute for
  the blocked browser journeys.

The inspected SHA identifies the starting source, not a fabricated commit for
this documentation update. This packet changes documentation, P0.C01 evidence
and the English/German display of its blocked status. It does not change money,
posting, storage or security behavior. Later runs record the starting Git SHA
plus dirty state and a new checked-source fingerprint in `outputs/checks.json`.
Generated reports stay ignored; they are not source-controlled completion claims.

## Actual toolchain

| Item | Inspected value | Source |
| --- | --- | --- |
| Application | `offline-accounting-workspace` 0.1.0 | `package.json` |
| Runtime | Node.js 24.22.1; range `>=24.22.1 <25` | `.nvmrc`, `.node-version`, `package.json` |
| Package manager | npm 11.9.0 | `package.json` |
| Dependency lock | `package-lock.json`, installed with `npm ci` | Repository lockfile |
| Interface | React / React DOM 19.3.1 | `package.json` |
| Compiler and builder | TypeScript 7.0.2 / Vite 8.3.5 | `package.json` |
| Browser runner | Playwright 1.62.1 | `package.json` |
| Observed host | Linux x64, Node 24.22.1, npm 11.9.0 | Executed runtime/version commands |

No pnpm lockfile, Vinext/Cloudflare runtime, SQL adapter or backend is present.
No app credentials or environment variables are required. The README previously
described a separate reference stack; this packet replaces those setup claims
with the actual source and scripts.

## Script inventory

| Script | Actual behavior |
| --- | --- |
| `npm run dev` | Vite development server at `127.0.0.1:5173`, strict port |
| `npm run build` | Vite client build to ignored `dist/`, ES2022 target |
| `npm run preview` | Preview the existing build at `127.0.0.1:4173`, strict port |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Node/tsx runner over `tests/*.test.ts`, including JSDOM interactions |
| `npm run test:e2e` | Three Playwright journeys in each of two Chromium projects |
| `npm run check` | Typecheck, Node tests, build and manifest validation; browser not-run |
| `npm run check:all` | The same sequence plus required Playwright journeys |
| `npm run progress` | Current checkpoint counts and freshness of the latest local run |
| `npm run progress:validate` | Validate manifest structure and all roadmap IDs in order |

`db:local`, `test:domain`, `test:integration` and `test:docs` are absent.
The actual scripts, runner and ports were inspected in `package.json`,
`scripts/check.mjs`, `scripts/progress.mjs`, `scripts/progress-lib.mjs`,
`vite.config.ts` and `playwright.config.ts`.

## Implemented capability inventory

| Capability | Inspected behavior and evidence |
| --- | --- |
| Exact amounts | `src/domain/money.ts`: bounded decimal dot/comma strings become bigint cents; ambiguous/overprecise input fails. Formatting retains large-cent precision. Node tests exercise both languages and currencies. |
| Synthetic workspace | `src/demo/fixture.ts`, `src/domain/ledger.ts`: fixed `synthetic-v1` examples; memory construction and writes reject an unknown/production marker. This is an accident guard, not authentication. |
| Business context | `requireBusiness`, `entriesFor`, scoped post/reversal operations, `Businesses.tsx` and `App.tsx`: generic planning-profile creation and selected-business views. Tests reject cross-business writes and create a third fictional business. No separate tax-entity model is established. |
| Draft creation | `createDraft` and `AccountingApplication.addDraft`: validated description, date, kind, currency and positive amount; drafts do not affect posted totals. `Entries.tsx` has a create form; no saved-draft edit command exists. |
| Posting and journal | `postDraft`: revision check for draft posting; balanced debit/credit pair and audit event. A repeated post does not append duplicates. Tests inspect both the original input and resulting state. |
| Full reversal | `reversePosting`: retains the original and appends linked inverse lines; invalid reversal targets/dates fail. Same-date retries are harmless; a conflicting retry date fails. No partial correction support is claimed. |
| In-memory transactions | `MemoryRepository`: cloned/frozen snapshots, synchronous state replacement and append-only posted/journal/audit guards. Tests prove failed changes preserve state. There is no durable transaction or recovery implementation. |
| Provisional overview | `totalsFor` and `Overview.tsx`: only posted entries, scoped by business and currency; unvalued USD is separate and EUR incompleteness is visible. No business/private allocation or tax calculation exists. |
| Language and unsaved forms | `i18n.ts`, `App.tsx`, `Entries.tsx`: translated controls/validation and per-business unsaved create forms. JSDOM tests preserve input through language, business and navigation changes. Language/business selection is not persisted. |
| Test Lab | `browser-checks.ts`, `TestLab.tsx`: nine isolated assertions run on demand, initially not-run. They are also invoked in the Node suite; the Test Lab has no local-results reader or export action. |
| Roadmap/results | `Roadmap.tsx`, `project/checkpoints.json`, progress scripts: 92 stable IDs and explicit states. Runner JSON records real exit codes/freshness; verification is never promoted from test totals. The evidence validator checks structure only. |

Documents/evidence files, financial CSV export, import/reconciliation, installed
offline storage, recovery, identity/encryption, reviewed tax mappings and online
services are not implemented. No separate P0.C02 detailed gap analysis is claimed.

## Fictional fixture and reproduced workflow

Fixture owner: repository development fixture `src/demo/fixture.ts`, version
`synthetic-v1`. It uses Example Consulting (`demo-consulting`) and Example Studio
(`demo-studio`), with VAT explicitly unconfirmed. Its fixed event clock is
`2026-01-15T12:00:00.000Z`; these are invented records, not masked real accounts.

The fixture contains two businesses, five entries (four posted, one draft),
eight journal lines and nine audit events. Example Consulting begins with:

| Currency | Posted income | Posted expense | Net movement |
| --- | --- | --- | --- |
| EUR | 1,200.00 | 79.90 | 1,120.10 |
| USD | 250.00 | 0.00 | 250.00 |

Its EUR 50.00 draft is excluded from totals. Example Studio separately has
EUR 800.00 posted income. USD is never added to EUR.

The existing React/JSDOM journey creates a fictional EUR 10.05 expense,
posts it, observes EUR 1,110.05 net, appends its reversal, retains both rows and
observes EUR 1,120.10 again. Other DOM checks preserve unsaved scope and exercise
the Test Lab, third-business creation and fresh-session reset. These interactions
passed in Node/JSDOM. They do not establish browser layout, native APIs or an
installed Windows/Android workflow.

## Observed execution

| Command or review | Observed result |
| --- | --- |
| `npm ci` | Exit 0; 88 application packages installed from the existing lockfile |
| `npm run check` on the clean inspected revision | Exit 0; typecheck, all 24 Node/DOM tests, build and manifest validation passed; browser correctly not-run |
| `npm run progress` on that revision | Exit 0; 92 IDs, 0 verified, 1 in progress, 91 planned; core report fresh |
| `npx playwright install chromium` | Exit 1; the download produced invalid/truncated ZIP content, including retries |
| Isolated alternative launcher | `@sparticuz/chromium@153.0.0` was installed outside the repository. After extraction/permissions workarounds, `--version` reported Chromium 153.0.8010.0. Its browser version differs from Playwright's requested Chromium 151. |
| `npm run check:all` with the custom launcher | Exit 1; core stages passed but all six browser cases failed before interaction, initially with an executable permission error |
| `npm run test:e2e` after correcting executable permissions | Exit 1; all six cases remained blocked at launch with SIGSEGV. No application assertion was reached or passed. |
| Source review | Inspected domain/application/memory/UI code, fixture, test scenarios, scripts, pins, manifest and relevant documentation. No genuine document/account/credential store was inspected. |

The alternative launcher is an environment-only investigation, not an added
application dependency or supported release browser. No Playwright assertion was
removed, skipped or weakened to turn these failures into a pass. The in-app
domain assertions passing under Node do not repair the missing browser evidence.

The final packet was rechecked after its documentation/status changes. Its
final core results and earlier extended-run blockers are summarized in
[VERIFICATION.md](VERIFICATION.md); `npm run progress` exposes the latest run's
scope and freshness. Checkpoint counts after this packet are **0 verified,
1 blocked and 91 planned** in the JSON output. The existing human CLI summary
lists verified/in-progress/planned counts only; its blocked count is omitted.
The app labels P0.C01 as Blocked in both English and German.

## Remaining evidence and next decision

P0.C01 stays blocked until the configured journeys can run in a working Chromium
environment and their results are reviewed alongside this source inventory.
Use the pinned toolchain, run `npm ci`, install Chromium, then run
`npm run check:all` and `npm run progress -- --json`. Record that checkout's
revision, source freshness and actual results. See [AGENT_HANDOFF.md](AGENT_HANDOFF.md).

No Windows CI result, installed Windows app, native Android device, offline
cold start, persistence/recovery exercise, legal mapping, government submission,
history/privacy audit or release is certified here. P0.C05 and P0.C07 retain
their own future proof requirements. The next checkpoint after P0.C01 is
resolved is **P0.C02**, not saved-draft implementation.

Subsequent continuation: the owner later deferred this verification and
authorized P0.C02's source audit. That decision supersedes the ordering above
without clearing P0.C01's blocker or rewriting its recorded results. See the
current [handoff](AGENT_HANDOFF.md) and [capability audit](CAPABILITY_AUDIT.md).
