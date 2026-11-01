// SPDX-License-Identifier: MPL-2.0
import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { root, fingerprint } from "./fingerprint.mjs";
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error("Start with npm run spike:check from the repository root");
const repository = fileURLToPath(new URL("../../../", import.meta.url));
const git = (args) => spawnSync("git", args, { cwd: repository, encoding: "utf8" });
const rev = git(["rev-parse", "HEAD"]); const dirty = git(["status", "--porcelain"]);
const report = {
  schemaVersion: 1, checkpointId: "P0.C05", dataMode: "synthetic", fixtureVersion: "p0-c05-v1", scope: "portable-probe-only", node: process.version,
  revision: rev.status === 0 ? rev.stdout.trim() : null, gitDirty: dirty.status === 0 ? Boolean(dirty.stdout.trim()) : null,
  probeSourceFingerprint: fingerprint(), recordedAt: new Date().toISOString(), status: "running",
  steps: ["test", "build"].map((script) => ({ script, status: "not-run", exitCode: null, milliseconds: null })),
  deviceChecks: Object.fromEntries(["windows-installed", "android-installed", "native-storage-restart", "camera", "device-transfer", "notification-delivery", "device-reboot"].map((id) => [id, "not-run"])),
  checkpointVerified: false,
};
const output = join(repository, "outputs"); mkdirSync(output, { recursive: true });
const save = () => writeFileSync(join(output, "p0-c05-checks.json"), JSON.stringify(report, null, 2) + "\n"); save();
for (const step of report.steps) {
  const start = performance.now();
  const result = spawnSync(process.execPath, [npmCli, "run", step.script], { cwd: root, stdio: "inherit", env: process.env });
  step.exitCode = result.status; step.milliseconds = Math.round(performance.now() - start); step.status = result.status === 0 ? "passed" : "failed"; save();
  if (result.error) console.error(result.error.message); if (step.status === "failed") break;
}
report.status = report.probeSourceFingerprint !== fingerprint() ? "stale" : report.steps.every((step) => step.status === "passed") ? "passed" : "failed";
save(); console.log(`Portable probe: ${report.status}. Native device checks remain not-run. JSON: outputs/p0-c05-checks.json`);
if (report.status !== "passed") process.exitCode = 1;
