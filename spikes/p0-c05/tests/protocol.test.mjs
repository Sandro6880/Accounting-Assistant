// SPDX-License-Identifier: MPL-2.0
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, access, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { BUSINESSES, FIXTURE_RECEIPT, FOLDER, MARKER, MARKER_VALUE, MAX_PACKAGE_CHARS, MAX_RECEIPT_BYTES, captureFile, decodeForBusiness, decodePackage, digest, encodePackage, ensureMarkedStore, fromBase64, newCapture, receiptFromBytes, saveCapture, toBase64 } from "../src/protocol.mjs";
const RUN = "11111111-1111-4111-8111-111111111111";
const clock = new Date("2026-02-01T10:00:00.000Z");
const make = (business = "demo-workshop", receipt) => newCapture(business, RUN, receipt, clock);
function memoryIO() {
  const files = new Map();
  return { files, exists: async (file) => files.has(file), read: async (file) => files.get(file),
    createExclusive: async (file, text) => { if (files.has(file)) throw new Error("EEXIST"); files.set(file, text); } };
}
async function rehash(capture) { const body = JSON.stringify(capture); return JSON.stringify({ format: "p0-c05-raw-v1", body, sha256: await digest(body) }); }
test("three fictional business scopes retain exact EUR/USD cases and original receipt bytes", async () => {
  for (const business of BUSINESSES) {
    const capture = await make(business); const text = await encodePackage(capture);
    const decoded = await decodeForBusiness(text, business); assert.equal(decoded.capture.businessId, business);
    const net = { EUR: 0n, USD: 0n };
    for (const row of decoded.capture.records) net[row.currency] += BigInt(row.cents) * (row.type === "income" ? 1n : -1n);
    assert.deepEqual(net, { EUR: 28025n, USD: 4010n }); assert.deepEqual(fromBase64(decoded.capture.receipt.base64), FIXTURE_RECEIPT);
    await assert.rejects(decodeForBusiness(text, "another-business"), /BUSINESS_MISMATCH/);
  }
});
test("raw transfer detects changed payload and receipt bytes independently", async () => {
  const capture = await make(); const envelope = JSON.parse(await encodePackage(capture));
  envelope.body = envelope.body.replace('"30020"', '"30021"');
  await assert.rejects(decodePackage(JSON.stringify(envelope)), /PACKAGE_DIGEST_MISMATCH/);
  capture.receipt.base64 = toBase64(new TextEncoder().encode("not the fictional receipt"));
  await assert.rejects(decodePackage(await rehash(capture)), /NOT_FIXTURE_RECEIPT/);
  const changed = await make(); changed.receipt.sha256 = "0".repeat(64);
  await assert.rejects(decodePackage(await rehash(changed)), /RECEIPT_DIGEST_MISMATCH/);
});
test("a recomputed hash does not bypass fixture, scope, currency or exact-cent validation", async () => {
  const mutations = [
    (item) => { item.dataMode = "production"; }, (item) => { delete item.dataMode; },
    (item) => { item.fixtureVersion = "future-version"; }, (item) => { item.businessId = "real-business"; },
    (item) => { item.records[0].currency = "GBP"; }, (item) => { item.records[0].cents = 30020; },
    (item) => { item.records[0].cents = "30020.0"; }, (item) => { item.records.push(item.records[0]); },
    (item) => { item.records[0].privatePath = "../anywhere"; }, (item) => { item.createdAt = "2026-02-30"; },
    (item) => { item.captureId = "../../outside"; },
  ];
  for (const mutate of mutations) { const capture = await make(); mutate(capture); await assert.rejects(decodePackage(await rehash(capture))); }
});
test("receipt size/type/header and package limits reject unsupported input", async () => {
  await assert.rejects(receiptFromBytes(new Uint8Array(MAX_RECEIPT_BYTES + 1), "image/png", "selected-original"), /RECEIPT_SIZE/);
  await assert.rejects(receiptFromBytes(new Uint8Array([1, 2, 3]), "image/png", "selected-original"), /INVALID_MEDIA_HEADER/);
  await assert.rejects(receiptFromBytes(FIXTURE_RECEIPT, "application/pdf", "selected-original"), /UNSUPPORTED_MEDIA/);
  await assert.rejects(receiptFromBytes(FIXTURE_RECEIPT, "text/plain", "selected-original"), /INVALID_RECEIPT_SOURCE/);
  await assert.rejects(decodePackage("x".repeat(MAX_PACKAGE_CHARS + 1)), /PACKAGE_SIZE/);
  assert.throws(() => fromBase64("a???"), /INVALID_BASE64/); assert.throws(() => captureFile("../../outside"), /INVALID_ID/);
});
test("selected image bytes survive encoding without transformation", async () => {
  // Generated one-pixel PNG, never a copied real image.
  const bytes = Uint8Array.from(Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aFioAAAAASUVORK5CYII=", "base64"));
  const receipt = await receiptFromBytes(bytes, "image/png", "selected-original");
  const decoded = await decodePackage(await encodePackage(await make("demo-workshop", receipt)));
  assert.deepEqual(fromBase64(decoded.capture.receipt.base64), bytes); assert.equal(decoded.capture.receipt.sha256, await digest(bytes));
});
test("a receipt at the supported size limit round-trips without regex stack overflow", async () => {
  const bytes = new Uint8Array(MAX_RECEIPT_BYTES); bytes.set([137, 80, 78, 71, 13, 10, 26, 10]);
  const receipt = await receiptFromBytes(bytes, "image/png", "selected-original");
  const decoded = await decodePackage(await encodePackage(await make("demo-workshop", receipt)));
  assert.equal(decoded.capture.receipt.byteLength, MAX_RECEIPT_BYTES); assert.equal(decoded.capture.receipt.sha256, await digest(bytes));
});
test("duplicate import is a no-op and a conflicting ID never replaces prior bytes", async () => {
  const io = memoryIO(); const capture = await make(); assert.equal((await saveCapture(io, capture)).duplicate, false);
  const original = io.files.get(captureFile(capture.captureId)); assert.equal((await saveCapture(io, capture)).duplicate, true);
  const conflicting = structuredClone(capture); conflicting.businessId = "demo-studio";
  await assert.rejects(saveCapture(io, conflicting), /CAPTURE_ID_CONFLICT/);
  assert.equal(io.files.size, 1); assert.equal(io.files.get(captureFile(capture.captureId)), original);
});
test("existing unmarked/wrong-marker stores are refused without altering their contents", async () => {
  for (const marker of [null, "production", "p0-c05-v1:incomplete"]) {
    const io = memoryIO(); io.files.set(FOLDER, "directory"); io.makeDirectory = async () => assert.fail("Must not recreate a destination");
    if (marker !== null) io.files.set(MARKER, marker);
    const before = [...io.files]; await assert.rejects(ensureMarkedStore(io), /UNMARKED_STORE/); assert.deepEqual([...io.files], before);
  }
  const io = memoryIO(); io.makeDirectory = async (folder) => { io.files.set(folder, "directory"); };
  await ensureMarkedStore(io); assert.equal(io.files.get(MARKER), MARKER_VALUE); await ensureMarkedStore(io); assert.equal(io.files.size, 2);
});
test("interrupted writes/readback failures produce no successful save and retain earlier captures", async () => {
  const io = memoryIO(); const first = await make(); await saveCapture(io, first); const original = io.files.get(captureFile(first.captureId));
  const second = await make();
  const interrupted = { ...io, createExclusive: async (file, text) => { io.files.set(file, text.slice(0, 20)); throw new Error("SIMULATED_DISK_FULL"); } };
  await assert.rejects(saveCapture(interrupted, second), /SIMULATED_DISK_FULL/); await assert.rejects(saveCapture(io, second));
  const third = await make(); const noReadback = { ...io, read: async () => { throw new Error("SIMULATED_READBACK_ERROR"); } };
  await assert.rejects(saveCapture(noReadback, third), /SIMULATED_READBACK_ERROR/);
  assert.equal(io.files.get(captureFile(first.captureId)), original); assert.equal(io.files.size, 3);
});
test("Linux filesystem probe reopens exact saved bytes in a fresh Node process", async () => {
  const directory = await mkdtemp(join(tmpdir(), "accounting-p0-c05-synthetic-"));
  try {
    await mkdir(join(directory, "p0-c05"));
    const io = {
      exists: async (file) => { try { await access(join(directory, file)); return true; } catch (error) { if (error.code === "ENOENT") return false; throw error; } },
      read: (file) => readFile(join(directory, file), "utf8"), createExclusive: (file, text) => writeFile(join(directory, file), text, { flag: "wx" }),
    };
    const capture = await make(); const saved = await saveCapture(io, capture);
    const child = spawnSync(process.execPath, ["--input-type=module", "-e", `
      import { readFile } from 'node:fs/promises';
      import { decodePackage } from ${JSON.stringify(new URL("../src/protocol.mjs", import.meta.url).href)};
      const result = await decodePackage(await readFile(process.argv[1], 'utf8'));
      process.stdout.write(JSON.stringify({sha256:result.sha256,capture:result.capture}));
    `, join(directory, saved.file)], { encoding: "utf8" });
    assert.equal(child.status, 0, child.stderr); assert.deepEqual(JSON.parse(child.stdout), { sha256: saved.sha256, capture });
    // Node on Linux only; no Tauri adapter or Windows/Android execution.
  } finally { await rm(directory, { recursive: true, force: true }); }
});
