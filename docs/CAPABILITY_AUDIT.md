# P0.C02 — planned capability audit

Source inspection dated **31 October 2026**. Scope: compare the actual code with
planned draft editing, evidence, import, reconciliation and export behavior.
This packet supplies the comparison and evidence; feature implementation stays
in its existing roadmap checkpoints.

## Input and continuation decision

- Repository revision: `9b7741ccf2d6a6538781c9684d2130a92a99660a`.
  `origin/main` still matched this revision after `git fetch origin`.
- Input includes the pending P0.C01 delivery. Its local index tree is
  `a717c0979147042deeaddb5b109ee5e0f8fbdfb9` (a tree snapshot, not a commit).
  The checkout has uncommitted changes; no new commit or push is claimed.
- The input's checked-source fingerprint is
  `d7468a6a1cd7d17cdcc9634de6aa734cb90c6a8589202333f0249fd3864508c6`.
- The owner explicitly deferred P0.C01 verification and authorized P0.C02.
  P0.C01's browser blocker and evidence remain unchanged. This decision
  supersedes the earlier handoff instruction to finish P0.C01 before this audit;
  it does not mark the dependency verified.
- P0.C02 status is **In review, unverified**. The source comparison is prepared;
  acceptance/verification is deferred. P0.C03 and later work remain unstarted.

## Classification and inspection method

**Implemented** means a concrete source path exists for the stated bounded
behavior. **Partial** means related mechanisms exist but do not satisfy the
full requirement. **Missing** means the inspected model, application boundary,
adapters and views provide no path for the specified capability. These labels
describe code, separately from checkpoint verification or release status.

The review enumerated `src`, `tests` and `scripts`, followed actual application
imports and inspected the following complete boundaries:

| Boundary | Inspected surface |
| --- | --- |
| Domain | [ledger.ts](../src/domain/ledger.ts): `Entry`, `Workspace`, `DraftInput`, `createDraft`, `postDraft`, `reversePosting`, `totalsFor`; [money.ts](../src/domain/money.ts): exact parsing/formatting |
| Application | [accounting.ts](../src/application/accounting.ts): `AccountingApplication` exposes `addBusiness`, `addDraft`, `post`, `reverse`; `WorkspaceRepository` exposes snapshot, subscription and transaction operations |
| Storage | [memory-repository.ts](../src/infrastructure/memory-repository.ts): one synthetic in-memory adapter, with immutable snapshots and history guards |
| Interface | [modules.ts](../src/app/modules.ts) and [App.tsx](../src/app/App.tsx): Overview, Entries, Businesses, Test Lab and Roadmap; no additional import, document, matching or financial-export view |
| Checks/tooling | [check.mjs](../scripts/check.mjs), [progress.mjs](../scripts/progress.mjs), [TestLab.tsx](../src/features/TestLab.tsx), [browser-checks.ts](../src/verification/browser-checks.ts) |
| Dependency/configuration root | [package.json](../package.json), Vite configuration and the file inventory: a client React/Vite app, with no backend or persistent/file-storage adapter |

Targeted searches for edit/update/revision, receipt/evidence/attachment, CSV,
source identity, reconciliation/allocation/settlement, uploads/downloads, file
and browser-storage APIs helped locate relevant paths. The missing findings
below also rely on inspecting the complete boundaries above. Mentions in
roadmap/security text, JavaScript module imports and verification JSON files
were not treated as implementations of financial features.

## Required capability comparison

| Planned capability | Current classification | Concrete source evidence | Existing roadmap destination |
| --- | --- | --- | --- |
| Saved-draft editing | **Missing** | [Entries](../src/features/Entries.tsx) submits `application.addDraft`; saved rows offer Post or Reverse. [AccountingApplication](../src/application/accounting.ts) has no update operation; the domain has no draft-edit transition or edit audit action. | P1.C03, P4.C01 |
| Document/receipt evidence | **Missing** | [Entry/Workspace](../src/domain/ledger.ts) have no document/evidence references or original-file records; [the repository interface](../src/application/accounting.ts) and [memory adapter](../src/infrastructure/memory-repository.ts) have no file operations. Entries has no attachment control. | P4.C01, P4B.C01–C02, P4B.C06 |
| Financial/statement import | **Missing** | No parser, mapping, preview, batch command or import/source-identity model exists in the domain/application/views. `App` starts from [the compiled fixture](../src/demo/fixture.ts); that fixture and ordinary module imports are not statement ingestion. | P7.C01–C02, P4B.C05 |
| Reconciliation | **Missing** | [JournalLine](../src/domain/ledger.ts) has an internal `bank` account identifier but there are no independent observed bank movements, allocations, matches or releases. Application commands create/post/reverse entries without external settlement links. | P7.C03–C04, P4A.C04–C05 |
| Financial export | **Missing** | [Overview](../src/features/Overview.tsx) renders provisional totals; [Entries](../src/features/Entries.tsx) renders records/journal. Neither has an export action or serializer. [Check/progress JSON](../scripts/check.mjs) contains verification metadata, not a financial journal/evidence pack. | P9.C03–C05, P12.C04 |

Destinations refer to the existing [ROADMAP.md](../ROADMAP.md). They locate later
work and do not make those checkpoints ready or implemented.

## Existing foundations and exact gaps

### Draft editing and conflict handling

| Bounded behavior | Classification | Evidence and limit |
| --- | --- | --- |
| Create a validated fictional draft | Implemented | `createDraft` validates scope, date, positive amount, kind and currency; `addDraft` writes through the repository. A new draft starts at revision 0. |
| Keep unsaved create forms under their original business during language/navigation changes | Implemented | [Entries](../src/features/Entries.tsx) stores forms by business ID; [App](../src/app/App.tsx) retains mounted views. This lasts for the current session; refresh discards it. |
| Revision/conflict mechanism | Partial | `postDraft` rejects a stale revision while posting a draft, and conflicting reversal dates fail. There is no saved-edit command, comparison to a newer edit, recovery UI or retained conflicting edit payload. |
| Edit an existing saved draft without creating a second record | Missing | The application exposes no edit method. `AuditEvent.action` only permits draft-created, posted and reversed. Editing an unsaved create form does not modify a saved entry. |
| Keep posted facts immutable and append corrections | Implemented, bounded | `assertPreservedHistory` and `MemoryRepository.transact` reject changed posted records or rewritten journal/audit prefixes. `reversePosting` appends a full linked reversal; partial corrections remain missing. |

Existing regressions in [domain.test.ts](../tests/domain.test.ts) exercise
draft-excluded totals, stale **posting** revisions, wrong-business post/reversal,
immutable history and failed memory transactions. [interface.test.ts](../tests/interface.test.ts)
exercises create/post/reverse and unsaved form scope. Neither suite tests a
saved-draft edit or edit-conflict recovery because that path does not exist.

### Evidence and original files

| Bounded behavior | Classification | Evidence and limit |
| --- | --- | --- |
| Business scope for existing financial operations | Implemented | `requireEntry` checks the selected business before post/reversal. This supplies no file-owner identity or protected download boundary. |
| Attach an original receipt to a new or saved draft | Missing | No document ID, attachment relation, upload control or attach command exists in [Entry/Workspace](../src/domain/ledger.ts), [application](../src/application/accounting.ts) or Entries. |
| Validate file type/signature/size, retain original bytes and retrieve them privately | Missing | No file adapter or read/download command exists. [SECURITY.md](../SECURITY.md) describes intended controls; it does not implement them. |
| Restore evidence links, detect missing originals and apply retention/holds | Missing | `MemoryRepository` handles a structured session snapshot only; it has no original bytes, archive inventory or restore operation. |

The current suites have no receipt-upload, late-attachment, file-access,
missing-original or restoration scenarios. Financial scope checks cannot be
reported as document-authorization coverage.

### Import and source identities

| Bounded behavior | Classification | Evidence and limit |
| --- | --- | --- |
| Validate individual manual financial inputs | Implemented | [money.ts](../src/domain/money.ts) and `createDraft` reject ambiguous/overprecise money, invalid dates and unsupported currencies. These checks have Node regressions. |
| Parse a documented CSV dialect, preview/map rows and show row errors | Missing | No importer/parser or preview view exists in the inspected source inventory. Entries accepts one manually entered `DraftInput`. |
| Commit an import batch atomically and retry it without duplicate movements | Missing | The synchronous memory transaction is a partial storage foundation; there is no batch-import use case, observed-movement collection or stable statement/row identity. Generated entry IDs and duplicate entry-ID rejection do not establish import idempotency. |
| Import prior years without duplicating opening income | Missing | Workspace has no import/opening-position model, source mapping or reviewed prior-year acceptance path. |

No current test imports a financial file or validates a row mapping, batch
rollback, duplicate statement or prior-year opening position. The static
`synthetic-v1` seed is a fixture, not an import demonstration.

### Reconciliation and original currencies

| Bounded behavior | Classification | Evidence and limit |
| --- | --- | --- |
| Preserve EUR/USD source amounts during the memory session | Implemented | `Entry` stores bigint cents and original currency; `totalsFor` filters by currency. EUR never includes unvalued USD. |
| Provide values needed for complete EUR reporting/settlement | Partial | [Overview](../src/features/Overview.tsx) keeps USD separate and warns of incomplete EUR reporting. There is no rate, valuation snapshot, gross/fee/net settlement or exchange-difference model. |
| Match independent bank movements to posted records | Missing | `JournalLine.account = bank` is generated by posting; it is not an independently imported bank observation. Workspace has no movement or allocation collection. |
| Partial/grouped allocations, release history and overmatching guards | Missing | None of the domain/application commands accepts movement IDs, allocation amounts or match releases. Full reversal corrects a posting but does not release a reconciliation match. |

Existing tests prove separate EUR/USD totals, balanced posting and reversal
conservation. They do not prove financial settlement, reconciliation or that a
bank receipt would avoid duplicate revenue.

### Reporting and export

| Bounded behavior | Classification | Evidence and limit |
| --- | --- | --- |
| Show provisional posted totals and journal lines for a selected business | Implemented | `totalsFor`, [Overview](../src/features/Overview.tsx) and [Entries](../src/features/Entries.tsx); drafts are excluded and reversals reduce the original effect. |
| Financial reporting foundation | Partial | Totals have no selected-year completeness workflow, frozen snapshot, evidence drill-down or reviewed tax-field mapping. The visible figures are provisional, with USD incompleteness explicit. |
| Write local check JSON / print progress JSON | Implemented, tooling only | [check.mjs](../scripts/check.mjs) writes ignored `outputs/checks.json`; [progress.mjs](../scripts/progress.mjs) prints JSON with `--json`. These contain check/checkpoint metadata, not account records or original evidence. |
| Export financial CSV, a consistent review pack, evidence manifest/checksums or a supported official format | Missing | No application export method, serializer, export model or interface download action exists. [TestLab](../src/features/TestLab.tsx) only runs and displays isolated assertions; it has no export button either. |

No current test exercises financial serialization, CSV formula handling,
frozen-export consistency or original-file inclusion. A successful Vite build
or JSON check report provides none of that product evidence.

## Checks, fixture and coverage limits

`npm ci` and the input `npm run check` passed using Node 24.22.1 / npm 11.9.0.
The existing 24 tests passed with no failures or skips; typecheck, build and
manifest validation also passed. `npm run progress -- --json` was run separately
and reported fresh input core evidence.

Final packet checks after the metadata/test-fixture update:

| Check | Observed result |
| --- | --- |
| `npm run check` | Exit 0: typecheck, all 24 Node/DOM tests (0 failures/skips), build and all 92 manifest IDs passed |
| `npm run progress -- --json` | Exit 0: fresh core evidence; one blocked, one in-review and 90 planned; no verified checkpoint |
| Scope comparison against the input tree | Only P0.C02's checkpoint record changes; P0.C01 and the other 90 records and all 92 IDs are preserved. Financial domain/application/adapter/view code, accounting/browser regressions, scripts, dependency lockfile and license are unchanged. |
| Rendered-markup smoke check | Actual Roadmap rendering has P0.C01 Blocked, P0.C02 In review and 90 Planned labels in both English and German; this is Node rendering/JSDOM inspection, not native-browser evidence |
| Documentation links and diff review | Relative file links resolve; `git diff --check` passes |

The final core run records the starting Git SHA with `gitDirty: true` and
checked-source fingerprint
`7697b4c1939f2b6dfdd34f318f6995c9a28520a3d17e37bade1626489a59fb47`.
Its browser stage remains not-run. The fingerprint covers the runner's configured
code/manifest inputs; it does not verify this document or the truth of the audit.
The input snapshot and final metadata run are distinct evidence. Generated
reports remain ignored, and source review/acceptance remains a separate step.

All executed accounting scenarios use the repository's wholly fictional
`synthetic-v1` fixture, including the EUR 10.05 expense and separate EUR/USD
amounts. No genuine financial file, bank account, document folder or credentials
were accessed. New placeholder tests for absent features were not added.

The progress regression now explicitly clears evidence on its copied negative
fixture before requesting Verified status. P0.C02 now has real pending-review
evidence, so assuming that record was empty no longer exercised the stated
missing-evidence case. The validator and its rejection requirement are unchanged;
accounting and browser journey tests are unchanged.

[Playwright's three scenarios](../tests/e2e/workflow.spec.ts) cover creation/post/reversal,
unsaved scope switches and Test Lab/session reset, configured for desktop and
Pixel 7 emulation. They contain none of the missing feature journeys above.
Native-browser/device verification was deferred at the owner's request; it was
not rerun or counted as passed in this packet. P0.C01's recorded launch blocker
remains visible. DOM success does not certify layout or installed devices.

## Review outcome and next checkpoint

The required comparison is prepared with a classification and source evidence
for each of the five planned capabilities. P0.C02 remains **In review** until
its acceptance review is completed; no checkpoint is promoted by test counts.
The implementation of accounting rules, forms, storage, imports, files and
financial exports is unchanged. This packet changes documentation, P0.C02
evidence, the translated roadmap status/banner and the progress test fixture
described above.

The next roadmap checkpoint is **P0.C03**: fictional business profiles and a
Windows/Android test matrix. It has not been started. Its eventual continuation
does not silently clear P0.C01's pending browser verification or P0.C02 review.
