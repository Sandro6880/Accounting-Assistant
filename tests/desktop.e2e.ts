// SPDX-License-Identifier: MPL-2.0
import test from "node:test";
import assert from "node:assert/strict";
import { _electron } from "@playwright/test";
import { createRequire } from "node:module";
import { mkdtempSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url));
const executablePath = createRequire(import.meta.url)("electron") as string;
test("P2/P3 desktop IPC creates, persists, restarts locked and denies reads after locking", { timeout: 90000 }, async t => {
  const temp = mkdtempSync(join(tmpdir(), "accounting-electron-")); const profile = join(temp, "profile.synthetic-test");
  t.after(() => rmSync(temp, { recursive: true, force: true }));
  const launch = () => _electron.launch({ executablePath, args: [
    // Linux container tests only. Production startup never adds --no-sandbox.
    ...(process.platform === "linux" ? ["--no-sandbox", "--disable-gpu", "--ozone-platform=headless"] : []),
    `--synthetic-test-directory=${profile}`, root,
  ], timeout: 30000 });
  let electron = await launch();
  try {
    let page = await electron.firstWindow();
    await page.setViewportSize({ width: 1280, height: 1000 });
    await page.context().setOffline(true);
    console.log("Synthetic desktop viewport", await page.evaluate(() => ({ width: innerWidth, height: innerHeight })));
    await page.getByLabel("Workspace passphrase", { exact: true }).fill("fictional desktop test passphrase");
    await page.getByRole("button", { name: "Create synthetic vault", exact: true }).click();
    await page.getByRole("button", { name: "Entries", exact: true }).click();
    await page.getByLabel("Fictional description").fill("Fictional desktop restart regression");
    await page.getByLabel("Amount", { exact: true }).fill("12,34");
    await page.getByRole("button", { name: "Save draft", exact: true }).click();
    await page.getByRole("row").filter({ hasText: "Fictional desktop restart regression" }).waitFor();
    const notePath = join(temp, "fictional-note.txt"), backupPath = join(temp, "copy.synthetic-backup"), restoredPath = join(temp, "recovered.synthetic-vault");
    writeFileSync(notePath, "Wholly fictional desktop evidence note.\n");
    await electron.evaluate(({ dialog }, paths) => {
      dialog.showOpenDialog = (async () => ({ canceled: false, filePaths: [paths.notePath] })) as typeof dialog.showOpenDialog;
      dialog.showSaveDialog = (async () => ({ canceled: false, filePath: paths.backupPath })) as typeof dialog.showSaveDialog;
    }, { notePath, backupPath });
    await page.getByRole("button", { name: "Local vault", exact: true }).click();
    await page.getByRole("button", { name: "Attach fictional text note", exact: true }).click();
    await page.getByText("fictional-note.txt", { exact: true }).waitFor();
    await page.getByLabel("Workspace passphrase", { exact: true }).fill("fictional desktop test passphrase");
    await page.getByLabel("Backup passphrase", { exact: true }).fill("fictional desktop backup passphrase");
    await page.getByRole("button", { name: "Save encrypted backup", exact: true }).click();
    await page.getByRole("status").filter({ hasText: "Completed" }).waitFor();
    assert(existsSync(backupPath));
    await electron.close(); electron = await launch(); page = await electron.firstWindow(); await page.setViewportSize({ width: 1280, height: 1000 });
    await page.getByRole("button", { name: "Unlock workspace", exact: true }).waitFor();
    const locked = await page.evaluate(() => window.accountingDesktop!.request({ action: "command", command: { id: "locked-bypass", businessId: "workspace", expectedRevision: 1, payload: { type: "business", name: "Fictional denied business" } } }));
    assert.equal(locked.ok, false); assert.equal(locked.code, "locked");
    await page.getByLabel("Workspace passphrase", { exact: true }).fill("fictional desktop test passphrase");
    await page.getByRole("button", { name: "Unlock workspace", exact: true }).click();
    await page.getByRole("button", { name: "Entries", exact: true }).click();
    await page.getByRole("row").filter({ hasText: "Fictional desktop restart regression" }).waitFor();
    await page.getByRole("button", { name: "Lock workspace", exact: true }).click();
    await page.getByRole("button", { name: "Unlock workspace", exact: true }).waitFor();
    const files = await page.evaluate(() => window.accountingDesktop!.request({ action: "list", businessId: "demo-consulting" }));
    assert.equal(files.ok, false); assert.equal(files.code, "locked");
    await electron.evaluate(({ dialog }, paths) => {
      dialog.showOpenDialog = (async () => ({ canceled: false, filePaths: [paths.backupPath] })) as typeof dialog.showOpenDialog;
      dialog.showSaveDialog = (async () => ({ canceled: false, filePath: paths.restoredPath })) as typeof dialog.showSaveDialog;
    }, { backupPath, restoredPath });
    await page.locator("summary").filter({ hasText: "Restore into a new workspace" }).click();
    await page.getByLabel("Backup passphrase", { exact: true }).fill("fictional desktop backup passphrase");
    await page.getByLabel("New workspace passphrase", { exact: true }).fill("fictional recovered desktop passphrase");
    await page.getByRole("button", { name: "Restore into a new workspace", exact: true }).click();
    await page.locator("summary").filter({ hasText: "Restore into a new workspace" }).waitFor();
    await page.waitForFunction(() => !(document.querySelector('button.primary') as HTMLButtonElement)?.disabled);
    // Restart verifies that the restored selection, not just its live process, is retained.
    await electron.close(); electron = await launch(); page = await electron.firstWindow(); await page.setViewportSize({ width: 1280, height: 1000 });
    await page.getByLabel("Workspace passphrase", { exact: true }).fill("fictional recovered desktop passphrase");
    await page.getByRole("button", { name: "Unlock workspace", exact: true }).click();
    await page.getByRole("button", { name: "Local vault", exact: true }).click();
    await page.getByText("fictional-note.txt", { exact: true }).waitFor();
    await page.getByRole("button", { name: "Read note", exact: true }).click();
    await page.getByText("Wholly fictional desktop evidence note.", { exact: true }).waitFor();
    assert(existsSync(join(profile, "workspace.synthetic-vault"))); assert(existsSync(restoredPath));
  } finally { await electron.close(); }
});
