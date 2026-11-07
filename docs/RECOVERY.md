# Synthetic vault backup and recovery

This is a test-build design, not authorization for genuine financial records.
No server, account recovery or cloud key escrow exists. Losing the workspace
passphrase requires a usable independent encrypted backup and its passphrase;
losing both is unrecoverable through this application.

## Backup

Unlock, open Local vault, and supply the current workspace passphrase plus a
separate backup passphrase (12–256 characters). Choose a **new** file ending
`.synthetic-backup`, outside the workspace folder. Existing files are never
overwritten. Keep more than one generation; copy a complete backup to an
independent device. A pre-migration copy on the same disk is not independent.

The export reads one consistent SQLite transaction containing the structured
snapshot, journal/audit/command receipts, ownership/profile versions, and every
original attachment with size and SHA-256. It encrypts that logical inventory
with a new salt/key/nonce and authenticates it. No plaintext export file or
workspace encryption key is written. An interrupted/failed export must not be
counted as a backup; retain prior generations and use a new filename to retry.

## Restore without replacing the original

Lock the application. Expand Restore into a new workspace, supply the backup
passphrase and a new workspace passphrase, then select the backup and a **new**
folder name ending `.synthetic-vault`. Do not create that folder first.
Wrong keys, modified ciphertext, invalid schema, broken links or mismatched
original-file hashes fail before activation. The restore builds a sibling
temporary synthetic vault, reads it back, checks state and files, then activates
the new folder. It never intentionally overwrites the original or the backup.
The selected restored path is remembered for the next launch.

Unlock with the **new workspace** passphrase. Compare business IDs, entries,
posted EUR/USD totals, journal/audit, profile history, file counts and hashes.
Read representative TXT originals. Keep the original and backup until independent
review has accepted the recovery. Never delete a damaged vault to make a test pass.

## Migration / interrupted writes

SQLite uses WAL, synchronous FULL and explicit transactions. Financial state
and its idempotency receipt commit together. A failed transaction cannot be
acknowledged as saved. Unsupported database/schema versions are rejected. The
only supported data migration is the deterministic synthetic v0-to-v1 additive
ownership migration. Before it, SQLite creates a consistent encrypted-content
`pre-migration-*.sqlite` recovery copy; a migration failure rolls back the update.
Keep the marker, database and recovery copies. Do not copy a live database alone
without its WAL or use a production database as a test fixture.

A local ciphertext recovery copy still needs the original passphrase. If you
need to inspect/recover it, make a complete independent copy of the closed
synthetic workspace first and use a compatible application in a separate folder.
There is no destructive automatic rollback/update mechanism or signed updater.

## Cryptographic and access boundary

Node's maintained scrypt derives a 256-bit key with a random 32-byte salt,
N=32768, r=8, p=1. AES-256-GCM uses random 12-byte nonces, 16-byte authentication
tags and fixed purpose-specific authenticated data. Backup keys are derived
independently and not saved. The workspace key stays in the Electron main
process and its Buffer is overwritten on lock/close; JavaScript strings and OS
memory are not guaranteed forensic erasure. No raw key/password is stored on disk.

SQLite table structure, revision numbers, ciphertext sizes and opaque attachment
IDs are visible; this is not whole-file SQLCipher encryption. The threat boundary
does not include an administrator/malware-controlled operating system, screen
capture, modified application code or all filesystem races. A person with the
workspace passphrase can access all of its fictional businesses. Business scope
guards prevent reference mistakes; they are not a multi-tenant identity service.

The renderer has no Node access, uses context isolation and a sandbox, blocks
remote requests/navigation/permissions and exposes a fixed IPC command set.
Only the trusted main frame can use it. Lock/timeout/restart deny record/file
commands. Backup export requires reauthentication; recovery requires the backup
key and a new destination. PDF/image originals are stored without rendering.
Independent security and physical Windows recovery review are still required.
