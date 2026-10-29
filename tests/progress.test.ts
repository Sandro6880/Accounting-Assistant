// SPDX-License-Identifier: MPL-2.0
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
// @ts-expect-error Small Node-only JS tooling is checked by execution here.
import { validateManifest } from "../scripts/progress-lib.mjs";

const manifest = JSON.parse(
  readFileSync(new URL("../project/checkpoints.json", import.meta.url), "utf8"),
);
const roadmap = readFileSync(new URL("../ROADMAP.md", import.meta.url), "utf8");
test("manifest IDs match the roadmap and no checkpoint is automatically verified", () => {
  validateManifest(manifest, roadmap);
  assert.equal(
    manifest.checkpoints.filter((item: { status: string }) =>
      ["verified", "released"].includes(item.status),
    ).length,
    0,
  );
});
test("a future checkpoint cannot become verified without explicit evidence", () => {
  const changed = structuredClone(manifest);
  changed.checkpoints[1].status = "verified";
  assert.throws(
    () => validateManifest(changed, roadmap),
    /Missing verification evidence/,
  );
});
test("missing IDs and made-up statuses fail validation", () => {
  const changed = structuredClone(manifest);
  changed.checkpoints.pop();
  assert.throws(() => validateManifest(changed, roadmap), /Checkpoint IDs/);
  const invalid = structuredClone(manifest);
  invalid.checkpoints[0].status = "all-green";
  assert.throws(() => validateManifest(invalid, roadmap), /Invalid checkpoint/);
});
