# P0.C04 — accounting and VAT scope

Prepared on **31 October 2026** from the owner's checkpoint 3 commit
`ca8e73d876c881b8631e20b5e6ff212c62e1b2f2`, input tree
`72c1468e9b5080172e85e088a99caf1fce94e3bb`. The source inventory is
[project/accounting-scope.json](../project/accounting-scope.json), version
**p0-c04-v1**, with fictional cases for **2026** and source-check dates.

P0.C04 defines scope and reference cases. It does not implement a VAT classifier,
change any business's VAT status, calculate tax or generate a government file.
All current demo profiles remain unconfirmed. Hypothetical reviewed statuses in
the inventory are invented case assumptions, not live registration/UID checks.

## Selected accounting method

The initial target is ordinary Austrian **Einnahmen-Ausgaben-Rechnung with
actual reviewed business expenses**, for an eligible fictional natural-person
sole trader. E/A follows cash receipts/payments, with statutory exceptions such
as asset treatment needing separate support. [AT-EA]

| Project decision | Initial scope and boundary |
| --- | --- |
| Method | `at-ea-actual-v1`; actual expenses, not a flat-rate deduction method |
| Recognition | Require payment evidence and legally relevant financial dates; current entry date/Posted status alone is insufficient |
| Regular-VAT hypothesis | Explicit net-method selection and reviewed eligibility; VAT handling stays separate from E/A profit [AT-NET-GROSS] |
| Domestic-exempt hypothesis | Gross bookkeeping and non-deductible input VAT in otherwise eligible costs [AT-EA, AT-SME] |
| Unknown profile | No method/VAT assumption and no tax-final result |
| Original currencies | Keep EUR/USD separate; missing purpose-specific EUR valuation leaves reporting incomplete |
| Initially bounded cases | Ordinary one-off services and operating costs; asset, payroll, stock, private allocation, allowance and recurring year-boundary rules need later work |

These are implementation-scope choices, not a selection for the owner's actual
business. No income-tax/input-VAT pauschalization or full company accounts are
introduced. Later deductions/assets and complete records remain prerequisites
for an annual output; exclusions here do not waive their legal relevance.

A fictional one-off invoice dated 10 December 2025, paid on 20 January 2026,
illustrates the selected payment-year principle. Exceptions are expressly
excluded from that example. Its VAT period must be determined independently;
the app must not infer VAT timing from an E/A year or a bank settlement rate.

## What the inventory supports

“Candidate” means a branch is included for later rule implementation/review.
“Unresolved” requires missing evidence. “Deferred” is outside this initial
service-case scope. **None means an implemented or tax-validated capability.**
Every case has `taxFinalOutputAllowed: false`; runtime/export flags are disabled.

The three hypothetical contexts are unconfirmed, regular/net and domestic
exempt/gross. They are separate from UID, OSS and foreign EX-scheme facts.
Positive service cases assume the relevant establishment/evidence and no
unmodelled exception; uncertain facts do not inherit those assumptions.

| Case ID | Disposition | Fictional case / expected reference branch | Sources |
| --- | --- | --- | --- |
| UNKNOWN-PROFILE | Unresolved | AT profile unconfirmed; no presumed exemption | AT-SME |
| UNKNOWN-EU-CUSTOMER | Unresolved | Customer business proof missing; no presumed reverse charge | AT-SERVICES |
| AT-DOM-REG | Candidate | Ordinary AT software service, regular profile; standard 20% reference | AT-RATE |
| AT-DOM-EXEMPT | Candidate | Confirmed domestic exemption hypothesis; distinct from zero-rating; no input deduction | AT-SME |
| EU-B2B-REG | Candidate | General-rule service to evidenced DE business: DE place, EU recipient liability and outgoing ZM branch | AT-SERVICES, AT-ZM |
| EU-B2B-EXEMPT | Candidate | Same EU service branch under the domestic-exempt supplier hypothesis | AT-ZM, AT-SME |
| EU-DIGITAL-BELOW | Candidate | Direct automated software, qualifying threshold conditions/no destination option: AT place | AT-TBE, EU-OSS |
| EU-DIGITAL-ABOVE | Candidate | Transaction after threshold exceedance: DE place; assumed OSS registration; foreign rate unmapped | EU-OSS |
| EU-DIGITAL-OPTION | Candidate | Effective destination election despite low turnover: DE place; assumed OSS registration | EU-OSS |
| EU-DIGITAL-UNKNOWN | Unresolved | Location/history/election facts missing; no threshold fallback | AT-TBE |
| NON-EU-B2B | Candidate | Evidenced US business recipient: non-AT place, no EU ZM; foreign tax remains unassessed | AT-SERVICES, AT-ZM |
| NON-EU-DIGITAL | Candidate | Direct automated service to evidenced US consumer: foreign place; foreign-tax review remains separate | AT-TBE |
| INCOMING-EU-EXEMPT | Candidate | Foreign cloud service to AT exempt business: recipient-liability branch; assumed exemption prevents input deduction | AT-RC, AT-SME |
| INCOMING-NON-EU-REG | Candidate | Foreign cloud service to AT regular business: recipient-liability branch; deduction needs proof/timing | AT-RC |
| PLATFORM-ROLE-UNKNOWN | Unresolved | Supplier-of-record contract unknown; no assumed platform responsibility | AT-TBE |
| FOREIGN-EX-SCHEME | Deferred | Foreign exemption needs its own country/registration/eligibility review | AT-EX |
| SPECIAL-PLACE | Deferred | Property-related service cannot inherit the general B2B branch | AT-SERVICES |
| PHYSICAL-GOODS | Deferred | Goods/import/transport inventory is not supplied by these service cases | Project scope |

An electronically supplied service is essentially automated; a person delivering
bespoke work over email/video does not become a digital-service case merely
because the communication is online. [EU-DIGITAL] Incoming reverse charge and
input deduction are separate decisions; a domestic exemption cannot be used
as a universal “no VAT obligation” flag. [AT-RC, AT-SME]

### Keep the three turnover questions separate

| Question | Source-backed reference | Implementation boundary |
| --- | --- | --- |
| AT domestic small-business exemption | EUR 55,000 domestic threshold rules with current/prior-year relevance [AT-SME] | Eligibility is assumed reviewed only in fictional positive cases; turnover exclusions, tolerances, waivers and effective dates are not calculated |
| EU consumer TBE/distance-sales place | EUR 10,000 excluding VAT, combined relevant supplies, current and preceding years, qualifying single establishment and election facts [EU-OSS] | The case data supplies those facts explicitly; no live threshold/election engine exists |
| Foreign EU small-business EX exemption | Separate notification, EU-wide EUR 100,000 test and destination-country conditions [AT-EX] | Deferred; neither a UID nor AT exemption automatically activates it |

The EU consumer cases are direct supplies. Platform responsibility, goods/IOSS,
special service exceptions, foreign rates/registrations and country tax advice
are not silently inferred. Future P6A/P8/P9 mappings must verify their own
profile, rule interval, evidence, valuation and reporting scope.

## First report/year adapter target

| Field | Selected value / actual readiness |
| --- | --- |
| Target ID | `AT-E1A-2026-preparation` |
| Form / tax year | E1a / 2026, business-income preparation contract |
| Parent return | E1; business preparation alone is not the complete personal return |
| Implementation | Selected target, not implemented |
| Official 2026 artifact | **Not verified**; this is not a claim that it does not exist |
| Observed published reference | BMF E1a **2025** listing, used only as background [AT-FORM-2025] |
| Field mapping / schema | Not reviewed / not implemented; 2025 fields cannot be relabelled as 2026 |
| Output / transmission | Disabled / disabled |
| Other adapters | E1a-K, UVA, ZM, OSS and EX need their own reviewed mappings |

The project chooses 2026 to match its fictional scenarios. Before P9 can enable
an official-format slice, it needs the matching official form/year, reviewed
mapping, complete supported records/deductions/assets and EUR valuations, plus
the required validation. E1a is a business-income attachment; salary/personal
inputs and complete E1 preparation remain separate. [AT-EA, AT-FORM-2025]

## Official source register

Checked on **31 October 2026**. URLs and IDs also live in the JSON inventory.
The review uses these official guidance/reference pages; it is not an exhaustive
statutory consolidation or adviser sign-off. The original 2011 EU regulation
link is used for Article 7's definition, alongside current Austrian guidance.
The 2025 form listing is explicitly not evidence of a 2026 artifact.

| ID | Source | Publisher |
| --- | --- | --- |
| AT-EA | [Einnahmen-Ausgaben-Rechnung](https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/einnahmen-ausgaben-rechnung.html) | USP / Austrian Ministry of Finance |
| AT-NET-GROSS | [Pauschalierung overview — net/gross distinction only](https://www.usp.gv.at/themen/steuern-finanzen/steuerliche-gewinnermittlung/weitere-informationen-zur-steuerlichen-gewinnermittlung/pauschalierung-weitere-infos/est-pauschalierung-ueberblick.html) | USP / Austrian Ministry of Finance |
| AT-SME | [Kleinunternehmen — rules from 2025](https://www.usp.gv.at/themen/steuern-finanzen/umsatzsteuer-ueberblick/weitere-informationen-zur-umsatzsteuer/weitere-steuertatbestaende-und-befreiungen/kleinunternehmen.html) | USP / Austrian Ministry of Finance |
| AT-SERVICES | [Grenzueberschreitende Dienstleistungen](https://www.usp.gv.at/themen/steuern-finanzen/umsatzsteuer-ueberblick/weitere-informationen-zur-umsatzsteuer/umsaetze-mit-auslandsbezug/grenzueberschreitende-dienstleistungen.html) | USP / Austrian Ministry of Finance |
| AT-ZM | [Zusammenfassende Meldung](https://www.usp.gv.at/themen/steuern-finanzen/umsatzsteuer-ueberblick/weitere-informationen-zur-umsatzsteuer/umsaetze-mit-auslandsbezug/zusammenfassende-meldung-zm.html) | USP / Austrian Ministry of Finance |
| AT-TBE | [Electronically supplied services](https://www.usp.gv.at/themen/steuern-finanzen/umsatzsteuer-ueberblick/weitere-informationen-zur-umsatzsteuer/umsaetze-mit-auslandsbezug/grenzueberschreitende-dienstleistungen/elektronisch-erbrachte-dienstleistungen_telekommunikations_rundfunk--und-fernsehdienstleistungen.html) | USP / Austrian Ministry of Finance |
| EU-OSS | [One Stop Shop — destination and EUR 10000 threshold](https://vat-one-stop-shop.ec.europa.eu/one-stop-shop_en) | European Commission |
| EU-DIGITAL | [Implementing Regulation 282/2011, Article 7 definition](https://eur-lex.europa.eu/eli/reg/2011/282/oj) | EUR-Lex / Council |
| AT-RC | [Reverse Charge System](https://www.usp.gv.at/themen/steuern-finanzen/umsatzsteuer-ueberblick/weitere-informationen-zur-umsatzsteuer/umsaetze-mit-auslandsbezug/reverse-charge.html) | USP / Austrian Ministry of Finance |
| AT-RATE | [VAT rates and exemptions](https://www.usp.gv.at/themen/steuern-finanzen/umsatzsteuer-ueberblick/steuersaetze-und-steuerbefreiungen-der-umsatzsteuer.html) | USP / Austrian Ministry of Finance |
| AT-EX | [Small-business exemption in other EU Member States](https://www.usp.gv.at/themen/steuern-finanzen/umsatzsteuer-ueberblick/weitere-informationen-zur-umsatzsteuer/weitere-steuertatbestaende-und-befreiungen/kleinunternehmerbefreiung-in-anderen-mitgliedstaaten.html) | USP / Austrian Ministry of Finance |
| AT-FORM-2025 | [Published E1a 2025 listing — reference only](https://service.bmf.gv.at/service/anwend/formulare/show_det.asp?MIdVal=46795&STyp=&Typ=SD&s=E1) | Austrian Ministry of Finance |

## Evidence, feedback and checks

The owner reported **“it works”** after P0.C03. No exact command list, browser
report or device matrix accompanied that confirmation, so it is recorded as
scope-unspecified feedback in [VERIFICATION.md](VERIFICATION.md). The earlier
checkpoint records are retained; continuation does not invent run evidence.

The clean input reproduced all **26** existing Node/DOM tests, typecheck, build
and 92-ID manifest validation after `npm ci`. Final packet checks:

| Check | Observed result |
| --- | --- |
| `npm run check` | Exit 0: 26 tests passed, no failures/skips; typecheck, build and all 92 IDs passed |
| `npm run progress -- --json` | Exit 0: fresh core evidence, 1 blocked / 3 in review / 88 planned, none verified |
| Catalog integrity | 18 distinct cases and 12 source IDs resolve; coverage complete; 11 candidate / 4 unresolved / 3 deferred; all tax-final/output flags disabled |
| Scope comparison | Only P0.C04's checkpoint record changes; earlier records, financial code, default fixtures, tests, scripts, dependencies and license remain unchanged |
| Local document links and diff | Resolve / pass |
| Tax-engine, native-browser and device execution | Not run or claimed; no tax engine was implemented |

The final run records base `ca8e73d876c881b8631e20b5e6ff212c62e1b2f2` with
`gitDirty: true`, core scope and checked-source fingerprint
`822f5e9949dfb89d13d6de2532caf4e8fa6657fa41f95044da68a8a20615590c`.
The fingerprint covers configured code/manifest inputs, not legal truth or
this document. Catalog checks establish structural consistency and disabled
outputs; they do not execute tax decisions or establish legal correctness.
Generated reports remain ignored, and no checkpoint is promoted by test counts.

To inspect this definition packet locally:

```powershell
npm.cmd ci
npm.cmd run check
npm.cmd run progress -- --json
npm.cmd run dev
```

Review this document and the JSON side by side. Roadmap should show P0.C04 In
review, with earlier states retained; the unchanged demo still shows VAT
unconfirmed and no tax output. The [local guide](LOCAL_TESTING.md) remains the
current-app checklist. No new VAT calculator test is claimed from a static case.

P0.C04 remains **In review**. The next checkpoint is **P0.C05**, the measured
Windows/Android platform spike; it has not been started.
