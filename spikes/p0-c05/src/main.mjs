// SPDX-License-Identifier: MPL-2.0
import "./style.css";
import { messages } from "./i18n.mjs";
import { MAX_PACKAGE_CHARS, MAX_RECEIPT_BYTES, VERSION, decodeForBusiness, decodePackage, encodePackage, newCapture, receiptFromBytes, saveCapture } from "./protocol.mjs";
import { nativeAvailable, hostInfo, openStore, io, listCaptures, loadCapture, notify, cancelReminder } from "./native.mjs";
const $ = (id) => document.getElementById(id);
const runId = crypto.randomUUID(); const startedAt = new Date().toISOString();
let language = "en"; let host = { os: "unknown", arch: "unknown" };
let selectedReceipt; let current; let stream; let busy = false;
const events = []; const t = (key) => messages[language][key];
function record(action, status, details, milliseconds = null) {
  events.push({ at: new Date().toISOString(), action, status, milliseconds, details });
  $("log").textContent = JSON.stringify(events, null, 2);
}
function translate() {
  document.documentElement.lang = language;
  for (const element of document.querySelectorAll("[data-i18n]")) element.textContent = t(element.dataset.i18n);
  $("mode").textContent = t(nativeAvailable ? "native" : "preview");
  $("receipt").textContent = t(selectedReceipt ? "receiptSelected" : "fixtureSelected");
}
function setBusy(value) {
  busy = value; for (const button of document.querySelectorAll("button")) button.disabled = value;
  $("status").textContent = value ? t("busy") : t("done");
}
async function perform(action, task) {
  if (busy) return;
  setBusy(true); const start = performance.now(); let failed = false;
  try { record(action, "observed", await task() ?? {}, Math.round(performance.now() - start)); }
  catch (error) {
    failed = true; if (action.startsWith("camera-")) stopCamera();
    const code = error instanceof Error ? error.message : String(error);
    record(action, "failed-or-blocked", { code, explanation: messages[language].errors[code] ?? t("failed") }, Math.round(performance.now() - start));
  } finally { setBusy(false); if (failed) $("status").textContent = t("failed"); }
}
function showCapture(loaded) {
  current = loaded;
  $("capture").textContent = JSON.stringify({ captureId: loaded.capture.captureId, businessId: loaded.capture.businessId,
    createdByRunId: loaded.capture.createdByRunId, thisRunId: runId, priorJavaScriptSession: loaded.capture.createdByRunId !== runId,
    sha256: loaded.sha256, records: loaded.capture.records, receipt: { ...loaded.capture.receipt, base64: "(omitted)" } }, null, 2);
}
async function refreshList(selected) {
  const files = await listCaptures();
  $("files").replaceChildren(...files.map((file) => { const option = document.createElement("option"); option.value = file; option.textContent = file; return option; }));
  if (selected) $("files").value = selected;
  return { count: files.length, files };
}
function stopCamera() { for (const track of stream?.getTracks() ?? []) track.stop(); stream = undefined; $("video").srcObject = null; }
function download(text, filename) {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const anchor = document.createElement("a"); anchor.href = url; anchor.download = filename;
  document.body.append(anchor); anchor.click(); anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
$("language").addEventListener("change", () => { language = $("language").value; translate(); });
$("save").onclick = () => perform("local-save-readback", async () => {
  const business = $("business").value; const receipt = selectedReceipt ? structuredClone(selectedReceipt) : undefined;
  await openStore(); const capture = await newCapture(business, runId, receipt); const saved = await saveCapture(io, capture);
  showCapture(await loadCapture(saved.file)); await refreshList(saved.file);
  return { ...saved, businessId: business, receiptSha256: capture.receipt.sha256, meaning: "readback-matched; native restart and power-loss durability untested" };
});
$("list").onclick = () => perform("local-list", () => refreshList());
$("load").onclick = () => perform("local-reload", async () => {
  const file = $("files").value; if (!file) throw new Error("NO_FILE");
  const loaded = await loadCapture(file); showCapture(loaded);
  return { file, sha256: loaded.sha256, priorJavaScriptSession: loaded.capture.createdByRunId !== runId, nativeRestart: "manual-observation-required" };
});
$("camera").onclick = () => perform("camera-live-request", async () => {
  if (!navigator.mediaDevices?.getUserMedia) throw new Error("CAMERA_UNAVAILABLE");
  stopCamera(); stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
  $("video").srcObject = stream; await $("video").play(); return { liveStreamOpened: true, originalCameraFile: false };
});
$("snapshot").onclick = () => perform("camera-derived-png", async () => {
  const video = $("video"); if (!stream || !video.videoWidth || !video.videoHeight) throw new Error("CAMERA_NOT_READY");
  const canvas = document.createElement("canvas"); canvas.width = video.videoWidth; canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  if (!blob || blob.size > MAX_RECEIPT_BYTES) throw new Error("IMAGE_SIZE");
  selectedReceipt = await receiptFromBytes(new Uint8Array(await blob.arrayBuffer()), "image/png", "camera-png");
  stopCamera(); translate(); return { byteLength: selectedReceipt.byteLength, sha256: selectedReceipt.sha256, durableSave: "not-yet-requested", originalCameraFile: false };
});
$("stop").onclick = () => { stopCamera(); record("camera-stop", "observed", { tracksStopped: true }); };
$("original").onchange = () => perform("selected-original", async () => {
  const file = $("original").files?.[0]; if (!file) return { cancelled: true };
  if (file.size > MAX_RECEIPT_BYTES || !["image/png", "image/jpeg"].includes(file.type)) throw new Error("IMAGE_SIZE");
  selectedReceipt = await receiptFromBytes(new Uint8Array(await file.arrayBuffer()), file.type, "selected-original");
  $("original").value = ""; translate();
  return { byteLength: selectedReceipt.byteLength, sha256: selectedReceipt.sha256, durableSave: "not-yet-requested", cameraOrigin: "manual-observation-required" };
});
$("original").addEventListener("cancel", () => record("capture-chooser", "observed", { cancelled: true }));
$("fixture").onclick = () => { selectedReceipt = undefined; translate(); record("receipt-fixture", "observed", {}); };
$("export").onclick = () => perform("raw-export", async () => {
  if (!current) throw new Error("NO_CAPTURE"); $("package").value = await encodePackage(current.capture);
  return { sha256: current.sha256, authentication: false, encryption: false };
});
$("download").onclick = () => perform("raw-download-request", async () => {
  const text = $("package").value; const decoded = await decodePackage(text); download(text, `p0-c05-${decoded.capture.captureId}.json`);
  return { requested: true, actualFileCreated: "manual-observation-required", sha256: decoded.sha256 };
});
$("importFile").onchange = () => perform("raw-file-read", async () => {
  const file = $("importFile").files?.[0]; if (!file) return { cancelled: true };
  if (file.size > MAX_PACKAGE_CHARS) throw new Error("PACKAGE_SIZE");
  const text = await file.text(); const decoded = await decodePackage(text); $("package").value = text; $("importFile").value = "";
  return { sha256: decoded.sha256, save: "not-yet-requested" };
});
$("import").onclick = () => perform("raw-import-readback", async () => {
  const business = $("business").value; const decoded = await decodeForBusiness($("package").value, business);
  await openStore(); const saved = await saveCapture(io, decoded.capture);
  showCapture(await loadCapture(saved.file)); await refreshList(saved.file);
  return { ...saved, businessId: business, accountingEntryCreated: false, senderAuthenticated: false };
});
$("notify").onclick = () => perform("notification-immediate-request", () => notify(host, false, language));
$("schedule").onclick = () => perform("notification-schedule-request", () => notify(host, true, language));
$("cancel").onclick = () => perform("notification-cancel-request", async () => { await cancelReminder(); return { requested: true }; });
$("report").onclick = () => perform("report-save-request", async () => {
  const report = { schemaVersion: 1, checkpointId: "P0.C05", fixtureVersion: VERSION, dataMode: "synthetic",
    probeSourceFingerprint: __SPIKE_FINGERPRINT__, runId, startedAt, recordedAt: new Date().toISOString(),
    nativeBridge: nativeAvailable, host, userAgent: navigator.userAgent,
    deviceVersions: $("device").value, manualObservations: $("observation").value,
    nativeProcessRestart: "not-verified", deviceReboot: "not-verified", notificationDelivery: "not-verified", checkpointVerified: false, events: [...events] };
  const text = JSON.stringify(report, null, 2); $("reportText").value = text; let nativeFile = null;
  if (nativeAvailable) { await openStore(); nativeFile = `p0-c05/report-${crypto.randomUUID()}.json`; await io.createExclusive(nativeFile, text); if (await io.read(nativeFile) !== text) throw new Error("READBACK_MISMATCH"); }
  download(text, `p0-c05-report-${runId}.json`);
  return { nativeFile, readbackMatched: nativeFile !== null, downloadRequested: true, downloadedFileCreated: "manual-observation-required" };
});
window.addEventListener("unhandledrejection", (event) => record("asynchronous-native-error", "failed-or-blocked", { error: String(event.reason) }));
window.addEventListener("pagehide", stopCamera); document.addEventListener("visibilitychange", () => { if (document.hidden) stopCamera(); });
translate();
hostInfo().then((info) => { host = info; record("session-start", "observed", { nativeBridge: nativeAvailable, host, runId, probeSourceFingerprint: __SPIKE_FINGERPRINT__ }); })
  .catch((error) => record("host-query", "failed-or-blocked", String(error)));
