// SPDX-License-Identifier: MPL-2.0
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";
import { validateManifest, sourceFingerprint } from "./progress-lib.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
try {
  const manifest = validateManifest(
    JSON.parse(readFileSync(join(root, "project/checkpoints.json"), "utf8")),
    readFileSync(join(root, "ROADMAP.md"), "utf8"),
  );
  const counts = {};
  for (const checkpoint of manifest.checkpoints)
    counts[checkpoint.status] = (counts[checkpoint.status] ?? 0) + 1;
  if (process.argv.includes("--validate")) {
    console.log(
      `Manifest valid: ${manifest.checkpoints.length} checkpoints. Verification is never inferred from test counts.`,
    );
  } else {
    const path = join(root, "outputs/checks.json");
    const report = existsSync(path)
      ? JSON.parse(readFileSync(path, "utf8"))
      : null;
    const result = {
      checkpoints: manifest.checkpoints.length,
      counts,
      localChecks: report
        ? {
            scope: report.scope,
            status: report.status,
            recordedAt: report.recordedAt,
            fresh: report.sourceFingerprint === sourceFingerprint(root),
            steps: report.steps,
          }
        : { status: "not-run" },
    };
    if (process.argv.includes("--json"))
      console.log(JSON.stringify(result, null, 2));
    else {
      console.log(
        `Roadmap: ${result.checkpoints} checkpoints · ${counts.verified ?? 0} verified · ${counts["in-progress"] ?? 0} in progress · ${counts.planned ?? 0} planned`,
      );
      console.log(
        `Last local checks: ${result.localChecks.status}${report ? ` (${result.localChecks.scope}; ${result.localChecks.fresh ? "current checked source" : "STALE — rerun checks"})` : ""}`,
      );
      console.log(
        "Roadmap completion, browser checks, installed-device checks and legal review are separate evidence.",
      );
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
