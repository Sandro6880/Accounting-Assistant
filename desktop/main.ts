// SPDX-License-Identifier: MPL-2.0
import { app, BrowserWindow, dialog, ipcMain, session } from "electron";
import { readFileSync, existsSync, mkdirSync, writeFileSync, renameSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { pathToFileURL } from "node:url";
import { SyntheticVault } from "./vault.ts";
import { encode } from "../src/domain/codec.ts";
import { DomainError } from "../src/domain/money.ts";
import type { DesktopRequest, DesktopResponse } from "../src/application/desktop-api.ts";

let window: BrowserWindow;
let vault: SyntheticVault | undefined;
let defaultPath: string;
let lastLocked = true;
const sourceUrl = () => pathToFileURL(join(app.getAppPath(), "dist/index.html")).href;
// Explicit temporary synthetic profile for tests; never discover or reset a user's profile.
const testDirectory = app.commandLine.getSwitchValue("synthetic-test-directory");
if (testDirectory) {
  const path = resolve(testDirectory), rel = relative(app.getPath("temp"), path);
  if (app.isPackaged || rel.startsWith("..") || !path.endsWith(".synthetic-test")) throw new Error("Invalid synthetic test destination");
  mkdirSync(path, { recursive: true, mode: 0o700 }); app.setPath("userData", path);
}
if (!app.requestSingleInstanceLock()) app.quit();
else {
  app.on("second-instance", () => { window?.show(); window?.focus(); });
  app.whenReady().then(async () => {
    defaultPath = join(app.getPath("userData"), "workspace.synthetic-vault");
    const selectionPath = join(app.getPath("userData"), "selected-synthetic-workspace.json");
    if (existsSync(selectionPath)) {
      const selected = JSON.parse(readFileSync(selectionPath, "utf8"));
      if (typeof selected.path !== "string" || !selected.path.endsWith(".synthetic-vault")) throw new Error("Invalid workspace selection");
      defaultPath = selected.path;
    }
    if (existsSync(defaultPath)) vault = SyntheticVault.open(defaultPath);
    session.defaultSession.webRequest.onBeforeRequest((details, callback) => callback({ cancel: /^(https?|wss?|ftp):/i.test(details.url) }));
    session.defaultSession.setPermissionRequestHandler((_contents, _permission, callback) => callback(false));
    session.defaultSession.setPermissionCheckHandler(() => false);
    window = new BrowserWindow({ width: 1220, height: 900, title: "Accounting — fictional local workspace", webPreferences: {
      preload: join(app.getAppPath(), "desktop/preload.cjs"), contextIsolation: true, sandbox: true, nodeIntegration: false, webSecurity: true,
    } });
    window.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
    window.webContents.on("will-navigate", event => event.preventDefault());
    ipcMain.handle("synthetic-vault", async (event, request: DesktopRequest): Promise<DesktopResponse> => {
      if (event.sender !== window.webContents || event.senderFrame !== window.webContents.mainFrame || event.senderFrame.url !== sourceUrl()) return { ok: false, code: "scope" };
      try {
        if (!request || typeof request.action !== "string" || JSON.stringify(request).length > 20000) throw new DomainError("command");
        const requireVault = () => { if (!vault) throw new DomainError("locked"); return vault; };
        let result: unknown;
        switch (request.action) {
          case "status": result = { exists: Boolean(vault), locked: vault?.isLocked() ?? true }; break;
          case "create":
            if (vault) throw new DomainError("destination");
            vault = SyntheticVault.create(defaultPath, request.passphrase); result = true; break;
          case "unlock": requireVault().unlock(request.passphrase); lastLocked = false; result = requireVault().read(); break;
          case "lock": requireVault().lock(); lastLocked = true; window.webContents.send("vault-locked"); result = true; break;
          case "command": result = requireVault().command(request.command); break;
          case "list": result = requireVault().listFiles(request.businessId); break;
          case "read": result = requireVault().readFile(request.businessId, request.id); break;
          case "attach": {
            const current = requireVault(); current.read();
            const selected = await dialog.showOpenDialog(window, { title: "Select a wholly fictional original", properties: ["openFile"], filters: [{ name: "Synthetic evidence", extensions: ["txt", "pdf", "png", "jpg", "jpeg"] }] });
            if (selected.canceled) { result = null; break; }
            const path = selected.filePaths[0]!;
            const { basename } = await import("node:path");
            const { statSync } = await import("node:fs");
            if (statSync(path).size > 2 * 1024 * 1024) throw new DomainError("attachment");
            result = current.attach(request.businessId, request.entryId ?? "", basename(path), readFileSync(path).toString("base64")); break;
          }
          case "backup": {
            const current = requireVault(); current.read();
            const selected = await dialog.showSaveDialog(window, { title: "Save encrypted synthetic backup outside the workspace", defaultPath: "accounting.synthetic-backup", filters: [{ name: "Encrypted synthetic backup", extensions: ["synthetic-backup"] }] });
            if (selected.canceled || !selected.filePath) { result = null; break; }
            current.backup(selected.filePath, request.passphrase, request.backupPassphrase); result = true; break;
          }
          case "restore": {
            if (vault && !vault.isLocked()) throw new DomainError("locked");
            const selected = await dialog.showOpenDialog(window, { title: "Select encrypted synthetic backup", properties: ["openFile"], filters: [{ name: "Encrypted synthetic backup", extensions: ["synthetic-backup"] }] });
            if (selected.canceled) { result = null; break; }
            const target = await dialog.showSaveDialog(window, { title: "Choose a NEW workspace folder ending .synthetic-vault", defaultPath: "restored.synthetic-vault" });
            if (target.canceled || !target.filePath) { result = null; break; }
            const restored = SyntheticVault.restore(selected.filePaths[0]!, request.backupPassphrase, target.filePath, request.newPassphrase);
            try {
              writeFileSync(selectionPath + ".tmp", JSON.stringify({ path: target.filePath }), { mode: 0o600 });
              renameSync(selectionPath + ".tmp", selectionPath);
            } catch (error) { restored.close(); throw error; }
            vault?.close(); vault = restored; lastLocked = true; result = true; window.webContents.send("vault-locked"); break;
          }
          case "recovery": requireVault().recoveryCopy(request.passphrase); result = true; break;
          default: throw new DomainError("command");
        }
        return { ok: true, data: encode(result) };
      } catch (error) {
        const code = error instanceof DomainError ? error.code : "storage";
        if (code === "locked" && !lastLocked) { lastLocked = true; window.webContents.send("vault-locked"); }
        return { ok: false, code };
      }
    });
    const timer = setInterval(() => { const locked = vault?.isLocked() ?? true; if (locked && !lastLocked) window?.webContents.send("vault-locked"); lastLocked = locked; }, 1000);
    window.on("closed", () => { clearInterval(timer); vault?.close(); });
    await window.loadFile(join(app.getAppPath(), "dist/index.html"));
  }).catch(() => { dialog.showErrorBox("Synthetic workspace unavailable", "The local workspace could not be opened. Keep the workspace and recovery copies; do not delete them. See the recovery guide."); app.quit(); });
  app.on("window-all-closed", () => app.quit());
}
