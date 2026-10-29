// SPDX-License-Identifier: MPL-2.0
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

export function validateManifest(manifest, roadmap) {
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.checkpoints))
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
    }
  }
  return manifest;
}
export function sourceFingerprint(root) {
  const sources = [
    "src",
    "tests",
    "scripts",
    "project",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "vite.config.ts",
    "playwright.config.ts",
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
    if (["src", "tests", "scripts", "project"].includes(source)) collect(full);
    else files.push(full);
  }
  const hash = createHash("sha256");
  for (const file of files) {
    hash.update(relative(root, file).replaceAll("\\", "/"));
    hash.update("\0");
    hash.update(readFileSync(file));
    hash.update("\0");
  }
  return hash.digest("hex");
}
