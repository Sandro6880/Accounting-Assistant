// SPDX-License-Identifier: MPL-2.0
import { packager } from "@electron/packager";
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
const root = resolve(import.meta.dirname, "..");
const manifest = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const platform = process.argv[2] ?? process.platform;
if (!["win32", "linux"].includes(platform)) throw new Error("Supported package targets: win32 or linux");
const stage = join(root, "desktop-stage");
mkdirSync(stage, { recursive: true });
for (const name of ["dist", "desktop-dist", "LICENSE", "THIRD_PARTY_NOTICES.md"]) cpSync(join(root, name), join(stage, name), { recursive: true });
mkdirSync(join(stage, "third-party-licenses"), { recursive: true });
for (const dependency of ["react", "react-dom", "scheduler", "vite"]) {
  const source = join(root, "node_modules", dependency, dependency === "vite" ? "LICENSE.md" : "LICENSE");
  cpSync(source, join(stage, "third-party-licenses", `${dependency}.LICENSE`));
}
for (const name of ["DELIVERY.md", "DESKTOP_TESTING.md", "RECOVERY.md"]) cpSync(join(root, "docs", name), join(stage, name));
mkdirSync(join(stage, "desktop"), { recursive: true });
cpSync(join(root, "desktop/preload.cjs"), join(stage, "desktop/preload.cjs"));
writeFileSync(join(stage, "package.json"), JSON.stringify({ name: manifest.name, version: manifest.version, type: "module", main: manifest.main, license: manifest.license, description: manifest.description }));
const output = join(root, "artifacts");
const target = join(output, `Accounting-Synthetic-${platform}-x64`);
if (existsSync(target)) throw new Error(`Package already exists; preserve or explicitly remove the previous generated artifact: ${target}`);
const paths = await packager({ dir: stage, out: output, platform, arch: "x64", name: "Accounting-Synthetic", electronVersion: manifest.devDependencies.electron, asar: true, prune: false, overwrite: false, download: { cacheRoot: process.env.electron_config_cache ?? join(root, ".cache/electron"), checksums: JSON.parse(readFileSync(join(root, "node_modules/electron/checksums.json"), "utf8")) } });
console.log(`Unsigned synthetic test package: ${paths.join(", ")}. Target-device execution and signing are not established by packaging.`);
