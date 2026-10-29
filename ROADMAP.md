# Development roadmap

This roadmap expands the product direction in [README.md](README.md). It contains 17 phases and 92 checkpoints. Each checkpoint is initially **Planned and unverified** until inspected source and evidence justify a later state. Capabilities described in the reference baseline are not implementation claims for this checkout and do not automatically prove any acceptance condition.

## Execution rules

Choose the next checkpoint whose dependencies are ready. Split work into roughly two-to-six-hour packets where feasible, implement a bounded change, run meaningful checks or a discovery demonstration, record evidence and review the result. Adapt the next packet or revise scope when the result warrants it. Preserve existing IDs; add suffixes for smaller units.

Use Planned, Ready, In progress, Blocked, In review, Verified and Released. A completion record identifies objective, revision, dependencies, changed behavior, synthetic fixture, executed checks, manual evidence, known limits and the next decision. Passing tests and product completion are separate measures. Required checks that have not run remain visible.

All work, including future identity and hosted prototypes, uses fictional records. Genuine-record processing is outside AI-assisted development. No earlier prototype is approved for real use. Any later completed local production installation needs explicit accepted-scope, security and recovery evidence; testing stays synthetic forever.

## Repository decisions

- The selected license is **MPL-2.0**, with the complete standard text in [LICENSE](LICENSE). It permits commercial use. Verify rights, attribution and source notices for code and dependencies; do not add a noncommercial condition to the standard license.
- The full [.gitignore](.gitignore) replaces the additions-only starter. Merge project-specific rules, keep the active lockfile and schema migrations, and follow [GITIGNORE_SETUP.md](GITIGNORE_SETUP.md). Keep real records and credentials out of tracked content and history.
- The supplied starter contains documentation and configuration. P0.C01 must inspect the actual checkout or establish a minimal runnable foundation when application code is absent. The reference commands do not establish that this checkout is runnable.
- License text, documentation and ignore-file checks do not complete P0.C07 or certify the repository's history. No checkpoint is marked verified by this refresh.

## Dependencies and provisional effort

The ranges below are provisional engineering estimates for the bounded scopes, including focused checks and documentation. They are not a calendar, billing target or evidence of completed work. Re-estimate after source inspection; reuse existing verified behavior. External professional review, waiting and contingency are excluded.

| Phase | Depends on | Estimate |
| --- | --- | --- |
| P0 | Available source or initial scaffold, and owner decisions | 12–24 h |
| P1 | P0 | 44–80 h |
| P2 | P1 | 24–40 h |
| P3 | P2 | 32–60 h |
| P4 | P1–P3 | 56–104 h |
| P4A | P1, P3 and P4 workflows | 32–64 h |
| P4B | P3, P4 and evidence contracts | 40–72 h |
| P5 | P2–P4B and actual Android device | 24–48 h |
| P6 | P3–P5 and verified profile inputs | 40–72 h |
| P6A | P4, P6, verified profile and transaction examples | 64–120 h |
| P7 | P4A, P4B, P6 and P6A classification contract | 48–88 h |
| P8 | P4, P6A, legal profile and actual sales channels | 40–80 h |
| P8A | P4A, P4B, P6A and verified accounting profile | 48–88 h |
| P9 | P7, P8, P8A and supported policy and schema | 80–144 h |
| P10 | P3, P5 and stable command contracts | 48–88 h |
| P11 | P10 and actual role requirements | 32–64 h |
| P12 | Relevant release phases | 40–76 h |

## Checkpoints

### P0 Verify the project starting point and repository

- [ ] **P0.C01** Inspect the authoritative project revision, package scripts and actual implemented behavior. If application code is absent, establish a minimal runnable scaffold and initial domain checks rather than claiming the reference baseline exists. Otherwise reproduce the applicable reference workflow with fictional data. Proof: exact revision, pinned toolchain, actual scripts, capability inventory and observed results recorded.
- [ ] **P0.C02** Compare actual code with planned draft editing, evidence, import, reconciliation and export behavior. Proof: each capability is implemented, partial or missing with source evidence.
- [ ] **P0.C03** Define fictional sole-trader, planning and third-business profiles, EUR reporting and EUR/USD examples. Record the Windows/Android test matrix and bounded phone workflow. Proof: no personal business setup or real account data is needed.
- [ ] **P0.C04** Define the supported Austrian accounting method and synthetic VAT cases, including unknown status. Cover domestic, EU business, direct EU consumer digital and non-EU cases; select the first report/year adapter. Proof: a versioned case inventory states support and exclusions.
- [ ] **P0.C05** Run the Windows/Android platform spike for local save, camera, restart, transfer and notifications. Proof: measured behavior and limitations recorded on supported devices.
- [ ] **P0.C06** Record accepted architecture decisions and the next bounded backlog. Proof: dependencies and first ready work packets are explicit.
- [ ] **P0.C07** Review actual tracked content, genuine history, contributor identity, MPL-2.0 scope and source notices, third-party rights and source/artifact privacy. Confirm the standard LICENSE is present and unchanged. Proof: inspected revision, refs, artifacts, rights questions and unresolved items are recorded; a documentation package cannot mark history clean.

### P1 Separate portable rules and business ownership

- [ ] **P1.C01** Introduce generic business, legal entity, tax reporting scope, activity, project and personal-income concepts. Seed only fictional profiles. Proof: a third business works without code changes, original totals survive migration and cross-business references are rejected.
- [ ] **P1.C02** Establish accounting rules and workflow contracts in the portable core, extracting them from existing adapters where applicable. Proof: the same domain scenarios run without hosted dependencies.
- [ ] **P1.C03** Add revisions, idempotent commands and storage contract tests. Proof: retry, stale edit and failed transaction leave valid state.
- [ ] **P1.C04** Define financial dates, correction dates and import identities once. Proof: date and source-identity fixtures pass.
- [ ] **P1.C05** Establish stable translation keys and canonical domain identifiers so a language switch cannot change stored categories, currencies or commands. Proof: language change preserves canonical stored identifiers.
- [ ] **P1.C06** Define the small typed module registry, dependency rules, routes, commands and report contributions. Keep the required accounting and security foundation mandatory. Proof: registry rejects missing dependencies and retains mandatory controls.
- [ ] **P1.C07** Implement generic business creation and archival contracts, unknown setup states and effective-dated profile changes. No new business requires a new source-code branch. Proof: creation and archive commands preserve identities and history.
- [ ] **P1.C08** Define a versioned manifest mapping stable checkpoints to meaningful checks and manual evidence. Separate implemented, executed, verified and released states; declare synthetic fixture ownership and workspace requirements. Proof: a missing or skipped required check leaves its checkpoint unverified even if all executed tests pass.

### P2 Deliver the Windows offline foundation

- [ ] **P2.C01** Package the interface, local database and receipt storage in an installed application. Proof: installed package opens with its local records offline.
- [ ] **P2.C02** Implement atomic local commands, schema upgrades and durable error reporting. Proof: interrupted writes and upgrades have no partial financial result.
- [ ] **P2.C03** Add local profile access, lock state and explicit network-dependent actions. Proof: unlock and local editing work without cloud credentials.
- [ ] **P2.C04** Verify offline cold start, restart after save, interrupted write and low-disk behavior. Proof: restart and low-disk results distinguish failed and saved work.

### P3 Make records recoverable and access controlled

- [ ] **P3.C01** Produce a consistent encrypted backup of structured records, original files, inventories and policy versions. Proof: backup inventory includes records originals and policy versions.
- [ ] **P3.C02** Restore into a separate location and verify counts, hashes, totals and representative evidence. Proof: clean restore reproduces totals and original file digests.
- [ ] **P3.C03** Implement protected key storage, chosen at-rest encryption, local lock and recovery instructions. Proof: wrong-key and recovery paths exercised.
- [ ] **P3.C04** Add pre-migration backups, failed-update recovery and independent backup targets. Proof: failed update recovers using an independent backup.
- [ ] **P3.C05** Implement isolated synthetic workspaces and prototype the future local unlock, timeout, recovery and sensitive-action verification. Keep genuine-record use unavailable in development. Proof: wrong credentials, locked commands, direct evidence access and unsafe reset destinations fail using fictional records.

### P4 Complete the daily workflow and progress view

- [ ] **P4.C01** Deliver saved-draft editing, stale-revision conflict handling and evidence links, including attaching a sample receipt after creating a draft. Proof: saved edit conflict and late receipt paths demonstrated.
- [ ] **P4.C02** Add time records, expected earnings, statements and actual payout tracking with separate statuses. Proof: expected work and actual receipts remain distinct.
- [ ] **P4.C03** Add manual salary overview and evidence without merging it into business revenue. Proof: salary fixture leaves business revenue unchanged.
- [ ] **P4.C04** Add dashboard review queues, accessible forms and explainable validation in English and German. Proof: review and validation work by keyboard in both languages.
- [ ] **P4.C05** Implement an offline language toggle, persisted device preference, translated labels and validation, locale-aware EUR/USD input and the persistent business selector. Verify that switching language or business preserves unsaved forms and their original scope. Proof: offline switches preserve parsed money and draft business.
- [ ] **P4.C06** Deliver the progressive Create business wizard, save-and-resume, planning mode, unresolved setup summary and archive action. Proof: new synthetic business saved resumed and archived without code changes.
- [ ] **P4.C07** Build shared context selectors and module-driven navigation with dependency messages and preserved read-only access to disabled modules' history. Proof: optional module toggle retains history and rejects missing prerequisites.
- [ ] **P4.C08** Extend the accounting Test Lab with local check results and checkpoint progress, including revision, fixture version, layer, pass, fail, skipped, blocked and not-run states. Protect dummy reset and keep the browser runner distinct from Node, database and device evidence. Proof: seeded result examples cannot count as a real run, and an unimplemented or manually unreviewed capability cannot appear verified.

### P4A Add the EUR and USD foundation

- [ ] **P4A.C01** Preserve exact original EUR and USD amounts and their business context. Introduce reviewed EUR valuations without losing statement values. Proof: original currency and EUR valuation survive save and restore.
- [ ] **P4A.C02** Implement positive decimal rates, explicit quote direction, relevant valuation date, source evidence, purpose, rounding policy and immutable calculation snapshots. Proof: direct and reciprocal quote fixtures give exact results.
- [ ] **P4A.C03** Support evidenced offline manual or imported rates. Missing or inapplicable rates create tasks and prevent a false complete result; later rate updates do not rewrite posted values. Proof: missing rate blocks completion and refresh preserves history.
- [ ] **P4A.C04** Reconcile original gross amounts, fees, net payouts, bank conversions and explained residuals. Apply the selected accounting method to any exchange difference. Proof: gross fees net and bank receipt conserve amounts.
- [ ] **P4A.C05** Cover partial settlements, refunds, reversals and actual USD accounts where used. Keep VAT or OSS valuation rules separate from bank settlement and forecasts. Proof: partial refund and scheme-specific valuation fixtures pass.

### P4B Organize documents contracts and financial years

- [ ] **P4B.C01** Implement document types, indexed metadata, unassigned inbox and private original-file storage with stable references. Proof: inbox original and metadata survive restart.
- [ ] **P4B.C02** Provide business and year filing views, metadata search, original viewing and safe derivative handling. Proof: offline search finds the correct original without cross-business leakage.
- [ ] **P4B.C03** Add contract versions, signed and draft status, amendments, multi-year links and entered renewal, notice and payment dates. Proof: two-year contract and amendment retain one original per version.
- [ ] **P4B.C04** Deliver the previous-years browser with completeness, open or closed state, record totals and drill-down to entries and proof. Integrate later deduction and closing outputs when P8A and P9 pass. Proof: year total drills to source entries and evidence with incomplete flags.
- [ ] **P4B.C05** Add reviewed prior-year imports and opening-position mapping, preserving original dates and flagging incomplete history. Test without inventing missing records. Proof: prior-year import preserves dates and avoids duplicate opening income.
- [ ] **P4B.C06** Verify retention or hold inheritance, missing-file detection, portable evidence manifests and full archive restoration. Hand contract dates to the P6 obligation interface. Proof: restored archive reproduces links holds and the evidence manifest.

### P5 Add offline Android capture

- [ ] **P5.C01** Implement durable EUR/USD captures, business selection and original-file retention on the actual Android device, with both interface languages available offline. Proof: offline capture and restart preserve original and business.
- [ ] **P5.C02** Pair devices and export authenticated encrypted capture packages. Proof: untrusted transfer or wrong pairing rejected.
- [ ] **P5.C03** Preview and accept imports; return acknowledgements and keep unresolved captures visible. Proof: import retry creates one draft and acknowledgement is visible.
- [ ] **P5.C04** Test duplicate packages, interrupted transfer, Android restart, revoked pairing, missing attachments and the installed package's supported-version behavior. Proof: interruption missing file and revocation paths preserve recoverable captures.

### P6 Add Austrian timelines reminders and help

- [ ] **P6.C01** Implement source-backed obligation definitions, explicit applicability and proof-based completion. Proof: applicable and inapplicable obligations retain decision proof.
- [ ] **P6.C02** Add scheduling, permission checks, quiet hours, snooze and a test reminder. Proof: permission denial snooze and quiet hours have usable outcomes.
- [ ] **P6.C03** Build weekly review, setup checklist, offline help and adviser questions in English and German, including localized notification text. Proof: offline help and notifications render in both languages.
- [ ] **P6.C04** Verify closed-app support where available, reboot recovery, overdue catch-up and calendar export. Proof: tested platform behavior and overdue fallback recorded.
- [ ] **P6.C05** Generate chronological bullet timelines from the verified Austrian profile, separating statutory dates, internal milestones, extensions and payment obligations. Proof: statutory target and extension dates remain distinguishable.
- [ ] **P6.C06** Add applicable tax-calendar rules, notice-derived due dates and tested EU-related applicability branches. Proof: notice and EU applicability fixtures generate the correct tasks.

### P6A Validate international transaction cases

- [ ] **P6A.C01** Build a versioned fictional case inventory for intended goods, services, countries, customer types and platform contracts. Proof: all selected transaction categories have synthetic examples and explicit exclusions.
- [ ] **P6A.C02** Implement effective-dated VAT profiles and explicit unknown status. Keep domestic exemption, regular VAT, UID, OSS and cross-border EX scheme facts separate. Proof: unknown VAT cannot become a presumed exemption.
- [ ] **P6A.C03** Validate the applicable service, goods and digital-sale branches, including business or consumer evidence, direction, relevant establishments and exceptions. Proof: approved supply and customer-status cases pass.
- [ ] **P6A.C04** Implement the required reverse-charge and deduction distinctions, ZM applicability, digital-sale location evidence, scheme scope and country or rate summaries. Proof: reverse charge ZM deduction and scheme fields reconcile.
- [ ] **P6A.C05** Record supplier or platform responsibility, fees, refunds and settlement links. Add the required OSS retention and scheme-specific deadline rules. Proof: platform gross-to-net and retention cases pass.
- [ ] **P6A.C06** Create synthetic examples for each approved initial case and have the tax mapping reviewed before enabling tax-final output. Store the rule version, effective interval and evidence needed for each decision. Proof: reviewed mapping and rule versions attached to enabled cases.

### P7 Import and reconcile synthetic statements

- [ ] **P7.C01** Deliver safe statement import using a documented CSV dialect, limits, preview, mapping and row errors. Proof: invalid CSV rows preview clearly and batch commit is atomic.
- [ ] **P7.C02** Store bank movements independently from posted entries; preserve stable source identifiers. Proof: repeat statement import creates no duplicate observed movement.
- [ ] **P7.C03** Deliver reconciliation with explicit allocation, partial and grouped matches, match-release history and overmatching guards. Proof: partial grouped and released allocations reject overmatching.
- [ ] **P7.C04** Support fictional EUR/USD statements with gross, fee and net amounts, purpose-specific valuation and synthetic settlement. Proof: reconciliation preserves original currencies, rejects unsupported ones and creates no duplicate revenue.

### P8 Issue and track supported invoices

- [ ] **P8.C01** Confirm the required domestic, EU business, direct EU consumer digital-sale and non-EU invoice or credit cases against the P6A inventory and current official sources. Proof: approved invoice and credit inventory linked to P6A cases.
- [ ] **P8.C02** Implement editable drafts, final immutable snapshots, scoped number series and issue dates. Proof: issued snapshots survive changed client details without duplicate numbers.
- [ ] **P8.C03** Add corrections, credit documents, payment terms and linked receipts of money. Proof: credit and receipt links conserve the original document amounts.
- [ ] **P8.C04** Define a single issuing device initially; show delivery separately from issuance and payment. Proof: single-issuer guard and separate delivery/payment statuses demonstrated.

### P8A Review deductions and manage assets

- [ ] **P8A.C01** Define the actual initial deduction and asset case inventory with current sources, exclusions, timing and required proof for the verified accounting and VAT profile. Proof: case inventory specifies year profile exclusions and source.
- [ ] **P8A.C02** Add the reviewed deduction decision record: business purpose, source amount, allocation, permitted treatment, year, reason, evidence and rule version. Proof: each decision retains business share reason and original proof.
- [ ] **P8A.C03** Implement the asset register, reviewed cost basis, first-use date, useful life, method and required GWG or AfA cases using effective-dated rules. Proof: reviewed asset basis and selected-year GWG/AfA fixtures pass.
- [ ] **P8A.C04** Add annual schedules, opening assets, prior depreciation and carry-forward; preview effects and prevent double deduction of purchase and depreciation. Proof: opening and annual schedules conserve basis without double deduction.
- [ ] **P8A.C05** Support reviewed corrections and the disposal cases in the first-use inventory. Keep unsupported asset classes and allowances explicitly unavailable. Proof: disposal and correction history reconcile and unsupported cases stay blocked.
- [ ] **P8A.C06** Connect the deduction and asset results to journal reports, year history, original proof and the P9 annual-preparation contract. Validate synthetic cases before tax-final output. Proof: report figure drills to the retained schedule evidence and rule version.

### P9 Prepare annual outputs and closing

- [ ] **P9.C01** Integrate P8A deductions, asset roll-forward and the P4B year archive into the annual completeness and reporting workflow; reconcile opening, movement and closing positions for the supported method. Proof: opening movements closing and annual deduction totals reconcile.
- [ ] **P9.C02** Enforce period-close and correction policies across all command paths. Proof: all write paths reject an invalid closed-period change.
- [ ] **P9.C03** Deliver a consistent frozen review export with the journal, records, evidence map, checksums and open issues. Proof: frozen review pack matches journal and evidence inventory.
- [ ] **P9.C04** Deliver a bounded official-format slice: select the applicable Austrian form/year, map reviewed accounting fields, generate its supported structure and validate a frozen preparation snapshot. Include relevant salary and personal inputs when needed rather than assuming business profit is the whole return. Proof: selected form/year passes mapping and readiness checks.
- [ ] **P9.C05** Prepare applicable UVA, ZM, OSS and cross-border small-business reports through separately reviewed field mappings, legal tax-scope memberships and purpose-specific EUR valuations. Reconcile each to its own period and source records; do not reuse E/A timing or bank rates blindly for every scheme. Proof: each applicable scheme reconciles to its own scope period and valuation.
- [ ] **P9.C06** Track schema availability, external validation and authority protocol requirements as explicit states. Show the capability separately for each document: review pack, portal-entry pack, validated upload file or supported direct transmission. Keep automatic generation separate from transmission and settlement. Proof: prepared sent accepted and paid states remain independently evidenced.

### P10 Introduce optional online backup and synchronization

- [ ] **P10.C01** Decide hosting ownership, identity, encryption model and operating budget before service activation. Proof: hosting identity encryption and cost decision recorded before activation.
- [ ] **P10.C02** Implement authenticated device enrollment, durable outbox, command acknowledgements and immutable file transfer. Proof: lost acknowledgement and duplicate delivery preserve one result.
- [ ] **P10.C03** Add replay protection, conflict resolution, ownership checks and a complete local resynchronization procedure. Proof: revoked or wrong-owner commands fail without losing local evidence.
- [ ] **P10.C04** Test days offline, lost responses, expired sessions, revoked devices, clock skew and incompatible versions. Proof: offline resync and incompatible-version outcomes are recoverable.

### P11 Expand to team collaboration

- [ ] **P11.C01** Define actual roles such as owner, contributor, reviewer and read-only adviser. Proof: role matrix tied to actual team tasks.
- [ ] **P11.C02** Enforce permission checks server-side for records, evidence, exports and administrative actions. Proof: cross-workspace record file and export access is denied.
- [ ] **P11.C03** Add invitations, revocation, device management and auditable changes to access. Proof: revoked invitation and device access fail and leave an audit trail.
- [ ] **P11.C04** Configure operational monitoring, recovery exercises, support and appropriate legal/privacy material. Proof: restore incident and support procedures rehearsed.

### P12 Maintain test and retire the application safely

- [ ] **P12.C01** Run the applicable release checks on supported Windows and Android versions in both interface languages. Proof: applicable Windows Android and bilingual release evidence recorded.
- [ ] **P12.C02** Deliver user help, a recovery guide, supported-version policy and signed installation/update packages. Proof: signed package and recovery guide exercised on clean installation.
- [ ] **P12.C03** Schedule dependency, source-rule and recovery reviews as product operations. Proof: maintenance owner and review intervals recorded.
- [ ] **P12.C04** Provide a read-only archive, open export formats, verified migration and reviewed deletion on retirement. Proof: read-only retrieval and open export survive service retirement.
- [ ] **P12.C05** Deliver the documented one-command local runner, JSON results, checkpoint progress and synthetic-data safeguards on a clean checkout. Proof: required failures return nonzero, unexecuted evidence stays visible and production paths are rejected. Later genuine-record use additionally requires accepted completion and security/recovery evidence.

## Completion and future scope

A phase is complete when its checkpoints and applicable cross-cutting gates are verified at a recorded revision. P9 government-ready output additionally needs the supported profile, form/year mapping, complete records and required external validation. Preparing, sending, receiving acceptance and paying are distinct states. Local app security and successful recovery are prerequisites for eventual genuine-record use.

Full company accounts, payroll, broader asset classes, more currencies, direct official transmission, bank connections, payment execution and a public paid service require separate reviewed scope. Introduce a required extension into the release dependencies if the supported profile needs it. Do not manufacture a balance sheet from incomplete records or treat a green unit suite as legal certification.
