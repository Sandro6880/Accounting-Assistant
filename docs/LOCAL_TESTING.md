# Test the current app on Windows

Use wholly fictional data. The app has no backend, login or configuration values
to obtain. Its records live in memory: refresh/reset discards your changes.
This guide tests implemented browser behavior and records future platform cases
separately. See the [P0.C03 matrix](SYNTHETIC_PROFILES.md).

## 1. Apply the update and open PowerShell

For a quick standalone test, extract the ZIP to a separate test folder and open
its complete **Accounting-Assistant** subfolder. It contains `package.json`,
`src`, `tests` and `ROADMAP.md`; dependencies are installed in step 2. Open
PowerShell in that subfolder.

For your existing Git checkout, apply the included P0.C03 patch instead, based
on commit `e681732ec7f301a761efd4427eeea2b706e4172c` (your checkpoint 1/2 commit).
Follow the ZIP's instructions and preserve `.git` and unrelated work. The two
paths contain the same code. Use your checkout for revision-linked evidence;
the standalone source folder has no Git history, so its recorded Git revision
can be null. The app/core checks can still run and record a source fingerprint.

Check the toolchain:

```powershell
node --version
npm.cmd --version
```

Expected pinned versions: **Node v24.22.1** and **npm 11.9.0**. Both Node pin
files and `package.json` record them. The `.cmd` spelling avoids PowerShell
trying to run a restricted `npm.ps1`; no execution-policy change is required.

## 2. Install and run the core checks

```powershell
npm.cmd ci
npm.cmd run check
npm.cmd run progress -- --json
```

Expected: **26 Node/DOM tests pass**, typecheck/build pass, all **92** roadmap
IDs validate, and progress reports `localChecks.status: passed` with
`fresh: true`. Core scope explicitly leaves browser tests `not-run`.

Progress should have one blocked checkpoint (P0.C01), two in review
(P0.C02/P0.C03), 89 planned and none verified. A successful run does not change
those statuses automatically. Use the JSON form; the short human summary omits
blocked/in-review counts.

The two catalog tests can also be run on their own:

```powershell
node --import tsx --test tests/profiles.test.ts
```

They construct the three fictional profiles through existing application
commands; the default browser demo still starts with two profiles.

## 3. Run the real browser journeys

Run these before starting a separate preview server on port 4173:

```powershell
npx.cmd playwright install chromium
npm.cmd run check:all
npm.cmd run progress -- --json
```

Expected on a working Chromium host: the core checks plus **6 browser journeys**
pass (3 desktop and 3 Pixel 7 emulation). The runner starts/stops its own preview
server. JSON scope becomes `core-and-browser`, and the `test:e2e` step should be
`passed`. Pixel 7 emulation is not native Android-device evidence.

If installation or launch fails, keep the actual error and report that layer as
blocked/failed. A successful `npm run check` remains core evidence only. This
packet does not claim those browser journeys ran successfully on its Linux host.
Record your Windows outcome so the deferred P0.C01 evidence can be reviewed.

## 4. Open the app

```powershell
npm.cmd run dev
```

Keep that terminal running and open
[http://127.0.0.1:5173](http://127.0.0.1:5173). The server waiting for requests is
normal. Press **Ctrl+C** in its terminal when finished.

To inspect the production build instead, stop the dev server and use
`npm.cmd run build` followed by `npm.cmd run preview`; open
[http://127.0.0.1:4173](http://127.0.0.1:4173). Stop a manually started preview
before running `check:all`, which reserves that same port.

## 5. Check the default businesses and totals

Start with a fresh page, English selected, and Example Consulting:

| Business | Expected EUR income | EUR expenses | EUR net | Separate USD net |
| --- | ---: | ---: | ---: | ---: |
| Example Consulting | 1,200.00 | 79.90 | **1,120.10** | **250.00**, with valuation/incomplete-EUR warning |
| Example Studio | 800.00 | 0.00 | **800.00** | 0.00; no USD warning |

Switch the Business selector between them. In Entries, Consulting has a
EUR 50.00 draft that must not affect its posted totals. Studio must not show
Consulting's records. Return to Consulting for the next step.

## 6. Create, post and reverse a fictional expense

1. Open **Entries**. Enter description `Fictional manual expense`, date
   `2026-01-20`, type Expense, amount `10,05` and currency EUR.
2. Click **Save draft**. Confirm one new draft row exists. Overview must still
   show EUR **1,120.10** net.
3. Return to Entries, click **Post** on that row and confirm. Overview must now
   show EUR **1,110.05** net. The journal gains the posting's debit/credit pair.
4. Return to Entries, click **Reverse** on that same posted row and confirm.
   Both the original and its linked reversal remain visible. Overview returns
   to EUR **1,120.10**; the separate USD 250.00 is unchanged.

Use the past date above so the app's current-date reversal does not precede the
original. Saved-draft editing is still unavailable; this step tests creation,
posting and full reversal.

## 7. Check validation, language and unsaved scope

1. In Entries, enter `Fictional unsaved scope` with amount `12,34`, without
   saving. Switch to **DE**: the text/value must remain and controls translate.
2. Change **Betrieb** to Example Studio: its create form must be independent.
   Return to Example Consulting: the unsaved description and `12,34` return.
3. Navigate to **Übersicht** and back to **Buchungen**: the form remains.
   Switch back to **EN**.
4. Try saving with amount `1,234.00`, then `1.005`, then `0`. Each must show an
   error without adding a row or changing posted totals. Valid amounts use one
   decimal dot/comma and at most two fractional digits.
5. Use Tab/Shift+Tab, Enter and Space to reach and operate navigation, the
   business selector, language controls and form actions. Record focus/reading
   problems separately; passing DOM tests do not establish keyboard/layout QA.

Reset the demo, accept the confirmation, and continue in English before the
third-business scenario. This removes unsaved invalid inputs and restores the
baseline figures.

## 8. Create the third profile and reproduce the catalog

1. Open **Businesses**, enter `Example Workshop` and click **Create business**.
   It becomes selected, with a planning profile and VAT unconfirmed. Overview
   starts at zero; the selector now has three businesses.
2. In its Entries form, save all three rows below as drafts. Set date
   `2026-02-01` for each row; the create form resets after each save. Overview
   must still show zero posted totals.

| Description | Type | Currency | Amount |
| --- | --- | --- | ---: |
| Fictional workshop service | Income | EUR | 300.20 |
| Fictional workshop materials | Expense | EUR | 19.95 |
| Fictional workshop USD service | Income | USD | 40.10 |

3. Post each of those three draft rows and confirm. The result must be EUR
   income **300.20**, expenses **19.95**, net **280.25**, with separate USD
   **40.10** and the incomplete-EUR warning. USD must not increase EUR income.
4. Switch to Consulting and Studio. Their original totals remain EUR 1,120.10
   and EUR 800.00, with Consulting's separate USD 250.00. Workshop's rows must
   appear only under Workshop.

The browser generates a business ID; compare its name and scope rather than
expecting the deterministic Node fixture ID `demo-workshop`.

## 9. Check Test Lab, Roadmap and session reset

- Open **Test Lab**. Before running it, status is **Not run**. Click
  **Run browser checks**: expect **9/9** pass. These are isolated assertions,
  separate from the 26 Node/DOM tests and 6 Playwright journeys.
- Open **Roadmap**, expand **P0**, and check P0.C01 Blocked,
  P0.C02/P0.C03 In review. Switch to DE and check translated state labels.
  Test Lab results must not promote any checkpoint to Verified.
- Return to EN, click **Reset demo** and confirm. Workshop and its entries
  disappear, leaving the two initial businesses and baseline amounts. The
  Test Lab returns to Not run.
- Create another fictional business, then refresh the whole page. Its changes
  disappear again; the app starts with two businesses, Consulting selected and
  English. This is expected memory-only behavior, not durable offline saving.

## 10. Record results without inventing platform evidence

Prepare an ignored copy of the blank result sheet:

```powershell
New-Item -ItemType Directory -Force .\outputs | Out-Null
Copy-Item .\docs\TEST_REPORT_TEMPLATE.md .\outputs\P0_C03_manual.md
```

Fill in actual versions, revision/dirty state, passed/failed/not-run steps and
the first error. `outputs/checks.json` contains the latest automated runner
result; a later run replaces it. Keep separate copies outside source control
if retaining both core and browser reports. Use fictional screenshots only.

For Android, use desktop phone-size emulation for the current interface. The
installed Android app, camera, durable capture queue and paired transfer are
future matrix cases and cannot be marked passed from this build. No LAN/public
server exposure or real account setup is needed for the checks above.

## Troubleshooting

| Symptom | Action |
| --- | --- |
| `package.json` not found | Open PowerShell in the repository root containing that file |
| `npm.ps1` is blocked | Use the documented `npm.cmd` / `npx.cmd` spellings |
| Engine/version error | Use the versions pinned in `.nvmrc` and `package.json`; keep the existing lockfile |
| Port 5173/4173 is busy | Stop your own earlier dev/preview server with Ctrl+C and retry; the ports are intentionally strict |
| Playwright executable missing | Complete `npx.cmd playwright install chromium`, then rerun `check:all` |
| Chromium download/launch fails | Record the error and the blocked browser layer; run `npm.cmd run check` separately for core evidence |
| Changes disappear on refresh | Expected: this prototype stores synthetic records in session memory |

Missing receipts, import, reconciliation, financial export, installed durability
and tax outputs are recorded in the [capability audit](CAPABILITY_AUDIT.md).
Their absence is not a failed implementation test for this checkpoint.
