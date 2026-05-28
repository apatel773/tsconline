import { defineConfig, devices } from "@playwright/test";

const browserNames = (process.env.PLAYWRIGHT_BROWSERS ?? (process.env.CI ? "chromium" : "chromium,firefox,webkit"))
  .split(",")
  .map((browserName) => browserName.trim())
  .filter(Boolean);

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  timeout: 100000,
  expect: {
    timeout: 100000
  },
  /* Maximum time each action can take. Defaults to 0 (no limit).*/
  testDir: "./app/__tests__/app/",
  testMatch: process.env.PLAYWRIGHT_SMOKE_ONLY === "false" ? "**/*.test.ts" : "**/*.smoke.test.ts",
  /* Run tests in files in parallel */
  fullyParallel: true, // Set to false to avoid fully parallel execution
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: 2,
  /* Opt out of parallel tests on CI. */
  workers: undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? "html" : "line",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://localhost:5173",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry"
  },

  /* Configure projects for major browsers */
  projects: browserNames.map((browserName) => ({
    name: browserName,
    use:
      browserName === "firefox"
        ? {
            ...devices["Desktop Firefox"],
            viewport: { width: 1024, height: 768 },
            deviceScaleFactor: 1,
            isMobile: false,
            hasTouch: false,
            headless: true
          }
        : browserName === "webkit"
          ? {
              ...devices["Desktop Safari"],
              viewport: { width: 1024, height: 768 },
              deviceScaleFactor: 1,
              isMobile: false,
              hasTouch: false,
              headless: true
            }
          : {
              ...devices["Desktop Chrome"],
              viewport: { width: 1024, height: 768 },
              deviceScaleFactor: 1,
              isMobile: false,
              hasTouch: false,
              headless: true
            }
  })),

  /* Run your local dev server before starting the tests */
  webServer: {
    command: "yarn dev:playwright",
    url: "http://localhost:5173",
    reuseExistingServer: !process.env.CI
  }
});
