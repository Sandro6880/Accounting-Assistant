# Bounded work after P0.C06/P0.C07

**Current continuation:** The 7 November 2026 user request explicitly covers
P0–P3 and supersedes the older single-checkpoint packet boundary for this task.
See [DELIVERY.md](DELIVERY.md) for the implemented candidates, actual checks and
remaining device/review gates, and [DESKTOP_TESTING.md](DESKTOP_TESTING.md) for
the next Windows/Android measurements. No checkpoint is promoted by that request
or by passing tests. The original packet plan below is retained as history.

Replacement delivery dated 1 November 2026. Earlier acceptance remains deferred;
this file does not promote checkpoints or start P1. P0.C06 and P0.C07 are In review.

| Checkpoint | Bounded packet | Dependency / gate | Proof | Estimate |
| --- | --- | --- | --- | --- |
| P0.C07 | Inspect repository/history/license/privacy (in-review) | P0.C06 planning record; Exact source revision and advertised refs | Bounded actual inspection with objects, notices, privacy rules, artifacts and unresolved rights questions recorded. | 3–6 h |
| P0.C01 | Finish browser evidence (blocked) | Working Chromium host | Execute all six configured browser journeys and retain exact checked-source results. | 1–3 h |
| P0.C05 | Measure supported native devices (blocked) | Windows host; Physical Android device; SDK/NDK/native prerequisites | Actual save/camera/restart/reboot/transport/notification observations and artifact hashes. | 4–8 h |
| P1.C01 | Introduce generic ownership/schema concepts (planned) | P0 review acceptance or explicit bounded owner continuation; ADR-007 | Third fictional business, unchanged original totals/IDs and denied cross-business relationships. | 4–6 h |
| P1.C02 | Portable rules and workflow contracts (planned) | P1.C01 ownership model | Domain/application scenarios run without hosted/device dependencies. | 3–6 h |
| P1.C03 | Transactional/replay storage contracts (planned) | P1.C01; P1.C02; ADR-008 | Retry/conflict/stale edit/failed transaction leave valid state. | 4–6 h |
| P2.C01 | Bounded installed Windows foundation (planned) | P0.C05 accepted candidate; P1 contracts; Security/recovery design gates | Installed package opens its local fictional records offline, with artifact and runtime evidence. | 6–12 h |

P1.C01 is next in roadmap order. Begin only on a later owner request, after P0
acceptance or with that bounded continuation explicitly recorded while retaining
release/evidence debt. Do not combine multiple P1 checkpoints, replace the memory
adapter, implement draft editing or claim native support in this packet.

Estimates include implementation, meaningful regression checks, documentation and
bilingual UI where needed. They assume the pinned source/toolchain and synthetic
fixtures, exclude unavailable device/legal/rights acceptance, and are not a
schedule or total-project estimate. Re-estimate after each packet.

Full directions and acceptance constraints: [architecture plan](../project/architecture-plan.json).
