# Agent working instructions

Read README.md, ROADMAP.md, SECURITY.md and docs/ARCHITECTURE.md first.

- Use wholly fictional data for every test, demo, screenshot and prompt.
  Never inspect real document folders, accounts, databases or credential stores.
- Run `npm ci` and `npm run check` to establish the current state. Browser
  journeys also need `npx playwright install chromium` and `npm run check:all`.
  Report blocked installation or test steps accurately.
- Select one bounded roadmap slice with ready dependencies. State its stable
  IDs, acceptance behavior and relevant checks. Preserve all 92 IDs.
- Keep rules in src/domain and use cases in src/application. Views call the
  application boundary for writes. Business IDs stay explicit and generic.
- Preserve exact bigint cents, original currencies and immutable posted facts.
  Never sum unvalued USD into EUR. Corrections append linked entries.
- Add meaningful regressions for changed money, posting, scope or persistence.
  UI labels and validation belong in the English/German translation layer.
- Keep this starter synthetic-only. Do not add cosmetic password/encryption
  claims or describe memory as durable offline storage. New adapters require
  explicit decisions, transaction semantics and recovery/security checks.
- Run `npm run progress` separately from interpreting test counts. Do not mark
  a checkpoint verified only because tests pass. Record revision, commands,
  required reviews and limitations. The current validator checks evidence
  structure, not its truth; strengthening P1.C08 remains future work.
- Preserve MPL-2.0 notices, dependency attribution and the active npm lockfile.
  Keep generated output, genuine records and secrets outside source control.
- Keep genuine history, authorship and timestamps. No fabricated results,
  deployment, account connection or government transmission is part of a
  starter task.

Finish with changed behavior, checks actually run, known gaps and the next
small step. Update documentation when behavior or architecture changes.
