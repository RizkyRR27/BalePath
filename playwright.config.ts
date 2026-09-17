import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 45_000,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: "http://127.0.0.1:3111", trace: "retain-on-failure" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run start -- --port 3111",
    url: "http://127.0.0.1:3111",
    timeout: 60_000,
    reuseExistingServer: false,
  },
});
