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
