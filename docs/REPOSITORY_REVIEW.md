# P0.C07 — bounded repository review

Status: **In review**. Review/reissue date: **1 November 2026**.
Repository: https://github.com/Sandro6880/Accounting-Assistant
Inspected checkpoint 5 revision: `cca3fb7b4a9efc0373ff02c11e2e59415651cba7`; tree `49a515eb64d3a10c62c8574d11d843e5bd4a2fdc`.

This is a fresh source/history inspection for a replacement C06+C07 download.
The previous combined ZIP/worktree is unavailable and no byte-identical recovery
is claimed. No history was rewritten, no identity invented, no commit/push made.
The detailed sanitized [inventory](../project/repository-review.json) records
input hashes, paths, commit parents/dates and unresolved questions. Git email
values are classified and hashed rather than reproduced.

## Actual inspected boundary

- Non-shallow Git history: **14 reachable commits**, one advertised
  `main` head at the revision above, no advertised tags.
- **134 tracked input files**, all regular mode 100644;
  **134 distinct historical paths**.
- **177 unique reachable blobs**:
  **132 UTF-8 texts inspected by bounded credential patterns**
  and **45 binary blobs hashed/inventoried**.
  Current binary files: **50** generated icon variants.
- Enumerated all available refs/commits and each tree with Git; read unique
  reachable blobs. Hidden/deleted remote refs, forks and caches are excluded.
- Pre-edit full fsck reported one unreachable blob
  `ef31b3e5ff1ab7cfa270a8645c20d90e3cfbe6ab` (11,117 bytes). Its content was
  not reviewed, deleted or exported. Later index writes can create more objects.

## Genuine history and identity

The recorded author label is Sandro6880; committer labels include Sandro6880 and
GitHub. These are Git metadata, not verified personal identity or contribution
rights. Local signature markers include two `E` (could not be checked locally)
and twelve `N` (unsigned). An uncheckable signature is not a claim of invalidity.
The supplied source/patch does not manufacture Git history or signed commits.

## License and source notices

`LICENSE` is unchanged and byte-identical to the official Mozilla MPL-2.0 text.
SHA-256: `3f3d9e0024b1921b067d6f7f88deb4a60cbe7a78e76c64e3f1d7fc3b779b9d04`.
One license blob occurs in 13 reachable revisions. It first appears at
`4e723a6d7829189b898ac7a434d735646a6fef70`; the preceding root commit had no
LICENSE file. No extra noncommercial restriction or speculative copyright
ownership was added. Preserve the standard text and existing attribution.

The source-extension notice inspection found two generated Android XML files
without SPDX identifiers:

- `spikes/p0-c05/src-tauri/icons/android/mipmap-anydpi-v26/ic_launcher.xml`
- `spikes/p0-c05/src-tauri/icons/android/values/ic_launcher_background.xml`

Their template provenance/terms remain open; this packet does not stamp an
unverified license onto them. The tracked geometric source SVG and generated
binary family are registered below; hashing is not proof of asset ownership.

## Third-party dependency scope

Root/probe npm lock metadata inventories contain 156/55 dependency entries (excluding their root entries) and none lacks a
declared license field. Declarations include several licenses; this is not a
claim that every dependency is MIT or that all compatibility obligations passed.
Four direct native crates were checked against official crates.io version
metadata and matching locked checksums: tauri 2.12.5, tauri-build 2.7.4,
tauri-plugin-fs 2.7.1 and tauri-plugin-notification 2.8.0. Each declares
`Apache-2.0 OR MIT`.

Cargo.lock contains 453 registry dependencies (454 packages including the root).
The other 449 native transitive license texts and target binary contents were
not independently reviewed. No binary release or complete SBOM/legal clearance
is supplied. CI uses actions/checkout@v7 and actions/setup-node@v7; these mutable
references and their external implementations were not fully audited.

See [THIRD_PARTY_NOTICES.md](../THIRD_PARTY_NOTICES.md) and the exact lockfiles.

## Source/artifact privacy checks

Defined detectors cover private-key headers, common GitHub/AWS/Google/Stripe key
shapes, credential-bearing URLs and quoted sensitive literal assignments.
Matches export only rule/path/line information, never matched values.
There were zero matches in the inspected reachable UTF-8 blobs; all seven
wholly fictional positive controls passed. Reserved private-file path checks
found no tracked/historical matches; eleven fictional ignore-rule checks passed.
The tracked `.env.example` is comments only. No real document folders, accounts,
private agreements or credential stores were accessed.

This is not entropy/obfuscation detection, binary OCR, malware scanning or an
exhaustive privacy certification. Generated icons were inventoried and hashed;
not all variants were individually rendered/inspected. A filename or marker
does not prove safe content or authentication.

The available rebuilt C5 ZIP (483,102 bytes, 136 members) was checked for CRC,
member paths and the same bounded patterns; no matches/excluded paths appeared.
Its SHA-256 is
`20588b7bceb54a7e845c6d5e701ffd00a7b1fb6f00ff89ac34d0ebfaead85536`.
Earlier C4/C5/C6 and the former combined ZIP are unavailable and were not audited
as though recovered. New replacement files get independent member/digest/CRC
and clean-base patch application checks, recorded in their delivery manifest.

## Open decisions and safe next action

| Item | Remaining question |
| --- | --- |
| RIGHTS-01 | Owner confirmation of contribution rights and applicable agreements is still required; no private agreement inspected. |
| DEPS-01 | Review native transitive license texts and target binary contents before a binary release. |
| ASSET-01 | Confirm terms/provenance of the two generated Android XML templates; no speculative license header applied. |
| IDENTITY-01 | Git labels are not identity proof. Local signature markers include uncheckable and unsigned commits. |
| ARTIFACT-01 | Missing archives, hidden/deleted refs, forks, caches and external action code remain outside inspected scope. |
| OBJECT-01 | One pre-edit unreachable blob is inventoried but its content is outside this reachable-history review. |
| RELEASE-01 | Browser, actual-device, recovery, security and tax/legal acceptance gates remain open. |

P0.C07 remains In review. No clean-history/rights/privacy certification follows
from these scans. The next roadmap checkpoint is P1.C01, gated by acceptance or
a later explicit bounded owner continuation. P0.C01 browser and P0.C05 actual
native-device evidence remain blocked, and no real-data activation is supplied.

## Primary references checked

- [Standard MPL-2.0 text](https://www.mozilla.org/media/MPL/2.0/index.txt)
- [Mozilla MPL FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/)
- Direct native version metadata URLs/checksums: the machine-readable inventory.

The license comparison and metadata inventories are factual bounded checks,
not an opinion on private agreements or a replacement for remaining review.
