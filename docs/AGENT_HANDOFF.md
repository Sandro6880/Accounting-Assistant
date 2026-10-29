# Agent handoff

The current runtime is React/TypeScript/Vite with synthetic memory storage.
Read root AGENTS.md, README.md, ROADMAP.md, SECURITY.md and
[ARCHITECTURE.md](ARCHITECTURE.md).

## Reproduce first

1. Inspect package.json, the lockfile and Node pins.
2. Run npm ci, npm run check and npm run progress.
3. Install Chromium and run npm run check:all where available. Report blocked
   steps accurately.
4. Inspect the actual revision and capabilities. P0.C01 stays in progress until
   its repository-specific evidence is recorded and reviewed.
5. Take one bounded packet with explicit acceptance checks.

## Suggested next packet: saved-draft editing

As a slice of P1.C03/P4.C01, introduce a revision-checked edit use case for
drafts belonging to the selected business. Reject stale edits without losing
input. Keep posted facts and journal lines immutable. Preserve separate unsaved
forms across business/language changes. Add exact-money, stale-edit,
wrong-business and posted-edit regressions and a meaningful browser journey.
Do not mark the entire multi-part checkpoints verified from this packet alone.

## Copyable task

> Read AGENTS.md and the linked project docs. Reproduce the starter with npm ci,
> npm run check and npm run progress; run browser journeys when available.
> Implement only the saved-draft editing packet in docs/AGENT_HANDOFF.md using
> wholly fictional data. Keep rules out of React, business scope explicit,
> exact bigint cents and posted facts immutable. Demonstrate stale-revision
> recovery and preserve unsaved form scope. Run meaningful regressions and
> report actual commands, results and gaps. Preserve stable roadmap IDs and do
> not claim full checkpoint completion.

Durable Windows/Android operation, evidence archives, valuations, tax rules and
online services are future roadmap work, not implicit scope for this packet.
