# Ordered categorical commits

The categorized delivery contains 28 incremental ZIPs. Each inner ZIP contains
only files added or overwritten for that commit. Use them in numeric order.
This is the same 0.1.0 application foundation; the commit workflow docs are
updated for this delivery. Source code and the final 24-test suite are unchanged.

## Starting point

Use an existing checkout before the starter source was added. Preserve .git and
existing history. Earlier license/ignore/docs files may already be committed;
review their changes. If the full starter has already been committed, these
packets do not represent new implementation work. Do not remove history to
reapply them. If a packet is identical to tracked files, skip the empty commit.

If the full starter is only uncommitted locally, keep a backup outside the
checkout and apply packets to a fresh clone of your existing remote baseline.
Keep the outer ZIP, inner ZIPs and delivery instructions outside the repository.
Do not extract every packet before beginning the commits.

## One packet, one commit

1. Extract the next inner ZIP into the SAME repository root, merging folders
   and replacing only the files included in that ZIP. Do not replace entire
   source directories or delete unrelated project files.
2. Review the actual diff. Run that stage's available checks, listed in the
   delivery guide. From 17 onward use npm run check. Browser journeys stay a
   separate installed-browser check.
3. Stage ONLY that packet's files. The outer APPLY_IN_ORDER.md contains exact
   git add commands and a suggested message for every category.
4. Inspect git diff --cached --stat and git diff --cached --check. Commit using
   your own configured identity/current timestamp and appropriate attribution.
5. Continue to the next packet. Do not create empty commits to increase counts.

The first packet is repository setup. The runnable React shell begins in 02,
money tests in 03, the accounting UI in 11, and the unified runner in 17. All
pinned dev dependencies are prepared in 02; later packets introduce the matching
test files and commands. Finish all packets before using the final agent handoff.

## Categories

01. Repository foundation and safeguards — `01_repository_foundation.zip`
02. Runnable React/TypeScript build shell — `02_react_typescript_toolchain.zip`
03. Exact money parsing and formatting — `03_exact_money_rules.zip`
04. Generic business and workspace contracts — `04_business_workspace_contracts.zip`
05. Draft creation and balanced posting — `05_draft_posting_lifecycle.zip`
06. Reversals and append-only history guards — `06_reversals_history_guards.zip`
07. Deterministic fictional fixtures — `07_synthetic_sample_workspaces.zip`
08. Memory storage and immutable snapshots — `08_memory_repository.zip`
09. Application use cases and injected services — `09_application_use_cases.zip`
10. English/German resources and view context — `10_bilingual_ui_contracts.zip`
11. Accounting overview and contextual app shell — `11_overview_and_context_shell.zip`
12. Entry forms, posting actions and journal view — `12_entries_and_journal_ui.zip`
13. Generic business creation interface — `13_business_management_ui.zip`
14. Responsive layout and visual styling — `14_responsive_visual_design.zip`
15. Roadmap and stable checkpoint manifest — `15_roadmap_checkpoint_manifest.zip`
16. Progress CLI and evidence validation — `16_progress_cli_validation.zip`
17. Unified local verification runner — `17_unified_local_check_runner.zip`
18. Executable in-app Test Lab — `18_browser_test_lab.zip`
19. Roadmap view in the application — `19_roadmap_progress_view.zip`
20. React DOM interaction regressions — `20_react_interaction_regressions.zip`
21. Playwright browser journeys and extended checks — `21_playwright_browser_journeys.zip`
22. Security policy and production boundaries — `22_security_policy.zip`
23. Recorded architecture decisions — `23_architecture_decisions.zip`
24. Cross-platform continuous integration — `24_continuous_integration.zip`
25. Agent working instructions — `25_agent_working_contract.zip`
26. Agent handoff and bounded next task — `26_agent_handoff_task.zip`
27. Verification record and known limits — `27_verification_record.zip`
28. Complete README and categorical commit guide — `28_readme_and_commit_guide.zip`

## Final checks

With Node.js 24.22.1, run npm ci, npm run check and npm run progress. The final
core suite has 24 Node/DOM tests. For native browser journeys install Chromium
and run npm run check:all. The browser launch was blocked in the preparation
environment and is not claimed passed. A passing suite never automatically
verifies the full 92-checkpoint roadmap. All development data stays fictional.
