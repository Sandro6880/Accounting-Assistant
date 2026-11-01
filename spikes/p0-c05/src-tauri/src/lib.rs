// SPDX-License-Identifier: MPL-2.0
use std::collections::BTreeMap;
#[tauri::command]
fn probe_host() -> BTreeMap<&'static str, &'static str> {
    BTreeMap::from([("os", std::env::consts::OS), ("arch", std::env::consts::ARCH)])
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_notification::init())
        .invoke_handler(tauri::generate_handler![probe_host])
        .run(tauri::generate_context!())
        .expect("P0.C05 synthetic spike could not start");
}
