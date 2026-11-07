// SPDX-License-Identifier: MPL-2.0
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
// @ts-expect-error Small Node-only JS tooling is checked by execution here.
import { validateManifest, checkpointGate } from "../scripts/progress-lib.mjs";

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
test("a checkpoint cannot become verified without explicit evidence", () => {
  const changed = structuredClone(manifest);
  changed.checkpoints[1].status = "verified";
  // Pending review evidence may already exist in the checked-in manifest.
  changed.checkpoints[1].evidence = null;
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
test("P1.C08 required skipped or absent checks and missing manual reviews prevent verification", () => {
  const checkpoint = { requirements: { workspaceMode: "synthetic", fixtureVersion: "synthetic-v1", commands: ["npm run test"], testPrefixes: ["P1.C01"], manual: ["owner-review"] }, evidence: { manualReviews: [] as object[] } };
  const report = { status: "passed", dataMode: "synthetic", fixtureVersion: "synthetic-v1", sourceFingerprint: "fictional-fingerprint", steps: [{ command: "npm run test", status: "passed", exitCode: 0 }], tests: [{ name: "P1.C01 fictional gate fixture", status: "passed" }] };
  const gate = () => checkpointGate(checkpoint, report, "fictional-fingerprint");
  assert.equal(gate().executed, true); assert.equal(gate().verified, false);
  checkpoint.evidence.manualReviews = [{ id: "owner-review", status: "accepted", reviewer: "fictional unit-test reviewer", record: "fictional test fixture", sourceFingerprint: "fictional-fingerprint" }];
  assert.equal(gate().verified, true);
  for (const status of ["skipped", "failed", "not-run", "expected-failure"]) { report.tests[0]!.status = status; assert.equal(gate().verified, false); }
  report.tests = []; assert.equal(gate().verified, false);
  assert.equal(checkpointGate(checkpoint, { ...report, sourceFingerprint: "stale" }, "fictional-fingerprint").executed, false);
});
