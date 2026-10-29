// SPDX-License-Identifier: MPL-2.0
import { defineConfig, devices } from "@playwright/test";

// Optional CI/local test launcher; this does not configure the application.
const executablePath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;
const customArgs: unknown = JSON.parse(
  process.env.PLAYWRIGHT_CHROMIUM_ARGS ?? "[]",
);
if (
  !Array.isArray(customArgs) ||
  customArgs.some((value) => typeof value !== "string")
) {
  throw new Error("PLAYWRIGHT_CHROMIUM_ARGS must be a JSON array of strings");
}

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    launchOptions: executablePath
      ? { executablePath, args: customArgs as string[] }
      : {},
  },
  projects: [
    { name: "desktop-chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "npm run preview",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: false,
  },
});
