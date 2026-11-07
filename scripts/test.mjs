// SPDX-License-Identifier: MPL-2.0
import { spawnSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";
import { JSDOM } from "jsdom";
import { sourceFingerprint } from "./progress-lib.mjs";
const root = join(import.meta.dirname, "..");
const desktop = process.argv.includes("--desktop");
const name = desktop ? "desktop-tests" : "node-tests";
mkdirSync(join(root, "outputs"), { recursive: true });
const xml = join(root, `outputs/${name}.xml`), output = join(root, `outputs/${name}.json`);
rmSync(xml, { force: true }); rmSync(output, { force: true });
const tests = desktop ? [join(root, "tests/desktop.e2e.ts")] : readdirSync(join(root, "tests")).filter(f => f.endsWith(".test.ts")).sort().map(f => join(root, "tests", f));
if (!tests.length) throw new Error("No Node test files selected");
const result = spawnSync(process.execPath, ["--import", "tsx", "--test", "--test-reporter=spec", "--test-reporter=junit", "--test-reporter-destination=stdout", `--test-reporter-destination=${xml}`, ...tests], { cwd: root, stdio: "inherit" });
try {
  const dom = new JSDOM(readFileSync(xml, "utf8"), { contentType: "text/xml" });
  const cases = [...dom.window.document.querySelectorAll("testcase")].map(c => ({ name: c.getAttribute("name"), status: c.querySelector("skipped") ? "skipped" : c.querySelector("failure,error") ? "failed" : "passed" }));
  writeFileSync(output, JSON.stringify({ recordedAt: new Date().toISOString(), sourceFingerprint: sourceFingerprint(root), node: process.version, tests: cases }, null, 2) + "\n"); dom.window.close();
  if (!cases.length) throw new Error("No test cases executed");
} catch (error) { console.error(error.message); process.exitCode = 1; }
if (result.status !== 0) process.exitCode = result.status || 1;
