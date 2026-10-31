# P0.C03 — fictional profiles and platform test plan

Scope: define wholly fictional sole-trader, planning and third-business profiles,
EUR reporting/EUR–USD examples, a Windows/Android test matrix and the bounded
phone workflow. Prepared on **31 October 2026** from repository revision
`e681732ec7f301a761efd4427eeea2b706e4172c`, which contains the owner's committed
P0.C01/P0.C02 changes. Input tree: `8f57b216560c636323c37cc104490d6ffbaee8bd`.

P0.C01 browser verification and P0.C02 acceptance review remain deferred. The
owner authorized continuing to P0.C03. This packet's definitions and checks are
prepared for review; it does not start P0.C04 or certify installed devices.

## Fixture ownership and isolation

The versioned catalog is
[tests/fixtures/p0-c03/profiles.json](../tests/fixtures/p0-c03/profiles.json):
`catalogVersion: p0-c03-v1`, `dataMode: synthetic`, with the existing workspace
marker `synthetic-v1`. The catalog is test data and is not an application import
format or a database seed for a real business.

The first two profiles and their default totals remain exactly as supplied by
[createSyntheticWorkspace](../src/demo/fixture.ts). The third is created through
the existing [AccountingApplication.addBusiness](../src/application/accounting.ts)
in an isolated memory repository. The browser guide creates it through the
existing Businesses form. The default app still opens with two businesses;
reset/refresh does not permanently add a third profile.

All names, IDs, dates, services and amounts below are invented. No registration,
UID, bank connection, document folder, credentials or personal business setup is
required. VAT remains explicitly unconfirmed. Accounting-method, deduction and
legal VAT-case decisions belong to P0.C04 and later reviewed rule checkpoints.

## Profile definitions

| Role | Fictional name | Test ID | Country / profile | How to obtain it |
| --- | --- | --- | --- | --- |
| Sole trader | Example Consulting | `demo-consulting` | AT / sole-trader / VAT unconfirmed | Present in the default synthetic fixture |
| Planning business | Example Studio | `demo-studio` | AT / planning / VAT unconfirmed | Present in the default synthetic fixture |
| Third independent business | Example Workshop | `demo-workshop` in Node tests | AT / planning / VAT unconfirmed | Create through the normal application boundary; browser creation uses a generated ID |

The roles exercise the current generic `Business` record. They do not introduce
new tax entities, tax-scope membership or effective-dated profile configuration.
Those remain P1 work. New browser businesses currently start in planning mode.

## EUR reporting and source-currency examples

Reporting currency for this test plan is EUR. Source EUR and USD amounts retain
their original currency and exact cents. No EUR valuation/rate exists for USD,
so posted USD remains separate and makes the provisional EUR view incomplete.
These figures describe the current posted-movement view, not a statutory return.

### Unchanged default fixture

| Business | Source currency | Posted income | Posted expenses | Posted net |
| --- | --- | ---: | ---: | ---: |
| Example Consulting | EUR | 1,200.00 | 79.90 | 1,120.10 |
| Example Consulting | USD | 250.00 | 0.00 | 250.00 |
| Example Studio | EUR | 800.00 | 0.00 | 800.00 |
| Example Studio | USD | 0.00 | 0.00 | 0.00 |

Example Consulting also has an unposted EUR 50.00 draft; it is excluded from
these figures. A newly created Example Workshop starts with zero totals in
both currencies. The baseline fixture has no real account data.

### Third-business scenario

Use date `2026-02-01` and these catalog cases, saving and posting each one:

| Case | Description | Type | Currency | Amount |
| --- | --- | --- | --- | ---: |
| `third-eur-income` | Fictional workshop service | Income | EUR | 300.20 |
| `third-eur-expense` | Fictional workshop materials | Expense | EUR | 19.95 |
| `third-usd-income` | Fictional workshop USD service | Income | USD | 40.10 |

| Example Workshop result | Posted income | Posted expenses | Posted net |
| --- | ---: | ---: | ---: |
| EUR | 300.20 | 19.95 | **280.25** |
| USD, shown separately | 40.10 | 0.00 | **40.10** |

Before posting, saving all three as drafts leaves both currency totals at zero.
The catalog records expected cents as decimal strings (`28025`, `4010`) rather
than floating-point JSON numbers. Consulting/Studio totals and their existing
records must remain unchanged throughout this scenario. No combined EUR+USD
total is valid without a reviewed valuation, which is outside this checkpoint.

## Reproducible checks

[tests/profiles.test.ts](../tests/profiles.test.ts) uses the existing application
and memory repository to exercise the catalog:

1. Construct all three profiles, retain unknown VAT status and reproduce the
   baseline EUR/USD totals without mutating the default fixture.
2. Create the third business's three drafts, prove drafts do not count, reject
   a wrong-business posting without a state change, post the cases and verify
   exact separate-currency totals and unchanged records in the other businesses.

The existing application, domain rules, memory adapter and default fixture are
unchanged. The new test scenario runs only in synthetic session memory. Existing
Node/DOM checks also cover creation/posting/reversal, input validation, unsaved
scope and reset. The in-app Test Lab still has its own nine isolated assertions;
these two catalog checks belong to the Node suite.

## Windows and Android matrix

Availability and execution evidence are separate. **Not implemented** describes
an unavailable feature; **Not run** describes an unexecuted platform check.
P0.C03 defines the matrix. Actual platform spike execution belongs to P0.C05,
installed durability to P2/P5, recovery to P3 and notifications to P6.

| Case | Platform / layer | Scenario and expected behavior | Availability today | Evidence in this packet |
| --- | --- | --- | --- | --- |
| CORE | Linux Node/JSDOM | Three fictional profiles, exact EUR/USD totals, wrong-business rejection, existing accounting/DOM regressions | Implemented core | Executed results recorded below |
| WIN-CORE | Windows Node 24.22.1 / npm 11.9.0 | Clean install, typecheck, Node/DOM suite, build and 92-ID manifest validation | Commands implemented | Not run on Windows here |
| WIN-BROWSER | Windows Chromium via Playwright | Three journeys each in desktop and Pixel 7 emulation: post/reverse, unsaved scope, lab/reset | Six journeys configured | Not run here; P0.C01 browser verification remains deferred |
| WIN-MANUAL | Windows browser / EN and DE | All five views, three profiles, money cases, invalid amounts, keyboard use, scope switches, reset | Current synthetic browser app | Not run manually here; use [LOCAL_TESTING.md](LOCAL_TESTING.md) |
| WIN-OFFLINE | Installed Windows app | Cold start with no server/network; save and reopen retained original records | Not implemented (P2) | Not run; development-server use is not installed offline proof |
| WIN-FAILURE | Installed Windows app | Interrupted write/update and low disk produce a clear result without partial financial changes | Not implemented (P2/P3) | Not run |
| ANDROID-LAYOUT | Desktop Chromium mobile emulation | Current app navigation, form/scope changes and reset at a phone-sized viewport | Configured Playwright project | Not run here; does not test an actual Android device |
| ANDROID-CAPTURE | Actual Android device / EN and DE | Select business, capture EUR/USD draft and fictional original, preserve both through restart | Not implemented (P5) | Not run |
| ANDROID-CAMERA | Actual Android device | Permission grant/deny/cancel and original-file retention have explicit outcomes | Camera path not implemented; spike in P0.C05 | Not run |
| TRANSFER | Paired Windows/Android devices | Authenticated encrypted capture transfer, desktop preview/acceptance, duplicate retry and acknowledgement | Not implemented (P5) | Not run |
| RECOVERY | Installed Windows/Android | Restore separate synthetic location and compare original-file digests, counts and totals | Not implemented (P3/P5) | Not run |
| NOTIFICATION | Supported installed platforms | Permission denied/granted, restart and overdue catch-up are distinguishable | Not implemented (P6); feasibility in P0.C05 | Not run |

Record the actual OS, browser/device version, revision/dirty state, fixture,
command, result and error for a local run. A convenient blank template is
[TEST_REPORT_TEMPLATE.md](TEST_REPORT_TEMPLATE.md). Do not prefill native cases
as passed from Node results or mobile emulation.

## Bounded phone workflow — future capture target

The initial phone role is capturing drafts for later desktop review:

1. Open the future installed capture app, select a fictional business and
   choose English or German. Keep the selected business visible.
2. Enter a date, description, type, positive amount and explicit EUR/USD source
   currency; optionally capture a wholly fictional receipt original. Unknown
   VAT facts remain unresolved.
3. Save to a local pending queue. A successful save must retain original bytes,
   currency and business across an offline restart; failure must leave the
   capture visibly recoverable or unsaved.
4. Transfer a capture package to the paired desktop when available. Desktop
   preview/acceptance creates one draft; retry must not create duplicate income.
5. Show acknowledgement on the phone and retain unresolved captures for review.

This is a defined target, not a current mobile feature. Today the app binds to
desktop loopback; a phone's `127.0.0.1` points to that phone, not the desktop.
Use desktop mobile emulation for the existing interface. The installed app,
camera, durable queue, pairing and transfer must be implemented and tested in
their own checkpoints before this target can be exercised on a device.

## Checkpoint evidence and next step

The input revision reproduced the original 24-test core successfully after
`npm ci`. Final results for this packet:

| Check | Observed result |
| --- | --- |
| Focused `tests/profiles.test.ts` execution | 2 passed, 0 failed/skipped |
| `npm run check` after the catalog/metadata update | Exit 0: 26 Node/DOM tests, typecheck, build and all 92 manifest IDs passed |
| `npm run progress -- --json` | Exit 0: fresh core evidence; 1 blocked, 2 in review, 89 planned; none verified |
| Current-app walkthrough in Node/JSDOM | Created Workshop through the UI, saved three drafts with zero posted net, posted the three cases, observed EUR 280.25 / separate USD 40.10, unchanged other businesses, nine Test Lab passes, EN/DE roadmap states and reset to two default businesses |
| Windows/browser/actual Android checks | Not run here; PowerShell steps and device targets are provided for local execution/review |

The final run records base revision
`e681732ec7f301a761efd4427eeea2b706e4172c` with `gitDirty: true` and checked-source
fingerprint `01a12dcf32075e5a1363f9a641d61d07c8d2d7e5e78177dfb8effa561a66dfdf`.
The browser stage is explicitly not-run. Node/JSDOM interactions do not prove
native rendering, PowerShell execution or installed-device behavior. The
fingerprint covers the runner's configured source/manifest inputs, not the truth
of this document. Generated reports remain ignored.

P0.C03 remains **In review**, with P0.C01/P0.C02 evidence preserved and all 92
IDs retained. No personal business setup or real account data is necessary to
exercise these cases. The next checkpoint is **P0.C04**, the supported accounting
method and synthetic VAT-case inventory; it has not been started.
