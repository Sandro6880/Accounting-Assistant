// SPDX-License-Identifier: MPL-2.0
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
export const root = fileURLToPath(new URL("../", import.meta.url));
export function fingerprint() {
  const files = [];
  const collect = (path) => {
    for (const entry of readdirSync(path, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (["target", "gen"].includes(entry.name)) continue;
      const full = join(path, entry.name);
      if (entry.isDirectory()) collect(full);
      else if (entry.isFile()) files.push(full);
      else throw new Error("Probe source must not contain symlinks");
    }
  };
  for (const name of ["src", "scripts", "tests", "src-tauri"]) collect(join(root, name));
  for (const name of ["index.html", "vite.config.mjs", "package.json", "package-lock.json", "rust-toolchain.toml", ".gitignore"]) files.push(join(root, name));
  const hash = createHash("sha256");
  for (const file of files) { hash.update(relative(root, file).replaceAll("\\", "/")); hash.update("\0"); hash.update(readFileSync(file)); hash.update("\0"); }
  return hash.digest("hex");
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) console.log(fingerprint());
