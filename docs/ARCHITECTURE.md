# Architecture decisions — 0.1.0

## ADR-001: React/TypeScript/Vite for a runnable first foundation

Use pinned npm dependencies and loopback-only dev/preview servers, with no
backend or credentials. This version replaces the earlier documentation's
reference-only Vinext/Cloudflare commands. Future hosted adapters remain open
roadmap decisions. Installed Tauri/SQLite remains a candidate pending the
Windows/Android spike. No service worker or durable offline app is implemented.

## ADR-002: domain, application and adapter boundaries

Domain functions own exact money, validation, business scope and transitions.
Application use cases depend on WorkspaceRepository. MemoryRepository provides
immutable snapshots, subscriptions and atomic synchronous state replacement.
The domain history guard also rejects replacing posted facts or rewriting
existing journal/audit prefixes through the repository boundary.
React uses the application boundary for writes. Businesses are records and
navigation is a typed registry, not a plugin marketplace or permission system.

A persistent adapter needs transactions, validation and recovery. The current
synchronous interface is not a promise that network synchronization can be
substituted without reviewing async/failure semantics.

## ADR-003: exact cents and separate currencies

Parse bounded decimal strings into bigint cents, accepting a dot or comma and
up to two decimal places. Thousands separators and exponent notation fail.
Calculations never use floating point; display uses Intl parts and bigint
grouping. Positive amounts plus entry/reversal direction define the effect.
EUR and USD balance separately. Unvalued USD makes EUR reporting incomplete.
The bank/income/expense accounts are software identifiers, not a tax chart.

## ADR-004: drafts, posting and appended reversals

Drafts do not affect totals. Posting changes their snapshot and adds a balanced
pair and audit event together. A post retry adds nothing. A full reversal adds
a new linked record and inverse lines, retaining the original. A reversal retry
for the same date adds nothing; a conflicting date is rejected. A draft or
reversal cannot itself be reversed. The UI uses today's UTC reversal date.

Draft editing, complete command/payload replay, closed periods, partial credits
and legally reviewed correction dates remain roadmap work.

## ADR-005: synthetic session memory

The adapter and writes require the known synthetic marker/fixture version.
Refresh resets records. Nothing is written to localStorage, sessionStorage,
IndexedDB, files or a cloud service. No real-record activation, local password
lock or encryption is provided. The marker prevents accidents; a person with
developer tools controls this demo. It is not an authentication boundary.

## ADR-006: truthful checks and checkpoint progress

The runner records real exit codes, not-run commands, runtime, Git revision
when available and a checked-source fingerprint. Edits during a run make it
stale. Progress never automatically promotes a checkpoint. The manifest matches
all 92 roadmap IDs and requires evidence fields for verified/released states.
It cannot prove manual evidence truthful or replace legal review.

The browser Test Lab executes nine isolated assertions, separately from Node
and browser journey evidence. DOM interaction tests exercise real React
handlers without claiming browser layout or installed-device coverage. Native
installed-device checks are future work.

## P0.C05 experiment — pending device evidence

The [isolated Tauri probe](../spikes/p0-c05/) has its own identity and scoped
synthetic app-local folder. Exclusive capture files and verified readback do not
implement transactional financial storage, fsync, recovery, encryption or a
repository adapter. Raw transport has no pairing/authentication/encryption.
The probe measures WebView camera paths and native notification requests;
desktop scheduling is explicitly unsupported by this plugin. Native builds and
actual device measurements remain blocked here. See [PLATFORM_SPIKE.md](PLATFORM_SPIKE.md).
This is an experiment, not P0.C06 architecture acceptance. P2/P3/P5/P6 retain
their own production durability, recovery, capture and reminder requirements.

## P0.C06 accepted planning directions — download reissue

The machine-readable [architecture plan](../project/architecture-plan.json) is
`p0-c06-download-reissue-v3`, based on checkpoint 5. The former combined archive
is unavailable; this replacement preserves its twelve ADR IDs and seven bounded
backlog IDs, but is not a byte-identical recovery. P0.C06 is **In review**.
Earlier browser/native acceptance is still missing. These are design directions,
not new runtime adapters or owner/legal/device sign-off.

### ADR-007: Separate business, legal entity and reporting scope

Business owns financial/evidence records; a label does not prove a separate taxpayer.

Model legal entity, effective reporting-scope membership, activity, project and personal income separately. Relationships carry explicit business scope and reject cross-business references.

Allow unknown setup facts. Preserve existing IDs and exact totals through synthetic schema migration; no new business-specific code branch.

### ADR-008: Explicit asynchronous transactional command contract

Before persistent adapters, define async results, failure/recovery semantics and one atomic commit boundary.

Scope command identity by workspace/business. Same ID and canonical payload returns stored result; changed payload fails.

Check ownership and revision inside the transaction. Commit financial state, journal, audit and command receipt atomically; publish/acknowledge only after success.

Use lossless cents codecs with explicit storage range validation; never pass money through floating point.

### ADR-009: Immutable originals and recoverable file linking

Retain original bytes, digest, business ownership and provenance; derived previews are distinct.

Stage files with recoverable metadata and defined orphan handling; a database transaction cannot silently make filesystem changes atomic.

Failed operations retain a recoverable state. Prove consistent backup and separate-location restore before genuine financial use; no silent original deletion.

### ADR-010: Canonical identifiers and versioned financial context

Separate canonical IDs from English/German labels. Financial dates differ from audit timestamps.

Version profiles, rules, FX valuations and report snapshots; retain the versions used for posted outputs.

Unknown required facts and unvalued currencies block complete official output; the selected E1a/2026 target remains disabled/unverified.

### ADR-011: Conditional platform candidates

Tauri/SQLite, native file/camera/notification adapters, cryptography and future hosted providers need their own reviewed decisions and evidence.

P0.C05 is blocked: no accepted native build/device list. Readback is not fsync, encryption, a financial transaction or recovery proof.

Notification requests are not delivery; desktop scheduling is unsupported by the probe plugin. Raw transfer is not authenticated pairing or accounting import.

### ADR-012: Bounded packets and explicit acceptance gates

Use existing roadmap IDs, one new checkpoint per continuation. Keep implementation, execution, review and release distinct.

Owner-authorized bounded continuation may defer an earlier review without verifying it. Phase entry still needs acceptance or a recorded scope exception.

Re-estimate each packet after evidence. No P1 implementation, production adapter or real-data activation is authorized by this replacement archive.

See [NEXT_WORK.md](NEXT_WORK.md) for dependencies, assumptions and bounded estimates.
