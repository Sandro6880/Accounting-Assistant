// SPDX-License-Identifier: MPL-2.0
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync, renameSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { sourceFingerprint } from "./progress-lib.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const npmCli = process.env.npm_execpath;
if (!npmCli || !existsSync(npmCli))
  throw new Error("Start this runner with npm run check or npm run check:all.");
const browser = process.argv.includes("--browser");
const revision = spawnSync("git", ["rev-parse", "HEAD"], {
  cwd: root,
  encoding: "utf8",
});
const gitStatus = spawnSync("git", ["status", "--porcelain"], {
  cwd: root,
  encoding: "utf8",
});
const scripts = ["typecheck", "test", "build", "progress:validate", "test:e2e"];
const report = {
  schemaVersion: 1,
  dataMode: "synthetic",
  scope: browser ? "core-and-browser" : "core",
  node: process.version,
  gitRevision: revision.status === 0 ? revision.stdout.trim() : null,
  gitDirty: gitStatus.status === 0 ? Boolean(gitStatus.stdout.trim()) : null,
  browserLauncher: browser
    ? process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? "custom"
      : "playwright-managed"
    : "not-run",
  sourceFingerprint: sourceFingerprint(root),
  recordedAt: new Date().toISOString(),
  status: "running",
  steps: scripts.map((script) => ({
    command: `npm run ${script}`,
    required: script !== "test:e2e" || browser,
    status: "not-run",
    exitCode: null,
    milliseconds: null,
  })),
  outsideScope: [
    "installed Windows/Android",
    "durable storage and recovery",
    "authentication and encryption",
    "Austrian/EU legal mappings and government submission",
  ],
};
const output = join(root, "outputs");
mkdirSync(output, { recursive: true });
const save = () => {
  writeFileSync(
    join(output, "checks.json.tmp"),
    JSON.stringify(report, null, 2) + "\n",
  );
  renameSync(join(output, "checks.json.tmp"), join(output, "checks.json"));
};
save();
for (let index = 0; index < scripts.length; index++) {
  const step = report.steps[index];
  if (!step.required) continue;
  const start = performance.now();
  console.log(`\nRunning ${step.command}`);
  const result = spawnSync(process.execPath, [npmCli, "run", scripts[index]], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  step.milliseconds = Math.round(performance.now() - start);
  step.exitCode = result.status;
  step.status = result.status === 0 ? "passed" : "failed";
  save();
  if (result.error) console.error(result.error.message);
  if (step.status === "failed") break;
}
const unchanged = report.sourceFingerprint === sourceFingerprint(root);
report.status =
  unchanged &&
  report.steps
    .filter((step) => step.required)
    .every((step) => step.status === "passed")
    ? "passed"
    : unchanged
      ? "failed"
      : "stale";
save();
console.log(
  `\n${report.scope}: ${report.status}. JSON: outputs/checks.json. Roadmap verification was not changed.`,
);
if (report.status !== "passed") process.exitCode = 1;
