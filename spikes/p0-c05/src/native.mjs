// SPDX-License-Identifier: MPL-2.0
import { isTauri, invoke } from "@tauri-apps/api/core";
import { BaseDirectory, exists, mkdir, readDir, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { isPermissionGranted, requestPermission, sendNotification, createChannel, cancel, Schedule, Importance, Visibility } from "@tauri-apps/plugin-notification";
import { FOLDER, decodePackage, ensureMarkedStore } from "./protocol.mjs";
const options = { baseDir: BaseDirectory.AppLocalData };
export const nativeAvailable = isTauri();
export async function hostInfo() {
  return nativeAvailable ? invoke("probe_host") : { os: "browser-preview", arch: "unknown" };
}
export const io = {
  exists: (file) => exists(file, options), read: (file) => readTextFile(file, options),
  createExclusive: (file, text) => writeTextFile(file, text, { ...options, createNew: true }),
};
export async function openStore() {
  if (!nativeAvailable) throw new Error("NATIVE_REQUIRED");
  await ensureMarkedStore({ ...io, makeDirectory: (folder) => mkdir(folder, { ...options, recursive: true }) });
}
export async function listCaptures() {
  await openStore();
  return (await readDir(FOLDER, options)).filter((entry) => entry.isFile && /^capture-[0-9a-f-]{36}\.json$/.test(entry.name))
    .map((entry) => `${FOLDER}/${entry.name}`).sort();
}
export async function loadCapture(file) {
  await openStore();
  if (!(await listCaptures()).includes(file)) throw new Error("INVALID_LOCAL_FILE");
  const text = await io.read(file); const decoded = await decodePackage(text);
  if (file !== `p0-c05/capture-${decoded.capture.captureId}.json`) throw new Error("LOCAL_ID_MISMATCH");
  return { ...decoded, text };
}
export async function notify(host, delayed, language) {
  if (!nativeAvailable) throw new Error("NATIVE_REQUIRED");
  if (delayed && host.os !== "android") throw new Error("DESKTOP_SCHEDULE_UNSUPPORTED");
  let granted = await isPermissionGranted();
  if (!granted) granted = await requestPermission() === "granted";
  if (!granted) return { permission: "denied", delivery: "not-requested" };
  if (host.os === "android") await createChannel({ id: "p0-c05", name: "P0.C05 synthetic probe", importance: Importance.Default, visibility: Visibility.Private });
  const due = delayed ? new Date(Date.now() + 60000) : null;
  // Returns void: requesting a notification is not delivery confirmation.
  sendNotification({ id: delayed ? 5006 : 5005, title: "P0.C05 — synthetic / fiktiv",
    body: language === "de" ? "Fiktive Test-Erinnerung. Keine echte Frist." : "Fictional test reminder. No real deadline.",
    ...(host.os === "android" ? { channelId: "p0-c05" } : {}), ...(due ? { schedule: Schedule.at(due) } : {}),
  });
  return { permission: "granted", delivery: "requested-unconfirmed", due: due?.toISOString() ?? null };
}
export async function cancelReminder() {
  if (!nativeAvailable) throw new Error("NATIVE_REQUIRED");
  await cancel([5006]);
}
