# Agent handoff

Work on **one checkpoint at a time**, using the repository roadmap. Read root
AGENTS.md, README.md, ROADMAP.md, SECURITY.md and
[ARCHITECTURE.md](ARCHITECTURE.md).

## Current checkpoint: P0.C03, in review

The [fictional profile definition](SYNTHETIC_PROFILES.md) supplies three profiles,
exact EUR/USD examples, the Windows/Android matrix and the bounded phone capture
target. The versioned catalog is `tests/fixtures/p0-c03/profiles.json` and two
application-level checks in `tests/profiles.test.ts` exercise it. The current
core suite has 26 tests. Definitions and native-platform acceptance are In
review rather than Verified.

The default demo still starts with two businesses and its original totals.
The third is created through the existing application/Businesses path in an
isolated synthetic session; no actual business setup or account is needed.
Money rules, default fixture, storage and missing financial features are
unchanged. [LOCAL_TESTING.md](LOCAL_TESTING.md) provides owner-side Windows
commands and the full manual walkthrough. A blank result sheet is included.

The packet starts at the owner's committed revision
`e681732ec7f301a761efd4427eeea2b706e4172c` (P0.C01/P0.C02). Its input tree and
fingerprint are recorded in the profile document and manifest. New local
changes are not claims of another commit or push.

## Deferred evidence and continuation

The owner explicitly deferred verification and requested successive next
checkpoints, one at a time. P0.C01 remains Blocked/unverified and P0.C02 remains
In review, with their original checkpoint evidence unchanged. This authorization
supersedes the earlier instruction to resolve P0.C01 before continuing definition
work. See [BASELINE.md](BASELINE.md) and
[VERIFICATION.md](VERIFICATION.md) for the browser installation/launch blocker.
The earlier saved-draft implementation suggestion remains deferred until its
roadmap dependencies are ready.

When verification resumes, review the audit and profile/matrix definitions
against their recorded source snapshots. Follow the Windows local guide for
core, native-browser and manual results; keep installed-device cases separate.
Neither passing core tests nor continuing another definition packet automatically
verifies earlier checkpoints. Do not rerun blocked browser setup as part of
unrelated source-only work when its verification remains deferred.

## Next separate checkpoint: P0.C04

On the next request to continue, take **P0.C04 only**: define the supported
Austrian accounting method and synthetic VAT cases, including unknown status,
domestic, EU business, direct EU consumer digital and non-EU cases; select the
first report/year adapter. Verify current official sources for legal/tax claims.
The profiles currently keep VAT unconfirmed and do not decide those rules.
P0.C04 has not been started. Native platform spike execution remains P0.C05.

Use Node 24.22.1 / npm 11.9.0, run applicable checks and report progress
separately with `npm run progress -- --json`. Preserve pending evidence and all
92 IDs. The existing human progress summary omits blocked/in-review counts;
the JSON output, manifest and in-app labels expose the current states.

## Copyable next task

> Read AGENTS.md and the linked project docs. Continue only P0.C04 from
> ROADMAP.md, using the fictional P0.C03 profiles and current official sources.
> Earlier verification/reviews remain deferred by the owner; keep their evidence
> and statuses visible. Define the supported accounting-method/VAT-case inventory
> with explicit unknown cases, support/exclusions and the first report/year
> adapter. Record source dates and review limits. Do not use personal account
> facts or implement later tax outputs. Preserve all stable IDs, run applicable
> checks and stop after this one checkpoint.

Durable Windows/Android operation, evidence archives, valuations, tax rules,
online services and full history/privacy review retain their own future
checkpoint requirements.
