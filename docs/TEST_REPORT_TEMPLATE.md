# P0.C03 local test record — blank template

Copy this to ignored `outputs/P0_C03_manual.md` before entering results.
Initial statuses are deliberately **Not run**. Expected outcomes in the guide
are not execution evidence. Use wholly fictional data and screenshots.

| Run context | Observed value |
| --- | --- |
| Date/time and timezone | Not recorded |
| Repository revision (`git rev-parse HEAD`) | Not recorded |
| Working tree (`git status --short`) | Not recorded |
| Checked-source fingerprint from `outputs/checks.json` | Not recorded |
| Windows version / architecture | Not recorded |
| Browser version | Not recorded |
| Node / npm versions | Not recorded |
| Catalog / workspace fixture | `p0-c03-v1` / `synthetic-v1` — confirm used |
| Actual Android model/version, if exercised later | Not recorded; emulation is separate |

| Check | Status | Actual outcome / first error / evidence location |
| --- | --- | --- |
| `npm.cmd ci` | Not run | |
| `npm.cmd run check` — core | Not run | |
| `npx.cmd playwright install chromium` | Not run | |
| `npm.cmd run check:all` — core and browser | Not run | |
| `npm.cmd run progress -- --json` — scope/freshness/counts | Not run | |
| Default businesses and exact EUR/USD totals | Not run | |
| Draft → post → full reversal | Not run | |
| Invalid amounts rejected | Not run | |
| Unsaved forms / business / EN–DE switches | Not run | |
| Keyboard and phone-size layout | Not run | |
| Third business / draft totals / EUR 280.25 / USD 40.10 / isolation | Not run | |
| In-app Test Lab — nine isolated assertions | Not run | |
| Roadmap statuses and EN/DE labels | Not run | |
| Reset/refresh restore two baseline businesses | Not run | |
| Installed Windows offline/restart/recovery | Not run | Not implemented in this build |
| Actual Android capture/camera/restart | Not run | Not implemented in this build |
| Paired transfer / notifications | Not run | Not implemented in this build |

Use Passed, Failed, Blocked or Not run for observed results; retain unavailable
features as Not implemented in the outcome column. A failed/blocked browser run
does not erase a separately recorded core pass. Neither automatically verifies
the roadmap. Record the exact failing command and error when a step fails.

P0.C01 browser evidence, P0.C02 audit acceptance and P0.C03 profile/matrix review
remain independent review decisions. No genuine records are needed.
