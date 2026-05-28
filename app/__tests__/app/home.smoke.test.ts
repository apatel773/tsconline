import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.waitForTimeout(4000);
});

test("navigation and login smoke works", async ({ page }) => {
  const presetsTab = page.locator(".qsg-presets");
  await expect(presetsTab).toBeVisible();
  await presetsTab.click();
  await expect(page).toHaveURL(/.*\/presets-view/);

  await page.goto("http://localhost:5173");

  const loginButton = page.locator("text=SIGN IN");
  await expect(loginButton).toBeVisible();
  await expect(loginButton).toBeEnabled();
  await loginButton.click();

  const acceptButton = page.locator("text=Accept");
  await expect(acceptButton).toBeVisible();
  await acceptButton.click();

  await expect(page).toHaveURL(/.*\/login/);
});