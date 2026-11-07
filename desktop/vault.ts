// SPDX-License-Identifier: MPL-2.0
import { DatabaseSync } from "node:sqlite";
import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync, lstatSync, realpathSync, renameSync, rmSync, openSync, fsyncSync, closeSync } from "node:fs";
import { basename, dirname, join, resolve, parse, relative } from "node:path";
import { decode, encode, validateCommandState } from "../src/domain/codec.ts";
import { createSyntheticWorkspace } from "../src/demo/fixture.ts";
import { executeCommand, initialCommandState } from "../src/application/commands.ts";
import type { Command, CommandState } from "../src/application/commands.ts";
import { requireBusiness } from "../src/domain/ledger.ts";
import { DomainError } from "../src/domain/money.ts";

const MARKER = "accounting-assistant-synthetic-v1";
const PURPOSE = "accounting-synthetic-vault-v1";
const MAX_BACKUP = 48 * 1024 * 1024;
const MAX_ATTACHMENT = 2 * 1024 * 1024;
export interface Attachment { id: string; businessId: string; entryId: string; name: string; sha256: string; size: number; base64: string; mediaType: "text/plain" | "application/pdf" | "image/png" | "image/jpeg" }
export interface VaultOptions { now?: () => number; idleMs?: number; fault?: (point: string) => void; pageLimit?: number }
function fail(code: string): never { throw new DomainError(code); }
function hash(bytes: Buffer): string { return createHash("sha256").update(bytes).digest("hex"); }
function attachmentType(name: string, bytes: Buffer): Attachment["mediaType"] {
  if (typeof name !== "string" || !/^[^/\\\x00-\x1f]{1,120}$/.test(name) || !bytes.length || bytes.length > MAX_ATTACHMENT) fail("attachment");
  const lower = name.toLowerCase();
  if (lower.endsWith(".txt") && Buffer.from(bytes.toString("utf8")).equals(bytes) && !bytes.includes(0)) return "text/plain";
  if (lower.endsWith(".pdf") && bytes.subarray(0, 5).toString() === "%PDF-" && bytes.subarray(-1024).includes(Buffer.from("%%EOF"))) return "application/pdf";
  if (lower.endsWith(".png") && bytes.length >= 33 && bytes.subarray(0, 8).toString("hex") === "89504e470d0a1a0a" && bytes.subarray(12, 16).toString() === "IHDR") return "image/png";
  if (/\.jpe?g$/.test(lower) && bytes.length >= 4 && bytes.subarray(0, 3).toString("hex") === "ffd8ff" && bytes.subarray(-2).toString("hex") === "ffd9") return "image/jpeg";
  return fail("attachment");
}
function derive(passphrase: string, salt: Buffer): Buffer {
  if (typeof passphrase !== "string" || passphrase.length < 12 || passphrase.length > 256) fail("passphrase");
  return scryptSync(passphrase, salt, 32, { N: 32768, r: 8, p: 1, maxmem: 128 * 1024 * 1024 });
}
function seal(text: string, key: Buffer, purpose: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  cipher.setAAD(Buffer.from(purpose));
  const bytes = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
  return JSON.stringify({ version: 1, iv: iv.toString("base64"), tag: cipher.getAuthTag().toString("base64"), data: bytes.toString("base64") });
}
function unseal(envelope: string, key: Buffer, purpose: string): string {
  try {
    const e = JSON.parse(envelope);
    if (e.version !== 1 || typeof e.iv !== "string" || typeof e.tag !== "string" || typeof e.data !== "string") fail("authentication");
    const iv = Buffer.from(e.iv, "base64"), tag = Buffer.from(e.tag, "base64");
    if (iv.length !== 12 || tag.length !== 16) fail("authentication");
    const decipher = createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAAD(Buffer.from(purpose)); decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(Buffer.from(e.data, "base64")), decipher.final()]).toString("utf8");
  } catch { return fail("authentication"); }
}
function safeDestination(path: string, suffix: string): string {
  const full = resolve(path);
  if (!basename(full).endsWith(suffix) || full === parse(full).root) fail("destination");
  let current = parse(full).root;
  for (const part of full.slice(current.length).split(/[\\/]/).filter(Boolean)) {
    current = join(current, part);
    if (existsSync(current) && lstatSync(current).isSymbolicLink()) fail("destination");
  }
  if (!existsSync(dirname(full)) || realpathSync(dirname(full)) !== dirname(full)) fail("destination");
  return full;
}
function durableExclusive(path: string, text: string): void {
  const fd = openSync(path, "wx", 0o600);
  try { writeFileSync(fd, text); fsyncSync(fd); } finally { closeSync(fd); }
}
export class SyntheticVault {
  readonly directory: string;
  private readonly db: DatabaseSync;
  private readonly now: () => number;
  private readonly idleMs: number;
  private readonly fault: (point: string) => void;
  private key: Buffer | null = null;
  private touched = 0;
  private failures = 0;
  private nextAttempt = 0;
  private closed = false;
  private constructor(directory: string, options: VaultOptions) {
    this.directory = directory; this.now = options.now ?? Date.now; this.idleMs = options.idleMs ?? 300000; this.fault = options.fault ?? (() => {});
    if (!Number.isFinite(this.idleMs) || this.idleMs < 1) fail("configuration");
    if (readFileSync(join(directory, "synthetic.marker"), "utf8") !== MARKER) fail("synthetic");
    for (const name of ["workspace.sqlite", "workspace.sqlite-wal", "workspace.sqlite-shm", "synthetic.marker"]) {
      if (existsSync(join(directory, name)) && lstatSync(join(directory, name)).isSymbolicLink()) fail("destination");
    }
    this.db = new DatabaseSync(join(directory, "workspace.sqlite"));
    this.db.exec("PRAGMA journal_mode=WAL; PRAGMA synchronous=FULL; PRAGMA busy_timeout=2000;");
    // A bounded SQLite quota is used in contract tests to exercise real SQLITE_FULL.
    if (options.pageLimit !== undefined) {
      if (!Number.isSafeInteger(options.pageLimit) || options.pageLimit < 1) fail("configuration");
      this.db.exec(`PRAGMA max_page_count=${options.pageLimit}`);
    }
  }
  static create(directory: string, passphrase: string, options: VaultOptions = {}, restored?: { state: CommandState; files: Attachment[] }): SyntheticVault {
    const dest = safeDestination(directory, ".synthetic-vault");
    if (existsSync(dest)) fail("destination");
    const salt = randomBytes(32), key = derive(passphrase, salt);
    const state = restored?.state ?? initialCommandState(createSyntheticWorkspace());
    validateCommandState(state);
    mkdirSync(dest, { mode: 0o700 });
    let vault: SyntheticVault | undefined;
    try {
      durableExclusive(join(dest, "synthetic.marker"), MARKER);
      vault = new SyntheticVault(dest, options);
      vault.db.exec("BEGIN IMMEDIATE; CREATE TABLE metadata (name TEXT PRIMARY KEY, value TEXT NOT NULL); CREATE TABLE snapshot (id INTEGER PRIMARY KEY CHECK(id=1), revision INTEGER NOT NULL, ciphertext TEXT NOT NULL); CREATE TABLE files (id TEXT PRIMARY KEY, ciphertext TEXT NOT NULL); PRAGMA user_version=1;");
      vault.db.prepare("INSERT INTO metadata VALUES ('salt', ?)").run(salt.toString("base64"));
      vault.db.prepare("INSERT INTO snapshot VALUES (1, ?, ?)").run(state.revision, seal(encode(state), key, PURPOSE));
      for (const file of restored?.files ?? []) vault.db.prepare("INSERT INTO files VALUES (?, ?)").run(file.id, seal(encode(file), key, `${PURPOSE}:file:${file.id}`));
      vault.fault("initialize"); vault.db.exec("COMMIT");
      return vault;
    } catch (error) {
      vault?.close(); rmSync(dest, { recursive: true, force: true }); throw error;
    } finally { key.fill(0); }
  }
  static open(directory: string, options: VaultOptions = {}): SyntheticVault {
    const dest = safeDestination(directory, ".synthetic-vault");
    if (!existsSync(join(dest, "workspace.sqlite"))) fail("destination");
    const vault = new SyntheticVault(dest, options);
    try {
      const version = vault.db.prepare("PRAGMA user_version").get() as { user_version: number };
      if (version.user_version !== 1) fail("schema");
      return vault;
    } catch (error) { vault.close(); throw error; }
  }
  isLocked(): boolean {
    if (this.key && this.now() - this.touched >= this.idleMs) this.lock();
    return this.key === null;
  }
  private authorized(): Buffer {
    if (this.closed || this.isLocked()) return fail("locked");
    this.touched = this.now(); return this.key!;
  }
  unlock(passphrase: string): void {
    if (this.closed) fail("locked");
    if (this.now() < this.nextAttempt) fail("throttled");
    const row = this.db.prepare("SELECT value FROM metadata WHERE name='salt'").get() as { value: string };
    const salt = Buffer.from(row.value, "base64"); if (salt.length !== 32) fail("schema");
    const key = derive(passphrase, salt);
    try {
      let state = this.readWithKey(key);
      if ((state.version as number) === 0) {
        if (state.revision !== 0 || state.receipts.length !== 0) fail("schema");
        this.db.prepare("VACUUM INTO ?").run(join(this.directory, `pre-migration-${randomUUID()}.sqlite`));
        const next = initialCommandState(state.workspace); validateCommandState(next);
        this.db.exec("BEGIN IMMEDIATE");
        try {
          this.db.prepare("UPDATE snapshot SET ciphertext=? WHERE id=1").run(seal(encode(next), key, PURPOSE));
          this.fault("migration-before-commit"); this.db.exec("COMMIT"); state = next;
        } catch (error) { this.db.exec("ROLLBACK"); throw error; }
      }
      validateCommandState(state);
      this.lock(); this.key = key; this.touched = this.now(); this.failures = 0; this.nextAttempt = 0;
    } catch (error) { key.fill(0); this.failures++; this.nextAttempt = this.now() + Math.min(30000, 500 * 2 ** Math.min(this.failures, 6)); throw error; }
  }
  private reauthenticate(passphrase: string): void {
    this.authorized();
    const salt = this.db.prepare("SELECT value FROM metadata WHERE name='salt'").get() as { value: string };
    const check = derive(passphrase, Buffer.from(salt.value, "base64"));
    try { if (!timingSafeEqual(check, this.key!)) fail("authentication"); } finally { check.fill(0); }
  }
  lock(): void { this.key?.fill(0); this.key = null; }
  close(): void { this.lock(); if (!this.closed) { this.closed = true; this.db.close(); } }
  private readWithKey(key: Buffer): CommandState {
    const row = this.db.prepare("SELECT ciphertext, revision FROM snapshot WHERE id=1").get() as { ciphertext: string; revision: number };
    const state = decode<CommandState>(unseal(row.ciphertext, key, PURPOSE));
    if (state.revision !== row.revision) fail("schema");
    return state;
  }
  read(): CommandState { const state = this.readWithKey(this.authorized()); validateCommandState(state); return state; }
  command(command: Command): { state: CommandState; result: ReturnType<typeof executeCommand>["result"] } {
    const key = this.authorized();
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const current = this.readWithKey(key); validateCommandState(current);
      const executed = executeCommand(current, command, new Date(this.now()).toISOString());
      validateCommandState(executed.state);
      if (executed.state !== current) this.db.prepare("UPDATE snapshot SET revision=?, ciphertext=? WHERE id=1").run(executed.state.revision, seal(encode(executed.state), key, PURPOSE));
      this.fault("before-commit"); this.db.exec("COMMIT");
      return executed;
    } catch (error) { this.rollback(); throw error; }
  }
  attach(businessId: string, entryId: string, name: string, base64: string): Omit<Attachment, "base64"> {
    const key = this.authorized();
    if (typeof base64 !== "string" || base64.length > Math.ceil(MAX_ATTACHMENT / 3) * 4 || !/^[A-Za-z0-9+/]*={0,2}$/.test(base64)) fail("attachment");
    const bytes = Buffer.from(base64, "base64");
    if (bytes.toString("base64") !== base64) fail("attachment");
    // Signature screening only. Opaque PDF/image originals are never executed/rendered.
    const mediaType = attachmentType(name, bytes);
    this.db.exec("BEGIN IMMEDIATE");
    try {
      const state = this.readWithKey(key);
      if (!state.workspace.entries.some(e => e.businessId === businessId && e.id === entryId)) fail("scope");
      if (requireBusiness(state.workspace, businessId).archivedAt) fail("archived");
      const file: Attachment = { id: randomUUID(), businessId, entryId, name, base64, size: bytes.length, sha256: hash(bytes), mediaType };
      this.db.prepare("INSERT INTO files VALUES (?, ?)").run(file.id, seal(encode(file), key, `${PURPOSE}:file:${file.id}`));
      this.fault("attachment-before-commit"); this.db.exec("COMMIT");
      const { base64: _body, ...metadata } = file; return metadata;
    } catch (error) { this.rollback(); throw error; }
  }
  private files(key: Buffer): Attachment[] {
    return (this.db.prepare("SELECT id, ciphertext FROM files ORDER BY id").all() as { id: string; ciphertext: string }[]).map(row => decode<Attachment>(unseal(row.ciphertext, key, `${PURPOSE}:file:${row.id}`)));
  }
  listFiles(businessId: string): Omit<Attachment, "base64">[] {
    const key = this.authorized(); requireBusiness(this.readWithKey(key).workspace, businessId);
    return this.files(key).filter(f => f.businessId === businessId).map(({ base64: _body, ...metadata }) => metadata);
  }
  readFile(businessId: string, id: string): Attachment {
    const key = this.authorized(); const file = this.files(key).find(f => f.id === id && f.businessId === businessId);
    if (!file) return fail("scope");
    if (hash(Buffer.from(file.base64, "base64")) !== file.sha256) fail("integrity");
    return file;
  }
  backup(destination: string, passphrase: string, backupPassphrase: string): void {
    this.reauthenticate(passphrase);
    const path = safeDestination(destination, ".synthetic-backup");
    const rel = relative(this.directory, dirname(path));
    if (!rel || (!rel.startsWith("..") && !parse(rel).root)) fail("destination");
    this.db.exec("BEGIN");
    let payload: string;
    try { payload = encode({ kind: MARKER, state: this.read(), files: this.files(this.authorized()) }); this.db.exec("COMMIT"); } catch (error) { this.db.exec("ROLLBACK"); throw error; }
    if (Buffer.byteLength(payload) > MAX_BACKUP / 2) fail("size");
    const salt = randomBytes(32), key = derive(backupPassphrase, salt);
    try {
      const envelope = JSON.stringify({ format: "synthetic-backup-v1", salt: salt.toString("base64"), payload: seal(payload, key, "synthetic-backup-v1") });
      this.fault("backup-before-write"); durableExclusive(path, envelope);
    } finally { key.fill(0); }
  }
  static restore(backup: string, backupPassphrase: string, destination: string, newPassphrase: string, options: VaultOptions = {}): SyntheticVault {
    const dest = safeDestination(destination, ".synthetic-vault"); if (existsSync(dest)) fail("destination");
    if (lstatSync(backup).isSymbolicLink() || lstatSync(backup).size > MAX_BACKUP) fail("destination");
    const envelope = JSON.parse(readFileSync(backup, "utf8"));
    if (envelope.format !== "synthetic-backup-v1" || typeof envelope.salt !== "string") fail("schema");
    const salt = Buffer.from(envelope.salt, "base64"); if (salt.length !== 32) fail("schema");
    const key = derive(backupPassphrase, salt);
    let data: { kind: string; state: CommandState; files: Attachment[] };
    try { data = decode(unseal(envelope.payload, key, "synthetic-backup-v1")); } finally { key.fill(0); }
    if (data.kind !== MARKER || !Array.isArray(data.files)) fail("synthetic");
    validateCommandState(data.state);
    if (new Set(data.files.map(f => f.id)).size !== data.files.length) fail("integrity");
    for (const f of data.files) {
      const bytes = Buffer.from(f.base64, "base64");
      if (!/^[a-f0-9-]{36}$/.test(f.id) || bytes.length !== f.size || f.size > MAX_ATTACHMENT || hash(bytes) !== f.sha256 || !data.state.workspace.entries.some(e => e.id === f.entryId && e.businessId === f.businessId)) fail("integrity");
      if (attachmentType(f.name, bytes) !== f.mediaType) fail("integrity");
    }
    const stage = join(dirname(dest), `${randomUUID()}.synthetic-vault`);
    let vault: SyntheticVault | undefined;
    try {
      vault = SyntheticVault.create(stage, newPassphrase, options, data); vault.unlock(newPassphrase);
      const verified = vault.read();
      if (encode(verified) !== encode(data.state) || vault.files(vault.authorized()).length !== data.files.length) fail("integrity");
      options.fault?.("restore-before-activate"); vault.close();
      // The destination was checked absent. Never overwrite an existing workspace.
      if (existsSync(dest)) fail("destination");
      renameSync(stage, dest);
      return SyntheticVault.open(dest, options);
    } catch (error) { vault?.close(); rmSync(stage, { recursive: true, force: true }); throw error; }
  }
  // A consistent ciphertext-only recovery copy precedes supported data migration.
  recoveryCopy(passphrase: string): string {
    this.reauthenticate(passphrase);
    const dest = join(this.directory, `pre-migration-${randomUUID()}.sqlite`);
    this.db.prepare("VACUUM INTO ?").run(dest);
    return dest;
  }
  private rollback(): void {
    // SQLITE_FULL may already have rolled the transaction back.
    try { this.db.exec("ROLLBACK"); } catch { /* Preserve the original storage error. */ }
  }
}
