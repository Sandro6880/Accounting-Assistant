// SPDX-License-Identifier: MPL-2.0
import { defineConfig } from "vite";
export default defineConfig({ build: { ssr: "desktop/main.ts", outDir: "desktop-dist", target: "node24", rollupOptions: { external: ["electron", /^node:/], output: { entryFileNames: "main.js" } } } });
