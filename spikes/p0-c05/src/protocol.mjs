// SPDX-License-Identifier: MPL-2.0
// Disposable synthetic probe format, never an accounting import or backup.
export const VERSION = "p0-c05-v1";
export const FORMAT = "p0-c05-raw-v1";
export const FOLDER = "p0-c05";
export const MARKER = `${FOLDER}/synthetic.marker`;
export const MARKER_VALUE = "p0-c05-v1:wholly-fictional-only\n";
export const MAX_RECEIPT_BYTES = 3 * 1024 * 1024;
export const MAX_PACKAGE_CHARS = 5 * 1024 * 1024;
export const BUSINESSES = ["demo-consulting", "demo-studio", "demo-workshop"];
export const CASES = [
  { id: "eur-income", date: "2026-02-01", type: "income", currency: "EUR", cents: "30020" },
  { id: "eur-expense", date: "2026-02-01", type: "expense", currency: "EUR", cents: "1995" },
  { id: "usd-income", date: "2026-02-01", type: "income", currency: "USD", cents: "4010" },
];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const HEX = /^[0-9a-f]{64}$/;
const encoder = new TextEncoder();
export const FIXTURE_RECEIPT = encoder.encode(
  "WHOLLY FICTIONAL — P0.C05\nExample Workshop materials\n2026-02-01 EUR 19.95\nNot a tax invoice. No real supplier or customer.\n",
);
function requireThat(condition, code) { if (!condition) throw new Error(code); }
function keys(value, names) {
  requireThat(value && typeof value === "object" && !Array.isArray(value), "INVALID_OBJECT");
  requireThat(Object.keys(value).sort().join("|") === [...names].sort().join("|"), "INVALID_FIELDS");
}
export async function digest(bytes) {
  const input = typeof bytes === "string" ? encoder.encode(bytes) : bytes;
  const hash = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(hash), (part) => part.toString(16).padStart(2, "0")).join("");
}
export function toBase64(bytes) {
  let binary = "";
  for (let start = 0; start < bytes.length; start += 8192)
    binary += String.fromCharCode(...bytes.subarray(start, start + 8192));
  return btoa(binary);
}
export function fromBase64(value) {
  requireThat(typeof value === "string" && value.length <= 4 * Math.ceil(MAX_RECEIPT_BYTES / 3), "RECEIPT_SIZE");
  requireThat(value.length % 4 === 0 && !/[^A-Za-z0-9+/=]/.test(value), "INVALID_BASE64");
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  requireThat(bytes.length > 0 && bytes.length <= MAX_RECEIPT_BYTES && toBase64(bytes) === value, "INVALID_BASE64");
  return bytes;
}
function checkMedia(bytes, mime) {
  requireThat(bytes instanceof Uint8Array && bytes.length > 0 && bytes.length <= MAX_RECEIPT_BYTES, "RECEIPT_SIZE");
  const png = [137, 80, 78, 71, 13, 10, 26, 10];
  if (mime === "text/plain") requireThat(toBase64(bytes) === toBase64(FIXTURE_RECEIPT), "NOT_FIXTURE_RECEIPT");
  else if (mime === "image/png") requireThat(png.every((byte, index) => bytes[index] === byte), "INVALID_MEDIA_HEADER");
  else if (mime === "image/jpeg") requireThat(bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255 && bytes.at(-2) === 255 && bytes.at(-1) === 217, "INVALID_MEDIA_HEADER");
  else throw new Error("UNSUPPORTED_MEDIA");
}
export async function receiptFromBytes(bytes, mime, source) {
  checkMedia(bytes, mime);
  requireThat(["fixture", "camera-png", "selected-original"].includes(source), "INVALID_RECEIPT_SOURCE");
  requireThat((source === "fixture") === (mime === "text/plain"), "INVALID_RECEIPT_SOURCE");
  requireThat(source !== "camera-png" || mime === "image/png", "INVALID_RECEIPT_SOURCE");
  return { mime, source, byteLength: bytes.length, sha256: await digest(bytes), base64: toBase64(bytes) };
}
export async function newCapture(businessId, runId, receipt, clock = new Date()) {
  const capture = {
    schemaVersion: 1, dataMode: "synthetic", fixtureVersion: VERSION,
    captureId: crypto.randomUUID(), businessId, createdByRunId: runId,
    createdAt: clock.toISOString(), records: structuredClone(CASES),
    receipt: receipt ?? await receiptFromBytes(FIXTURE_RECEIPT, "text/plain", "fixture"),
  };
  await validateCapture(capture);
  return capture;
}
export async function validateCapture(value) {
  keys(value, ["schemaVersion", "dataMode", "fixtureVersion", "captureId", "businessId", "createdByRunId", "createdAt", "records", "receipt"]);
  requireThat(value.schemaVersion === 1 && value.dataMode === "synthetic" && value.fixtureVersion === VERSION, "NOT_SYNTHETIC_PROBE");
  requireThat(UUID.test(value.captureId) && UUID.test(value.createdByRunId), "INVALID_ID");
  requireThat(BUSINESSES.includes(value.businessId), "INVALID_BUSINESS");
  requireThat(typeof value.createdAt === "string" && Number.isFinite(Date.parse(value.createdAt)) && new Date(value.createdAt).toISOString() === value.createdAt, "INVALID_TIME");
  requireThat(Array.isArray(value.records) && value.records.length === CASES.length, "INVALID_RECORDS");
  for (const [index, expected] of CASES.entries()) {
    const row = value.records[index]; keys(row, Object.keys(expected));
    requireThat(Object.entries(expected).every(([key, item]) => row[key] === item), "NOT_FIXTURE_RECORDS");
  }
  keys(value.receipt, ["mime", "source", "byteLength", "sha256", "base64"]);
  const bytes = fromBase64(value.receipt.base64);
  const receipt = await receiptFromBytes(bytes, value.receipt.mime, value.receipt.source);
  requireThat(value.receipt.byteLength === receipt.byteLength && value.receipt.sha256 === receipt.sha256, "RECEIPT_DIGEST_MISMATCH");
  return value;
}
export async function encodePackage(capture) {
  await validateCapture(capture);
  const body = JSON.stringify(capture);
  return JSON.stringify({ format: FORMAT, body, sha256: await digest(body) });
}
export async function decodePackage(text) {
  requireThat(typeof text === "string" && text.length > 0 && text.length <= MAX_PACKAGE_CHARS, "PACKAGE_SIZE");
  const envelope = JSON.parse(text); keys(envelope, ["format", "body", "sha256"]);
  requireThat(envelope.format === FORMAT && typeof envelope.body === "string" && HEX.test(envelope.sha256), "INVALID_PACKAGE");
  requireThat(await digest(envelope.body) === envelope.sha256, "PACKAGE_DIGEST_MISMATCH");
  return { capture: await validateCapture(JSON.parse(envelope.body)), sha256: envelope.sha256 };
}
export async function decodeForBusiness(text, businessId) {
  const decoded = await decodePackage(text);
  requireThat(decoded.capture.businessId === businessId, "BUSINESS_MISMATCH");
  return decoded;
}
export function captureFile(id) {
  requireThat(UUID.test(id), "INVALID_ID");
  return `p0-c05/capture-${id}.json`;
}
export async function ensureMarkedStore(io) {
  if (await io.exists(FOLDER)) requireThat(await io.exists(MARKER) && await io.read(MARKER) === MARKER_VALUE, "UNMARKED_STORE");
  else { await io.makeDirectory(FOLDER); await io.createExclusive(MARKER, MARKER_VALUE); }
}
// Success requires verified readback. Partial files are retained; no reset or overwrite.
export async function saveCapture(io, capture) {
  const text = await encodePackage(capture); const file = captureFile(capture.captureId);
  if (await io.exists(file)) {
    const prior = await io.read(file); const checked = await decodePackage(prior);
    requireThat(prior === text, "CAPTURE_ID_CONFLICT");
    return { file, sha256: checked.sha256, duplicate: true };
  }
  await io.createExclusive(file, text);
  const reread = await io.read(file); const checked = await decodePackage(reread);
  requireThat(reread === text, "READBACK_MISMATCH");
  return { file, sha256: checked.sha256, duplicate: false };
}
