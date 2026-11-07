# Test the synthetic desktop delivery

Use wholly fictional material. The desktop build is unsigned and has not been
executed on a physical Windows computer here. Do not treat the ZIP as a signed
production release or bypass an organizational device policy to run it.

## Windows x64

Extract the entire Windows ZIP into a new folder. Keep its DLLs/resources beside
`Accounting-Synthetic.exe`; run that executable. Windows 10/11 x64 is the package
target; record the actual OS version, artifact SHA-256 and observed behavior.

Alternatively, build/run from source with pinned Node 24.22.1 and npm 11.9.0:

```powershell
npm.cmd ci
npm.cmd run desktop:install
npm.cmd run desktop:dev
```

1. Create a **synthetic vault** with a new test-only passphrase of 12–256
   characters. No example/default passphrase is installed.
2. Confirm Example Consulting shows EUR 1,120.10 net and USD 250.00 separately.
3. Under Entries, save a fictional EUR expense for 12.34. Post it and confirm
   EUR net becomes 1,107.76. Reverse it; the original remains and net returns to
   1,120.10. Do not enter genuine records.
4. Create a third fictional business. Change language and business; confirm
   records stay scoped. Append a dated unknown/exempt/registered planning profile.
   These labels do not calculate VAT or certify legal status.
5. Archive the third business. Its history stays readable; attempts to create
   further entries should fail with the archived-business message.
6. In Local vault, attach a wholly fictional TXT/PDF/PNG/JPEG file to an entry.
   Confirm its name, byte count and SHA-256. Read a TXT note. Binary originals
   remain opaque; an image/PDF viewer is not supplied.
7. Lock. Confirm no records are visible. A wrong passphrase must fail; repeated
   unlock failures are throttled. Unlock and confirm the correct records return.
8. Close the whole application, disconnect networking, reopen, and unlock.
   Confirm posted/reversed entries and attachment metadata survived. Reboot the
   computer and repeat. Record these separately from a window reload.
9. Leave it without data operations for five minutes. It should lock. This
   timeout measures data operations, not keyboard/mouse activity.
10. Save an encrypted backup **outside** the vault, supplying the current
    workspace passphrase and an independent backup passphrase. Copy it to a
    separate device. Follow the restore instructions below and compare totals,
    IDs, profile history, original note bytes and hashes.

The application-specific default vault is in Electron's user-data directory under
`offline-accounting-workspace/workspace.synthetic-vault`. The exact parent is
OS-specific (normally `%APPDATA%` on Windows). Do not scan personal folders for a
vault. A user-selected restored workspace is remembered for the next startup;
the original is retained. There is no persistent-demo reset button.

For automated checks from source:

```powershell
npx.cmd playwright install chromium
npm.cmd run check:desktop
npm.cmd run progress
```

## Android / original P0.C05 probe

The Windows Electron accounting shell does **not** run on Android. The separate
existing Tauri spike remains the device-feasibility probe. Follow
[PLATFORM_SPIKE.md](PLATFORM_SPIKE.md), its pinned Rust/Android prerequisites and
[results template](PLATFORM_SPIKE_RESULTS_TEMPLATE.md). Measure save/readback,
camera permission and capture, process restart/reboot, raw transfer, notification
permission/delivery and unavailable APIs on the physical device. Raw probe
transfer is not authenticated pairing or accounting import. Probe results do not
establish financial database/recovery acceptance.

## Record actual outcomes

Record date/time, source/artifact hashes, actual Windows/Android version, device,
fixture, command/actions, expected and observed results, pass/fail/not-run,
screenshots using fictional data, and limitations. Do not fill an unexecuted
device row with a passing result. Device results and independent security/rights
review are the remaining inputs to acceptance; the 92 checkpoint states stay
separate from test counts.
