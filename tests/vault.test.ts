// SPDX-License-Identifier: MPL-2.0
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, readFileSync, writeFileSync, existsSync, readdirSync, symlinkSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { DatabaseSync } from "node:sqlite";
import { createCipheriv, randomBytes, scryptSync } from "node:crypto";
import { SyntheticVault } from "../desktop/vault.ts";
import { encode } from "../src/domain/codec.ts";
import { totalsFor } from "../src/domain/ledger.ts";
import { createSyntheticWorkspace } from "../src/demo/fixture.ts";
import type { Command } from "../src/application/commands.ts";

// Wholly fictional test-only passphrases. Never reused or presented as defaults.
const pass = "fictional test passphrase one", backupPass = "fictional backup passphrase two";
const input = { amount: "10.05", description: "Fictional durable note", date: "2026-01-20", currency: "EUR" as const, kind: "expense" as const };
const command: Command = { id: "durable-command", businessId: "demo-consulting", expectedRevision: 0, payload: { type: "draft", input } };
function temporary(t: { after: (fn: () => void) => void }) {
  const root = mkdtempSync(join(tmpdir(), "accounting-synthetic-test-"));
  const vaults: SyntheticVault[] = [];
  t.after(() => {
    // Node runs after hooks in registration order. Keep resource shutdown and
    // directory removal in one hook: Windows cannot unlink an open SQLite DB.
    const errors: unknown[] = [];
    for (const vault of [...vaults].reverse()) {
      try { vault.close(); } catch (error) { errors.push(error); }
    }
    if (errors.length) throw new AggregateError(errors, "Could not close synthetic test vaults");
    rmSync(root, { recursive: true, force: true });
  });
  return { root, own: (vault: SyntheticVault) => { vaults.push(vault); return vault; } };
}
test("P2.C04 fixture closes every SQLite vault before deleting its synthetic directory", t => {
  const { root, own } = temporary(t);
  const closed: string[] = [];
  for (const name of ["original", "restored"]) {
    const vault = own(SyntheticVault.create(join(root, `${name}.synthetic-vault`), pass));
    const close = vault.close.bind(vault);
    vault.close = () => {
      // Linux permits open-file unlinking, so explicitly catch wrong teardown
      // order there too rather than relying solely on a Windows EPERM failure.
      assert(existsSync(root), "Vault directory was removed before its database closed");
      close(); closed.push(name);
    };
  }
  t.after(() => {
    assert.deepEqual(closed.sort(), ["original", "restored"]);
    assert.equal(existsSync(root), false);
  });
});
test("P2.C02 durable transaction commits snapshot and command receipt together across restart", t => {
  const { root, own } = temporary(t), path = join(root, "test.synthetic-vault");
  const vault = own(SyntheticVault.create(path, pass)); vault.unlock(pass);
  const first = vault.command(command); vault.close();
  const reopened = own(SyntheticVault.open(path));
  assert(reopened.isLocked()); assert.throws(() => reopened.read(), /locked/);
  reopened.unlock(pass); assert.deepEqual(reopened.command(command).result, first.result);
  assert.equal(reopened.read().receipts.length, 1);
  const bytes = Buffer.concat(readdirSync(path).filter(p => p.startsWith("workspace.sqlite")).map(p => readFileSync(join(path, p))));
  assert(!bytes.includes(Buffer.from(input.description))); assert(!bytes.includes(Buffer.from(pass)));
});
test("P1.C03 failed SQLite transaction leaves no financial change or receipt", t => {
  const { root, own } = temporary(t), path = join(root, "test.synthetic-vault");
  let fail = false;
  const vault = own(SyntheticVault.create(path, pass, { fault: point => { if (fail && point === "before-commit") throw new Error("fictional interruption"); } }));
  vault.unlock(pass); const before = encode(vault.read()); fail = true;
  assert.throws(() => vault.command(command), /fictional interruption/);
  assert.equal(encode(vault.read()), before); fail = false;
  vault.command(command); assert.equal(vault.read().receipts.length, 1);
});
test("P2.C04 abrupt process termination before commit recovers the previous snapshot", t => {
  const { root, own } = temporary(t), path = join(root, "test.synthetic-vault");
  SyntheticVault.create(path, pass).close();
  const module = new URL("../desktop/vault.ts", import.meta.url).href;
  const child = spawnSync(process.execPath, ["--import", "tsx", "--input-type=module", "-e", `import { SyntheticVault } from ${JSON.stringify(module)}; const v = SyntheticVault.open(${JSON.stringify(path)}, {fault: p => { if(p==='before-commit') process.exit(47); }}); v.unlock(${JSON.stringify(pass)}); v.command(${JSON.stringify(command)});`], { cwd: fileURLToPath(new URL("..", import.meta.url)), encoding: "utf8" });
  assert.equal(child.status, 47, child.stderr);
  const reopened = own(SyntheticVault.open(path)); reopened.unlock(pass);
  assert.equal(reopened.read().revision, 0); assert.equal(reopened.read().receipts.length, 0);
  assert(!reopened.read().workspace.entries.some(e => e.description === input.description));
});
test("P2.C04 real SQLite disk-quota failure rolls back attachment and retains readable records", t => {
  const { root, own } = temporary(t), path = join(root, "test.synthetic-vault"); SyntheticVault.create(path, pass).close();
  const db = new DatabaseSync(join(path, "workspace.sqlite")); const pages = (db.prepare("PRAGMA page_count").get() as { page_count: number }).page_count; db.close();
  const vault = own(SyntheticVault.open(path, { pageLimit: pages + 1 })); vault.unlock(pass);
  const before = encode(vault.read());
  assert.throws(() => vault.attach("demo-consulting", "sample-income", "fictional-large.txt", Buffer.from("Fictional note. ".repeat(60000)).toString("base64")), /full|disk/i);
  assert.equal(encode(vault.read()), before); assert.equal(vault.listFiles("demo-consulting").length, 0);
});
test("P3.C03 wrong passphrase, manual/idle lock and restart guard data and attachment reads", t => {
  const { root, own } = temporary(t), path = join(root, "test.synthetic-vault"); let clock = Date.now();
  const vault = own(SyntheticVault.create(path, pass, { now: () => clock, idleMs: 100 }));
  assert.throws(() => vault.unlock("fictional wrong passphrase"), /authentication/);
  assert.throws(() => vault.unlock(pass), /throttled/); clock += 2000; vault.unlock(pass);
  const file = vault.attach("demo-consulting", "sample-income", "fictional.txt", Buffer.from("Wholly fictional evidence note.").toString("base64"));
  assert.throws(() => vault.readFile("demo-studio", file.id), /scope/);
  clock += 101; assert(vault.isLocked());
  for (const action of [() => vault.read(), () => vault.command(command), () => vault.readFile("demo-consulting", file.id), () => vault.listFiles("demo-consulting"), () => vault.backup(join(root, "a.synthetic-backup"), pass, backupPass)]) assert.throws(action, /locked/);
  vault.unlock(pass); assert.equal(vault.readFile("demo-consulting", file.id).sha256, file.sha256);
  vault.lock(); assert.throws(() => vault.read(), /locked/);
});
test("P3.C01 encrypted backup includes all facts, original notes, ownership and profile versions", t => {
  const { root, own } = temporary(t), path = join(root, "test.synthetic-vault"), backup = join(root, "test.synthetic-backup");
  const vault = own(SyntheticVault.create(path, pass)); vault.unlock(pass); vault.command(command);
  const file = vault.attach("demo-consulting", "sample-income", "fictional.txt", Buffer.from("Fictional preserved original bytes.\n").toString("base64"));
  const png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+j5p8AAAAASUVORK5CYII=";
  const image = vault.attach("demo-consulting", "sample-income", "fictional-pixel.png", png);
  assert.throws(() => vault.attach("demo-consulting", "sample-income", "disguised.png", Buffer.from("fictional text disguised as image").toString("base64")), /attachment/);
  assert.throws(() => vault.backup(backup, "fictional wrong passphrase", backupPass), /authentication/);
  vault.backup(backup, pass, backupPass);
  assert(!readFileSync(backup).includes(Buffer.from("Fictional preserved original bytes")));
  const restored = own(SyntheticVault.restore(backup, backupPass, join(root, "restored.synthetic-vault"), "fictional restored passphrase"));
  assert(restored.isLocked()); restored.unlock("fictional restored passphrase");
  assert.equal(encode(restored.read()), encode(vault.read()));
  assert.deepEqual(restored.readFile("demo-consulting", file.id), vault.readFile("demo-consulting", file.id));
  assert.equal(restored.readFile("demo-consulting", image.id).base64, png);
  assert.equal(totalsFor(restored.read().workspace, "demo-consulting", "EUR").net, 112010n);
});
test("P3.C02 damaged backup and wrong recovery key cannot create or overwrite a workspace", t => {
  const { root, own } = temporary(t), path = join(root, "test.synthetic-vault"), backup = join(root, "test.synthetic-backup"), dest = join(root, "restored.synthetic-vault");
  const vault = own(SyntheticVault.create(path, pass)); vault.unlock(pass); vault.backup(backup, pass, backupPass);
  assert.throws(() => SyntheticVault.restore(backup, "fictional wrong backup key", dest, pass), /authentication/); assert(!existsSync(dest));
  assert.throws(() => SyntheticVault.restore(backup, backupPass, path, pass), /destination/);
  const damaged = JSON.parse(readFileSync(backup, "utf8")); const inner = JSON.parse(damaged.payload); const bytes = Buffer.from(inner.data, "base64"); bytes[0] = bytes[0]! ^ 1; inner.data = bytes.toString("base64"); damaged.payload = JSON.stringify(inner); writeFileSync(backup, JSON.stringify(damaged));
  assert.throws(() => SyntheticVault.restore(backup, backupPass, dest, pass), /authentication/); assert(!existsSync(dest)); assert.equal(vault.read().revision, 0);
});
test("P3.C04 failed restore preserves original and backup and removes only its temporary target", t => {
  const { root, own } = temporary(t), path = join(root, "test.synthetic-vault"), backup = join(root, "test.synthetic-backup"), dest = join(root, "restored.synthetic-vault");
  const vault = own(SyntheticVault.create(path, pass)); vault.unlock(pass); vault.backup(backup, pass, backupPass); const original = readFileSync(backup);
  assert.throws(() => SyntheticVault.restore(backup, backupPass, dest, pass, { fault: p => { if (p === "restore-before-activate") throw new Error("fictional interrupted restore"); } }), /interrupted restore/);
  assert.deepEqual(readFileSync(backup), original); assert(!existsSync(dest)); assert.equal(vault.read().revision, 0);
  assert.deepEqual(readdirSync(root).sort(), ["test.synthetic-backup", "test.synthetic-vault"]);
  const recovery = vault.recoveryCopy(pass); assert(existsSync(recovery));
});
test("P3.C04 failed schema migration keeps a pre-migration ciphertext copy and unchanged source", t => {
  const { root, own } = temporary(t), path = join(root, "test.synthetic-vault"); SyntheticVault.create(path, pass).close();
  // Build a wholly fictional legacy-v0 fixture independently of the migration path.
  const db = new DatabaseSync(join(path, "workspace.sqlite")); const salt = (db.prepare("SELECT value FROM metadata WHERE name='salt'").get() as { value: string }).value;
  const key = scryptSync(pass, Buffer.from(salt, "base64"), 32, { N: 32768, r: 8, p: 1, maxmem: 128 * 1024 * 1024 });
  // Use an explicit IV for the encrypted compatibility fixture.
  const iv = randomBytes(12), c = createCipheriv("aes-256-gcm", key, iv); c.setAAD(Buffer.from("accounting-synthetic-vault-v1"));
  const data = Buffer.concat([c.update(encode({ version: 0, revision: 0, workspace: createSyntheticWorkspace(), receipts: [] })), c.final()]);
  key.fill(0);
  const ciphertext = JSON.stringify({ version: 1, iv: iv.toString("base64"), tag: c.getAuthTag().toString("base64"), data: data.toString("base64") });
  db.prepare("UPDATE snapshot SET ciphertext=? WHERE id=1").run(ciphertext); db.close();
  const failing = own(SyntheticVault.open(path, { fault: p => { if (p === "migration-before-commit") throw new Error("fictional migration failure"); } }));
  assert.throws(() => failing.unlock(pass), /migration failure/); failing.close();
  assert(readdirSync(path).some(n => n.startsWith("pre-migration-") && n.endsWith(".sqlite")));
  const check = new DatabaseSync(join(path, "workspace.sqlite")); assert.equal((check.prepare("SELECT ciphertext FROM snapshot").get() as { ciphertext: string }).ciphertext, ciphertext); check.close();
  const recovered = own(SyntheticVault.open(path)); recovered.unlock(pass);
  assert.equal(recovered.read().version, 1); assert.equal(totalsFor(recovered.read().workspace, "demo-consulting", "EUR").net, 112010n);
});
test("P3.C05 synthetic destinations reject ambiguous folders, symlinks and reset-style overwrites", t => {
  const { root, own } = temporary(t);
  assert.throws(() => SyntheticVault.create(join(root, "production"), pass), /destination/);
  const path = join(root, "test.synthetic-vault"); const vault = own(SyntheticVault.create(path, pass));
  assert.throws(() => SyntheticVault.create(path, pass), /destination/);
  symlinkSync(path, join(root, "alias.synthetic-vault"), process.platform === "win32" ? "junction" : "dir");
  assert.throws(() => SyntheticVault.open(join(root, "alias.synthetic-vault")), /destination/);
  vault.unlock(pass); assert.throws(() => vault.attach("demo-studio", "sample-income", "fictional.txt", Buffer.from("fictional").toString("base64")), /scope/);
  assert.throws(() => vault.attach("demo-consulting", "sample-income", "../fictional.txt", Buffer.from("fictional").toString("base64")), /attachment/);
});
