# Security and development data policy

This is a development policy and target design. The repository's current baseline must be inspected before any control is described as implemented. It is not approved for genuine financial records during development.

## Data boundary

Use wholly fictional records for tests, demos, screenshots, issues and AI work. Do not use anonymized real documents, live bank exports, private contracts or actual customer records. Keep databases and evidence outside source control, with isolated temporary stores for each test run. An ignored file can still be exposed through a prompt, log or source archive.

Seed/reset commands must check both an explicit synthetic-workspace marker and a permitted destination. They reject production or ambiguous paths and never discover a real folder automatically. Fixtures use fixed seeds and clocks where needed. A demo label on a screen does not enforce isolation.

Any later genuine-record workspace is a protected local production installation outside AI access. Activation waits for accepted completion of the agreed release and verified security/recovery gates. Every automated test remains synthetic afterwards.

## Local access target

Require a local passphrase or supported OS-protected authenticator before private production access. Start locked, support manual and idle locking and enforce guards on records, evidence and commands. Sensitive exports, restore activation and changes to recovery or trusted devices require re-verification. These controls need locked-state bypass tests with fictional data.

Password verification, data encryption and backup recovery are separate designs. If storing a password verifier, use a maintained salted password-hashing implementation such as Argon2id; never store plaintext passwords. Protect vault keys and backups with maintained cryptography and a tested recovery process. A password change or failed recovery must not silently delete existing data. Exact algorithms, parameters and timeout settings require a documented implementation decision.

Local controls cannot guarantee protection against a compromised operating system or unrestricted database editing. State that threat boundary accurately. A cosmetic password dialog does not encrypt the database or establish online identity.

## Future online access target

Use a verified server identity boundary, business-scoped authorization on every sensitive operation, secure transport, protected sessions, expiry and revocation. Plan passkeys or MFA and reauthentication for sensitive account/device changes. Test cross-owner downloads, expired sessions, spoofed identity, logout and revocation with fictional tenants.

Portable loopback test identity must be rejected by internet-facing operation. Browser-supplied identity headers and hidden menu items cannot authorize access. Never put service secrets in frontend bundles. Keep personal records out of AI work even if an eventual online product supports them elsewhere.

## Evidence and export controls

Validate file type/signature, size and ownership; preserve originals; treat extracted text as untrusted input. Receipt validation is not malware scanning. Keep evidence private, limit downloads and review any document processing before activation. Review CSV formula handling, logs, error payloads and support exports. Only fictional or reviewed minimal summaries may be shared in development artifacts.

## Repository preparation

Keep real `.env` files, tokens, passwords, keys, databases, receipts, contracts, exports and backups out of source and its history. `.env.example` and allowlisted `.env` or `.dev.vars` examples/templates contain placeholders/comments only; their filenames do not sanitize their contents.

Use the supplied [.gitignore](.gitignore), merging any existing project-specific rules. It supersedes the earlier additions-only checklist. [GITIGNORE_SETUP.md](GITIGNORE_SETUP.md) describes reserved local-data folders, review commands and the distinction between ignored paths and committed history. Keep real records outside the source checkout whenever possible. Fictional documents belong in `tests/fixtures/`; local database binaries and signing keys remain excluded even there. Keep the active lockfile, migrations, tests and source configuration under version control, and review that configuration for credentials.

Ignore rules are a convenience for untracked paths. They do not remove existing tracked files or historical copies, inspect file contents, prevent a forced add, encrypt files or provide a backup. Local data protection, access verification and recovery must be implemented and tested separately.

Inspect tracked content, historical refs and source archives before public submission. A clean working tree or ignore rule does not prove clean history. If a credential was exposed, revoke/rotate it first and coordinate remediation. Preserve genuine authorship and history except where a justified security cleanup is necessary; confirm submission implications with the relevant project operator. Do not rewrite history merely to conceal project origins.

## Reporting a vulnerability

Do not post secrets, genuine records or a live exploit payload in a public issue. Use the repository's private vulnerability reporting if enabled; otherwise request a private contact channel from the maintainer without including sensitive material. Describe the issue using a minimal synthetic reproduction.

## Verification requirements

- Wrong password, idle lock and restart keep protected operations inaccessible.
- Direct record/file routes enforce the same access rules as the interface.
- Wrong owner/business, expired session and revoked device access fail.
- Failed writes, restore and key recovery preserve a recoverable archive.
- Test seed/reset and migration checks reject production or ambiguous destinations.
- Results identify revision, fixture and executed layer; blocked or not-run checks stay visible.
- No real data or credentials appear in fixtures, logs, screenshots or reports.

## Primary references

- [OWASP authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html)
- [OWASP cryptographic storage](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [OWASP session management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [GitHub sensitive-data remediation](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

References checked 29 October 2026. Recheck them when implementing the relevant control.
