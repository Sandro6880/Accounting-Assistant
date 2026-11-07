# Third-party and source notice register

## 0.2.0 desktop additions

Electron **45.2.3** (MIT) and @electron/packager **20.3.0** (BSD-2-Clause) are pinned
development dependencies in the active npm lockfile. The desktop package retains
Electron's upstream LICENSE and Chromium license notices. The application
resources include the unchanged MPL-2.0 project license, this register, and the
installed React/React DOM/scheduler/Vite license texts for bundled/runtime helpers.
Node's built-in SQLite and cryptography are part of the Electron runtime; preserve
its bundled upstream notices. No new artwork, fonts or proprietary SDKs were added.
The source ZIP excludes downloaded runtimes; the separate Windows test ZIP
includes the Electron runtime. Full target/transitive rights and independent
security/privacy acceptance remain pending; this is not a compatibility opinion.

The inventory/counts below describe the original P0.C07 source review, not the
expanded dependency tree in 0.2.0. Consult the current lockfile and actual package
contents for the delivery's dependency versions and notices.

This source packet retains the unchanged MPL-2.0 [LICENSE](LICENSE). Existing
SPDX notices and genuine attribution remain. This register does not assert new
copyright ownership or replace dependency licenses. It is a bounded P0.C07
inventory, with open questions in [the review](docs/REPOSITORY_REVIEW.md).

| Input | Recorded provenance / terms | Remaining review |
| --- | --- | --- |
| Project source | Existing MPL-2.0 notices and standard LICENSE | Owner confirmation of contribution rights/agreements |
| Root npm dependencies | Exact package-lock.json; 156 dependency metadata entries, excluding root with declared licenses | Installed/bundled distributions and full applicable notices before release |
| Probe npm dependencies | Exact spikes/p0-c05/package-lock.json; 55 dependency metadata entries, excluding root | Same target-distribution review |
| tauri 2.12.5 / tauri-build 2.7.4 | Official version metadata declares Apache-2.0 OR MIT; checksum matches Cargo.lock | Preserve upstream notices/license choices for actual distribution |
| tauri-plugin-fs 2.7.1 / tauri-plugin-notification 2.8.0 | Official metadata declares Apache-2.0 OR MIT; checksum matches lock | Same release review |
| Other 449 native registry dependencies | Names/versions/checksums in Cargo.lock | Their license texts and actual target contents not independently reviewed |
| Probe icon source SVG | Tracked simple geometric receipt-like shapes, existing MPL notice | Owner provenance confirmation; not a third-party logo attribution claim |
| Generated PNG/ICO/ICNS/mobile icon family | Pinned Tauri tooling; current files and unique binary blob hashes inventoried | Binary variants not all visually/OCR inspected |
| Generated Android launcher XML pair | Tauri generator output; exact paths in review | Confirm upstream template terms; no speculative SPDX header added |
| CI GitHub actions | checkout@v7 / setup-node@v7 external references | Mutable tags, external source and action dependencies outside full audit |

No downloaded dependency trees, compiled applications, SDK/runtime distributions,
fonts or additional vendor assets are included in the source ZIP. Lock metadata
is not a complete target SBOM or legal compatibility decision. Before distributing
an executable, review the actual target contents and retain their notices and
corresponding source information where required.

Official references:
[Mozilla text](https://www.mozilla.org/media/MPL/2.0/index.txt) and
[FAQ](https://www.mozilla.org/en-US/MPL/2.0/FAQ/).
Exact native metadata URLs and locked checksums are in
[project/repository-review.json](project/repository-review.json).
