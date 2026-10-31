# Agent handoff

Work on **one checkpoint at a time**, using the repository roadmap. Read root
AGENTS.md, README.md, ROADMAP.md, SECURITY.md and
[ARCHITECTURE.md](ARCHITECTURE.md).

## Current checkpoint: P0.C02, in review

The [capability audit](CAPABILITY_AUDIT.md) compares the actual model, application,
storage, views, tooling and test coverage with all five requested areas. Each
finding is Implemented, Partial or Missing with concrete source evidence.
The comparison is prepared; acceptance/verification is deferred, so P0.C02 is
In review rather than Verified. No missing product feature was implemented by
this audit. The current core suite still has 24 tests.

The inspected Git revision is `9b7741ccf2d6a6538781c9684d2130a92a99660a`, with
pending P0.C01 changes. The input tree/fingerprint and actual commands are
recorded in the audit and manifest; these are not claims of a new commit/push.

## Deferred evidence and continuation

The owner explicitly deferred verification and requested the next checkpoint.
That authorization supersedes the previous instruction to resolve P0.C01
before the source audit. P0.C01 remains Blocked/unverified with its original
evidence unchanged. See [BASELINE.md](BASELINE.md) and
[VERIFICATION.md](VERIFICATION.md) for the browser installation/launch blocker.
The earlier saved-draft implementation suggestion remains deferred until its
roadmap dependencies are ready.

When verification resumes, review P0.C02's classifications against its source
snapshot. Resolve P0.C01's browser evidence on a working Chromium host using
`npx playwright install chromium` and `npm run check:all`; record actual results
and freshness. Neither passing core tests nor continuing another source packet
automatically verifies those checkpoints. Do not rerun blocked browser setup
as part of unrelated source-only work when its verification remains deferred.

## Next separate checkpoint: P0.C03

On the next request to continue, take **P0.C03 only**: define fictional
sole-trader, planning and third-business profiles, EUR reporting and EUR/USD
examples; record the Windows/Android test matrix and bounded phone workflow.
This packet has not created those profiles or the matrix. Native platform
spike execution belongs to P0.C05, so do not label a planned device case tested.

Use Node 24.22.1 / npm 11.9.0, run applicable checks and report progress
separately with `npm run progress -- --json`. Preserve pending evidence and all
92 IDs. The existing human progress summary omits blocked/in-review counts;
the JSON output, manifest and in-app labels expose the current states.

## Copyable next task

> Read AGENTS.md and the linked project docs. Continue only P0.C03 from
> ROADMAP.md using wholly fictional profiles and examples. P0.C01 browser
> verification and P0.C02 acceptance review were deferred by the owner; keep
> their evidence and statuses visible. Define the synthetic profiles,
> EUR/EUR-USD cases, platform test matrix and bounded phone workflow required
> by P0.C03. Record what is planned versus actually exercised. Preserve all
> stable IDs, genuine history and notices, run applicable checks and stop after
> this one checkpoint. Do not implement later storage, file or tax features.

Durable Windows/Android operation, evidence archives, valuations, tax rules,
online services and full history/privacy review retain their own future
checkpoint requirements.
