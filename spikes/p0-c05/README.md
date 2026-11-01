# P0.C05 — isolated synthetic platform probe

This disposable Tauri 2 candidate is separate from the accounting app. Use only
wholly fictional records and images. It does not implement a production financial
adapter, recovery, encrypted pairing or official tax output. Windows/Android
builds and device measurements remain unverified. No installer/APK is included.

From the repository root, using Node 24.22.1 / npm 11.9.0:

```powershell
npm.cmd ci
npm.cmd run check
npm.cmd run spike:install
npm.cmd run spike:check
npm.cmd run spike:preview
```

The interface preview is `http://127.0.0.1:1420`. Native storage/notification
operations report `NATIVE_REQUIRED` in a plain browser; there is no browser
storage fallback. The accounting app remains on port 5173 with session-memory
records. Follow [the native guide](../../docs/PLATFORM_SPIKE.md) for builds and
measurements. Stop after this checkpoint; P0.C06 has not started.

The three fictional business IDs and fixed EUR/USD examples mirror P0.C03:
EUR 300.20 income, EUR 19.95 expense and separate USD 40.10 income. Amounts are
integer-cent strings, never floating-point totals. The fixture is `p0-c05-v1`;
the accounting app's `synthetic-v1` catalog and financial source are untouched.

The native shell uses only its own `AppLocalData/p0-c05` folder and requires an
exact synthetic marker. It rejects existing unmarked/wrong-marker folders.
Captures use exclusive file creation and verified readback. Duplicate packages
retain one capture; conflicting IDs, readback failures and partial files remain
visible errors without replacing earlier bytes. This does not provide database
transactions, fsync, power-loss recovery, encryption or access verification.

The English/German probe includes:

- Save/list/reload with capture IDs, business, receipt/package hashes and timings.
- Live WebView camera access and a derived PNG, plus an `image/*` native capture/
  file chooser. Returned PNG/JPEG bytes are retained, up to 3 MiB. A picker result
  does not prove a camera opened; original-file retention needs observation.
- Raw JSON export/import into this probe only. SHA-256 checks accidental changes;
  there is no trusted sender, encryption, pairing or accounting import.
- Immediate notification requests and a 60-second Android schedule. Desktop
  scheduling reports unsupported. Requests never count as delivered notifications.
- Session JSON reports with source fingerprint, runtime, requested operations,
  timings/errors and separate manual observations. A prior JavaScript session
  never establishes native process restart or device reboot. Reports are shown
  as text, requested as downloads and also saved/read back in the native folder.

Ten portable tests include exact cents/scope, receipt preservation, corrupt
packages, size/type bounds, duplicate/conflicting IDs, unmarked destinations,
failed saves and a fresh Linux Node process reopening a temporary synthetic file.
They do not exercise the Tauri filesystem or any Windows/Android device API.
`outputs/p0-c05-checks.json` is separate from the main `outputs/checks.json`.

The probe fingerprint covers checked-in source, tests, native configuration,
icons, Rust pin and both lockfiles. It excludes docs and generated/native output.
The older main fingerprint does not include this separate probe. Generated
Android manifest/APK, installer hashes and actual OS/WebView need separate
evidence. `android-prepare.mjs` modifies only the ignored generated Android
project and records the manifest hash; it does not grant permissions or prove a
build. Rust 1.99.1, exact direct native/npm dependencies and lockfiles are pinned.

New source uses MPL-2.0 notices. The icon is original geometric SVG rendered by
the pinned CLI. Preserve upstream Tauri/API/plugin MIT/Apache-2.0 and Vite MIT
notices when distributing later binaries. P0.C07's rights/history audit remains
separate work.
