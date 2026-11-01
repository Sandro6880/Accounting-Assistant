// SPDX-License-Identifier: MPL-2.0
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
const path = fileURLToPath(new URL("../src-tauri/gen/android/app/src/main/AndroidManifest.xml", import.meta.url));
let xml = readFileSync(path, "utf8");
if (!xml.includes("<manifest") || !xml.includes("xmlns:android=")) throw new Error("Unexpected generated Android manifest");
const additions = [];
for (const name of ["android.permission.CAMERA", "android.permission.POST_NOTIFICATIONS"])
  if (!xml.includes(`android:name="${name}"`)) additions.push(`    <uses-permission android:name="${name}" />`);
if (!xml.includes('android:name="android.hardware.camera.any"')) additions.push('    <uses-feature android:name="android.hardware.camera.any" android:required="false" />');
if (additions.length) xml = xml.replace(/(<manifest\b[^>]*>)/, `$1\n${additions.join("\n")}`);
if (!xml.includes('android:name="android.media.action.IMAGE_CAPTURE"')) {
  const query = '<intent><action android:name="android.media.action.IMAGE_CAPTURE" /></intent>';
  xml = xml.includes("<queries>") ? xml.replace("<queries>", `<queries>${query}`) : xml.replace("</manifest>", `    <queries>${query}</queries>\n</manifest>`);
}
if (!xml.includes("androidx.core.content.FileProvider")) {
  const provider = '\n        <provider android:name="androidx.core.content.FileProvider" android:authorities="${applicationId}.fileprovider" android:exported="false" android:grantUriPermissions="true"><meta-data android:name="android.support.FILE_PROVIDER_PATHS" android:resource="@xml/p0_c05_file_paths" /></provider>\n';
  if (!xml.includes("</application>")) throw new Error("Missing generated application element");
  xml = xml.replace("</application>", `${provider}</application>`);
  const resources = new URL("../src-tauri/gen/android/app/src/main/res/xml/", import.meta.url); mkdirSync(resources, { recursive: true });
  writeFileSync(new URL("p0_c05_file_paths.xml", resources), '<?xml version="1.0" encoding="utf-8"?><paths xmlns:android="http://schemas.android.com/apk/res/android"><external-files-path name="p0_c05_photos" path="Pictures/" /></paths>\n');
}
writeFileSync(path, xml);
const output = new URL("../../../outputs/", import.meta.url); mkdirSync(output, { recursive: true });
const report = { checkpointId: "P0.C05", recordedAt: new Date().toISOString(), manifestSha256: createHash("sha256").update(xml).digest("hex"), nativeExecution: "not-run", runtimePermissions: "not-granted-by-this-script" };
writeFileSync(new URL("p0-c05-android-preparation.json", output), JSON.stringify(report, null, 2) + "\n");
console.log("Prepared generated manifest; runtime permission and device behavior still need testing. SHA-256:", report.manifestSha256);
