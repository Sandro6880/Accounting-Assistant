# P0.C05 — Windows/Android feasibility spike

**Blocked / unverified: native compilation and actual device results are pending.**
This rebuilt source packet replaces the missing download. Its base is the owner's
checkpoint 4 commit `e37f46fe3a3a58cfb8f4cb0d60d9190da906cee8`, tree
`8ea87fda2acbd80191316d89c1a3a427f229c242`, input main-source fingerprint
`822f5e9949dfb89d13d6de2532caf4e8fa6657fa41f95044da68a8a20615590c`.
That tree matches the starting source of the previous P0.C05 packet. The new
ZIP/patch is regenerated and retested; it is not a recovered byte-identical
archive. Work remains limited to P0.C05. P0.C06 has not started.

## Scope and observed results

The [separate probe](../spikes/p0-c05/) has its own Tauri identity
`com.accountingassistant.p0c05spike`. It explores synthetic local save, camera,
restart, raw transport and notifications. It does not change the main app's
financial code, two-business fixture, memory storage or tax inventory.

| Layer / command | Observed outcome in this rebuilt packet |
| --- | --- |
| Input `npm ci` / `npm run check` on Linux x64 | Passed: 26 existing Node/DOM tests, typecheck, main build and 92-ID manifest |
| Separate portable probe | Ten tests and Vite build pass; independent runner records scope, exit codes, durations and source fingerprint |
| Fictional EUR/USD cases | EUR net 280.25 and separate USD 40.10; no EUR valuation or tax calculation |
| File reopen discovery | A fresh Linux Node process reads exact package/receipt bytes from an isolated generated temporary folder; not the Tauri adapter or a supported-device result |
| Negative cases | Corrupt fixture/payload/receipt, wrong business/currency, oversized media, conflicting IDs, interrupted writes, readback errors and unmarked destinations rejected; earlier bytes retained |
| Rust dependency resolution | Rust/Cargo 1.99.1, exact direct versions, 453-package Cargo.lock generated successfully |
| Linux native compile | `cargo check --locked` blocked at missing system pkg-config/GLib prerequisites; Tauri diagnostics also report missing WebKitGTK/rsvg |
| Android setup | Initialization exits 1: SDK/NDK unavailable; no ADB/device here |
| Installed Windows / actual Android measurements | Not run; no installer/APK or successful native compilation claimed |
| Camera, device transfer, notification arrival, native restart/reboot | Not run on devices; neither unit tests nor viewport emulation replace those observations |

The root core runner and probe runner are independent. A JSDOM walkthrough
checks language switching and explicit browser blocking; it is not a native
browser/device run. Earlier P0.C01 browser verification remains deferred.
Passing tests never promotes this checkpoint.

## Start on Windows — PowerShell

Use Node **24.22.1** / npm **11.9.0**. Extract the complete source folder, or
apply `P0_C05.patch` to checkpoint 4 after `git apply --check`.

```powershell
npm.cmd ci
npm.cmd run check
npm.cmd run spike:install
npm.cmd run spike:check
npm.cmd run progress -- --json
```

Expected: **26 main tests + 10 separate probe tests**, both builds, all 92 IDs.
Counts: **2 blocked, 3 in review, 87 planned, none verified**. Main results are
`outputs/checks.json`; portable probe results are `outputs/p0-c05-checks.json`.
The standalone ZIP has no Git history, so revision may be null. Use your actual
checkout for revision-linked evidence; preserve `.git`, history and unrelated work.

Preview the probe with `npm.cmd run spike:preview` at
`http://127.0.0.1:1420`. Native operations must report blocked there, with no
browser-storage fallback. Stop it with Ctrl+C before native development uses
that port. The accounting app still uses `npm.cmd run dev` on port 5173 and the
existing [manual guide](LOCAL_TESTING.md).

## Windows installed candidate

Proposed target: **Windows 11 x64 / WebView2**; no version is verified yet.
Install the [official Tauri prerequisites](https://v2.tauri.app/start/prerequisites/):
Microsoft C++ Build Tools with Desktop development with C++, WebView2 and the
MSVC Rust toolchain. The probe pins Rust 1.99.1. Downloads need internet; the
subsequent installed-app offline test must not depend on it.

```powershell
Set-Location spikes/p0-c05
rustc --version
cargo --version
npm.cmd run native:info
cargo metadata --locked --no-deps --format-version 1
npm.cmd run native:windows
```

The last command requests an NSIS installer under
`src-tauri/target/release/bundle/nsis/`. If it fails, retain the first error and
record Blocked/Failed. This is an unsigned development spike, not a signed
release or update/recovery system. Install the locally built app; stop servers,
disconnect networking and open it from Windows. Check the **Native bridge
available** banner. Record the actual Windows build, architecture, WebView2,
installer SHA-256 and package identity.

Choose Example Workshop. Save/list/load a fictional capture; record ID, business,
currency strings, package/receipt hashes and measured milliseconds. Close its
process fully, reopen offline and compare the same values. Repeat after an OS
restart. Record the actual termination method; a different JavaScript session
ID alone is not native process/reboot proof. Readback is not fsync/power-loss,
database transaction, recovery or low-disk evidence.

Try camera denial/grant/cancel where hardware is available. Record whether the
live or chooser path works, including unsupported/no-camera outcomes. Test
immediate notifications disabled/enabled in OS settings and observe actual
arrival/app identity. Windows notifications need an installed app; a development
toast is insufficient. Desktop scheduling is **unsupported by this plugin**;
the schedule button reports that explicitly. Closed-app Windows scheduling
needs a later design decision.

## Actual Android candidate

Proposed target: **physical arm64 Android 13+**, not a Pixel browser viewport.
Record actual model/OS/API, Android System WebView, JDK/SDK/NDK/Gradle versions
and generated min/target SDK. No Android compatibility list is approved yet.
Follow the [official Android prerequisites](https://v2.tauri.app/start/prerequisites/#android)
for Android Studio/JDK, SDK, NDK, `JAVA_HOME`, `ANDROID_HOME`, `NDK_HOME` and
Rust Android targets. From `spikes/p0-c05`:

```powershell
npm.cmd run native:android:init
node scripts/android-prepare.mjs
npm.cmd run native:android:build
```

The last command requests a debug arm64 APK with bundled frontend assets. Install
the output path printed by the build using `adb install -r "path-to-debug.apk"`.
Handle USB debugging authorization on your own device. Record its hash with
`Get-FileHash "path-to-debug.apk" -Algorithm SHA256` and retain
`outputs/p0-c05-android-preparation.json` for the generated manifest hash.
The preparation script declares camera/notification permissions, camera intent
visibility and a scoped FileProvider fallback if absent; it grants no runtime
permission. Generated projects and APKs remain ignored.

Launch the installed app, stop servers and enable airplane mode. In both
languages save/list/load a fictional Workshop capture and compare hashes. Test
normal close/reopen, explicit force-stop/relaunch and reboot separately.
Reinstall/clear-data is not a restart test.

Photograph only the on-screen fictional card. Test live-camera denial/grant,
PNG snapshot and capture/file chooser denial/cancel/grant. The live path produces
a **derived PNG**; the chooser preserves returned PNG/JPEG bytes up to 3 MiB.
Record actual camera versus picker fallback, resolution/size and oversized
rejection. Selecting a receipt does not save it: save a new capture, reopen and
compare its receipt hash. Original-camera retention needs its own observation.

Test immediate notifications denied/enabled, then schedule one 60 seconds ahead
and background/close the app. Record due time, actual arrival or failure,
permission/channel state and battery settings. Repeat before a device reboot;
record force-stop and cancellation separately. Android alarm/OS restrictions
can delay delivery. A void API request is not acceptance or arrival evidence.

## Raw device transfer discovery

This is an unencrypted, unauthenticated synthetic transport probe. There is no
P5 pairing, trusted sender, accounting import or acknowledgement protocol.

1. On Android save/load the capture and Export. Try Download; record whether
   the WebView creates a file. Move only that synthetic JSON to Windows by USB.
2. If download is unavailable, the private saved capture is the same raw envelope.
   The debug-only fallback below reads this probe package's known private file.
   Substitute the full UUID displayed by the app; `cmd.exe` redirection preserves
   bytes without PowerShell text conversion. If the path differs/access fails,
   record the blocker without searching other apps.

```powershell
$captureId = "paste-the-full-capture-UUID-from-the-spike"
cmd.exe /d /c "adb exec-out run-as com.accountingassistant.p0c05spike cat files/p0-c05/capture-$captureId.json > ..\..\outputs\p0-c05-phone.json"
```

3. In the Windows probe select the same business, read the transferred file and
   Import. Compare IDs, hashes, EUR/USD strings and business. Import twice: retain
   one capture. Select another business: reject before saving. Change a payload
   character without recalculating its hash: reject. No accounting entry results.
4. Reverse direction: download a Windows capture, copy by USB or `adb push` to
   the phone's Download folder and import it twice. Compare the same values.

A desktop encode/decode pass does not prove cross-device transport. SHA-256 is
an integrity check, not sender authentication; never put a real receipt here.

## Record results and stop at this checkpoint

Copy [PLATFORM_SPIKE_RESULTS_TEMPLATE.md](PLATFORM_SPIKE_RESULTS_TEMPLATE.md) to
ignored `outputs/p0-c05-device-results.md`. Record actual commands, OS/devices,
binary/manifest hashes, fixture, probe fingerprint, close/reopen methods, timings,
results and first errors. Session reports show requests/errors and manual fields;
save before closing because event logs start fresh. Native reports also save/read
back inside the probe folder and show text if WebView download is unavailable.
Compare persisted capture hashes across the two separately recorded sessions.

P0.C05 stays blocked until save, camera, restart, transport and notification
measurements on the proposed devices have been reviewed. Unsupported capabilities
are limitations, not passes, and may require a candidate change. P0.C06 architecture
acceptance and P2/P3/P5/P6 production adapters retain separate requirements.

Primary references: [Tauri filesystem](https://v2.tauri.app/plugin/file-system/),
[notifications](https://v2.tauri.app/plugin/notification/),
[Schedule API](https://v2.tauri.app/reference/javascript/notification/) and
[Windows installer](https://v2.tauri.app/distribute/windows-installer/).
The source packet pins Tauri 2.12.5, build helper 2.7.4, filesystem 2.7.1,
notifications 2.8.0 and JS/CLI 2.12.4. Dependency versions are candidate inputs,
not device-support evidence.

Final rebuilt source: main fingerprint `bb89fa657aa759d2436db63a121d1f769dd52d7603f9eb2a57f2b28be60bddb5`; probe
fingerprint `eb3d1a6a513ede003cbc085b8a266691b8bac7daa04f9defbc961a50c20e1b7e`. Both runs passed, with base revision
`e37f46fe3a3a58cfb8f4cb0d60d9190da906cee8` and `gitDirty: true`. These identify
prepared source inputs, not a native binary or approved device.

## Current continuation after C06/C07

The previous sections record the checkpoint 5 delivery and its blockers. The
replacement C06/C07 plan is now In review; the Tauri candidate remains
conditional. This probe source/fingerprint is unchanged and no new native run
is claimed. Current progress is 2 blocked, 5 in review, 85 planned, zero verified.
See [ARCHITECTURE.md](ARCHITECTURE.md) and [NEXT_WORK.md](NEXT_WORK.md).
