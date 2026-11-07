// SPDX-License-Identifier: MPL-2.0
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

export function checkpointGate(checkpoint, report, fingerprint) {
  const missing = [];
  const requirements = checkpoint.requirements;
  if (!requirements || requirements.workspaceMode !== "synthetic" || !requirements.fixtureVersion) return { executed: false, verified: false, missing: ["requirements"] };
  if (!report || report.status !== "passed" || report.sourceFingerprint !== fingerprint || report.dataMode !== "synthetic" || report.fixtureVersion !== requirements.fixtureVersion) missing.push("current execution report");
  for (const command of requirements.commands) if (!report?.steps?.some(step => step.command === command && step.status === "passed" && step.exitCode === 0)) missing.push(command);
  for (const prefix of requirements.testPrefixes) {
    const tests = report?.tests?.filter(item => item.name.startsWith(prefix)) ?? [];
    if (!tests.length || tests.some(item => item.status !== "passed")) missing.push(prefix);
  }
  const executed = missing.length === 0;
  for (const requirement of requirements.manual) {
    const evidence = checkpoint.evidence?.manualReviews?.find(item => item.id === requirement);
    if (!evidence || evidence.status !== "accepted" || !evidence.reviewer || !evidence.record || evidence.sourceFingerprint !== fingerprint) missing.push(`manual:${requirement}`);
  }
  return { executed, verified: missing.length === 0, missing };
}
export function validateManifest(manifest, roadmap, validation = {}) {
  if (![1, 2].includes(manifest.schemaVersion) || !Array.isArray(manifest.checkpoints))
    throw new Error("Invalid manifest version");
  const ids = [
    ...roadmap.matchAll(/^- \[ \] \*\*(P\d+[A-Z]?\.C\d+)\*\*/gm),
  ].map((match) => match[1]);
  const actual = manifest.checkpoints.map((item) => item.id);
  if (
    !ids.length ||
    new Set(actual).size !== actual.length ||
    JSON.stringify(ids) !== JSON.stringify(actual)
  )
    throw new Error("Checkpoint IDs must match ROADMAP.md in order");
  const states = new Set([
    "planned",
    "ready",
    "in-progress",
    "blocked",
    "in-review",
    "verified",
    "released",
  ]);
  for (const checkpoint of manifest.checkpoints) {
    if (manifest.schemaVersion === 2) {
      const r = checkpoint.requirements;
      if (!r || r.workspaceMode !== "synthetic" || r.fixtureVersion !== "synthetic-v1" || ![r.commands, r.testPrefixes, r.manual].every(v => Array.isArray(v) && v.every(item => typeof item === "string" && item.length > 0)) || !r.manual.length) throw new Error(`Invalid checkpoint requirements: ${checkpoint.id}`);
    }
    if (
      !states.has(checkpoint.status) ||
      !checkpoint.summary ||
      !checkpoint.proof ||
      checkpoint.phase !== checkpoint.id.split(".")[0]
    )
      throw new Error(`Invalid checkpoint: ${checkpoint.id}`);
    if (["verified", "released"].includes(checkpoint.status)) {
      const evidence = checkpoint.evidence;
      if (
        !evidence?.revision ||
        !Array.isArray(evidence.commands) ||
        !evidence.commands.length ||
        !evidence.review
      )
        throw new Error(`Missing verification evidence: ${checkpoint.id}`);
      if (manifest.schemaVersion === 2) {
        const gate = checkpointGate(checkpoint, validation.report ?? evidence.execution, validation.sourceFingerprint ?? evidence.sourceFingerprint);
        if (!gate.verified) throw new Error(`Missing execution/review evidence: ${checkpoint.id}: ${gate.missing.join(", ")}`);
      }
    }
  }
  return manifest;
}
export function sourceFingerprint(root) {
  const sources = [
    "src",
    "desktop",
    "tests",
    "scripts",
    "project",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "vite.config.ts",
    "playwright.config.ts",
    "desktop.vite.config.ts",
    "ROADMAP.md",
  ];
  const files = [];
  const collect = (path) => {
    for (const entry of readdirSync(path, { withFileTypes: true }).sort(
      (a, b) => a.name.localeCompare(b.name),
    )) {
      const full = join(path, entry.name);
      if (entry.isDirectory()) collect(full);
      else if (entry.isFile()) files.push(full);
      else
        throw new Error(
          "Checked source cannot contain symlinks or special files",
        );
    }
  };
  for (const source of sources) {
    const full = join(root, source);
    if (!existsSync(full)) throw new Error(`Missing source input: ${source}`);
    if (["src", "desktop", "tests", "scripts", "project"].includes(source)) collect(full);
    else files.push(full);
  }
  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(relative(root, file).replaceAll("\\", "/"));
    hash.update("\0");
    if (relative(root, file).replaceAll("\\", "/") === "project/checkpoints.json") {
      // Evidence/status records refer to this fingerprint; exclude those mutable
      // observations to avoid a self-referential hash. Requirements remain checked.
      const manifest = JSON.parse(readFileSync(file, "utf8"));
      hash.update(JSON.stringify({ schemaVersion: manifest.schemaVersion, checkpoints: manifest.checkpoints.map(({ id, phase, summary, proof, requirements }) => ({ id, phase, summary, proof, requirements })) }));
    } else hash.update(readFileSync(file));
    hash.update("\0");
  }
  return hash.digest("hex");
}
