# Agent handoff

Work on one checkpoint at a time from ROADMAP.md. Read AGENTS.md, README.md,
SECURITY.md and [ARCHITECTURE.md](ARCHITECTURE.md).

## Current checkpoint: P0.C05, blocked / unverified

The [isolated platform probe](../spikes/p0-c05/) and
[device guide](PLATFORM_SPIKE.md) prepare local save, camera, restart, raw transfer
and notification measurements. The separate ten-test portable runner and build
pass alongside the existing 26-test accounting core. The main app's financial
source, fixture, tax definitions, tests and lockfile are unchanged.

Native compilation remains blocked: `cargo check --locked` fails at missing
system pkg-config/GLib; Tauri reports missing Linux WebKitGTK/rsvg. Android setup
fails because SDK/NDK are absent. No Windows desktop or actual Android device is
available. No installer/APK or native-device result is claimed. A fresh Linux
Node process reopening files is portable discovery, not the Tauri storage adapter.

The candidate has no financial adapter, protected recovery, encryption, trusted
pairing or production reminder engine. Live camera PNG is derived; chooser
original bytes and actual camera fallback need device observations. Notification
requests never prove delivery; the pinned plugin schedules on mobile only.
Do not replace missing native evidence with emulation or a changed JavaScript
session ID. Use [the blank device sheet](PLATFORM_SPIKE_RESULTS_TEMPLATE.md).
P0.C06 has not started; gather and review this same checkpoint's device results.

## Rebuilt source packet

The prior ZIP/workspace was removed by automatic maintenance. The owner then
committed checkpoint 4 as `e37f46fe3a3a58cfb8f4cb0d60d9190da906cee8`, tree
`8ea87fda2acbd80191316d89c1a3a427f229c242`. This exactly matches the earlier P0.C05
input tree. The restored probe is regenerated and retested; the new ZIP is not
claimed byte-identical to the old archive. `P0_C05.patch` now targets checkpoint
4 directly. Preserve Git history and unrelated work; run `git apply --check` first.
No commit or push is implied by this source delivery.

Earlier records stay intact: P0.C01 Blocked, P0.C02/P0.C03/P0.C04 In review.
The owner deferred detailed verification and explicitly authorized continuation.
Do not invent earlier browser/device results. P0.C04's 18 VAT cases remain
reference definitions; E1a/2026 artifact/mapping is unverified and output disabled.
Counts: 2 blocked, 3 in review, 87 planned, none verified; all 92 stable IDs remain.

## Commands and evidence

```sh
npm ci
npm run check
npm run spike:install
npm run spike:check
npm run progress -- --json
```

Use `npm.cmd` in Windows PowerShell. Main results: `outputs/checks.json`.
Portable probe: `outputs/p0-c05-checks.json`. Their fingerprints/scopes are
separate; the main runner does not cover `spikes/`. The probe fingerprints source,
configuration, icons, toolchain and lockfiles, excluding docs/generated binaries.
Record generated manifest/APK/installer hashes and device versions separately.
The human progress summary omits blocked/in-review counts; use JSON or Roadmap.

## Next bounded task

> Continue P0.C05 only. Follow the guide on the proposed Windows and physical
> Android devices using wholly fictional records. Measure offline save/readback,
> camera permissions and original bytes, normal/force-stop restart, device reboot,
> raw USB transport and actual notification delivery/cancellation. Preserve
> blocked/unsupported/failed outcomes; fix only the probe if needed. Review the
> measurements before changing status or accepting architecture in P0.C06.
