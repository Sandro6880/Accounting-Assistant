# Verification record — 0.1.0

Observed preparation runtime: Linux, Node 24.22.1, npm 11.9.0.

- Clean npm ci installation: passed.
- Strict type check: passed.
- Automated Node suite: 24 passed with wholly fictional records. It includes
  exact-money, scope, posting/reversal, append-only history, progress validation
  and three React DOM interaction tests.
- Vite production build: passed.
- Manifest validation: passed, 17 phases / 92 stable IDs.
- Playwright journeys: blocked before interaction. The browser download endpoint
  returned an unavailable HTML page; an alternative Chromium executable also
  failed to launch in this environment. The attempted extended run returned
  nonzero. None of its six desktop/mobile-emulation journeys is claimed passed.

Run npm ci and npm run check on the actual checkout. For browser journeys,
install Chromium and run npm run check:all. DOM tests validate React state and
handlers; they do not validate rendering, native browser APIs or device behavior.

P0.C01 remains in progress; no roadmap checkpoint is verified. No hosted GitHub
CI run, Windows installation or actual Android device was certified. The
workflow is supplied for execution in the repository. The archive has no history.

The runner writes actual commands, exit codes, durations, runtime, revision/dirty
state when available, and a checked-source fingerprint to ignored
outputs/checks.json. Its core and browser scopes are distinct. Missing or failed
browser steps never become passes. Progress flags stale checked source.

No genuine data, passwords, encryption, durable storage, receipt archive,
backup recovery, legal mapping or government transmission was enabled/tested.
