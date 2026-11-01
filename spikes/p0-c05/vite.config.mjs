// SPDX-License-Identifier: MPL-2.0
import { defineConfig } from "vite";
import { fingerprint } from "./scripts/fingerprint.mjs";
export default defineConfig({
  define: { __SPIKE_FINGERPRINT__: JSON.stringify(fingerprint()) },
  server: { host: "127.0.0.1", port: 1420, strictPort: true }, build: { target: "es2022" },
});
