# P0.C05 device results — blank template

Copy to ignored `outputs/p0-c05-device-results.md`. All cases start **Not run**.
Use wholly fictional data. Expected results never count as observed evidence.

| Context | Actual value |
| --- | --- |
| Date/time/timezone | Not recorded |
| Git revision / dirty state / patch | Not recorded |
| Probe source fingerprint / fixture | Not recorded / `p0-c05-v1` — confirm used |
| Node/npm/Rust/Cargo | Not recorded |
| Installer / APK SHA-256 | Not recorded |
| Windows build / architecture / WebView2 | Not recorded |
| Android model / OS / API / System WebView | Not recorded; no serial number needed |
| JDK/SDK/NDK/Gradle; generated min/target SDK; manifest hash | Not recorded |
| Installed launch / build mode / servers stopped / network state | Not recorded |

| Case | Status | Actual result, milliseconds, first error, evidence path |
| --- | --- | --- |
| Main `npm.cmd run check` | Not run | |
| Separate `npm.cmd run spike:check` | Not run | Portable only |
| Windows build/install | Not run | |
| WIN-SAVE: ID, business, EUR/USD, package/receipt hashes | Not run | |
| WIN-RESTART: full close/reopen offline | Not run | Actual termination method |
| WIN-REBOOT: same hashes after OS restart | Not run | |
| WIN-CAMERA: grant/deny/cancel, live/chooser path | Not run | Record no hardware/unsupported separately |
| WIN-NOTIFY: denied/enabled, actual arrival/app identity | Not run | Request alone is insufficient |
| WIN-SCHEDULE: explicit unsupported limitation | Not run | Plugin schedules only on mobile |
| Android APK build/install | Not run | |
| AND-SAVE: airplane-mode readback with hashes | Not run | |
| AND-RESTART: normal close and force-stop separately | Not run | |
| AND-REBOOT: same saved capture/receipt | Not run | |
| AND-CAMERA: denial/grant/cancel, live PNG and chooser/original | Not run | Fictional card only; size/resolution |
| AND-CAMERA-RESTART: same saved image bytes/hash | Not run | |
| TRANSFER Android→Windows, actual USB/download/debug path | Not run | IDs/hashes/business/currency strings |
| TRANSFER Windows→Android | Not run | |
| TRANSFER duplicate/wrong-business/changed-byte rejection | Not run | One capture, no accounting entry |
| AND-NOTIFY immediate, denied/enabled/actual arrival | Not run | |
| AND-SCHEDULE due/arrival after normal close/background | Not run | Delay and OS/battery settings |
| AND-SCHEDULE force-stop / reboot / cancellation | Not run | Separate observations |
| EN/DE controls and notification text, both installed devices | Not run | |
| Session report native save/readback and download/copy | Not run | Both session IDs around restart |

Use Passed, Failed, Blocked or Not run. An unsupported feature is a limitation,
not a delivery pass. Distinguish manual observations from runner output. No
checkpoint is automatically verified. Attach only fictional captures and reviewed
technical logs. Device/version approval and review decision: **Pending**.
