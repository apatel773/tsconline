import { test, expect, Page } from "@playwright/test";

async function removeAutoLoadedDatapack(page: Page) {
  await page.getByRole("button", { name: "Deselect All" }).click();
  await page.getByRole("button", { name: "Confirm Selection" }).click();
}

async function generateBasicChart(page: Page) {
  const container = page.locator("text=Africa Bight").locator("..").locator("..").locator("..");
  const addButton = container.locator(".add-circle");

  await expect(addButton).toBeVisible();
  await addButton.click();

  const svg = page.locator("svg").first();
  await expect(svg).toBeVisible();

  const confirmButton = page.locator("text=Confirm Selection");
  await expect(confirmButton).toBeVisible();
  await confirmButton.click();

  await expect(page.locator("text=Loading Datapacks")).toBeHidden();

  const configMessage = page.locator("text=Datapack Config Updated");
  await configMessage.waitFor({ state: "visible" }).catch(() => {
    console.warn("Datapack Config Updated message not shown");
  });

  const generateChart = page.locator("text=Generate Chart");
  await expect(generateChart).toBeVisible();
  await generateChart.click();

  await expect(page.locator("text=Loading Chart")).toBeHidden();
  await expect(page.locator("text=Successfully generated chart")).toBeVisible();
  await expect(page.locator("text=Central Africa Cenozoic")).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto("http://localhost:5173");
  await page.waitForTimeout(5000);

  await page.locator(".qsg-datapacks").click();
  await page.waitForTimeout(1000);
  await removeAutoLoadedDatapack(page);

  await expect(page.locator("text=Africa Bight")).toBeVisible();
});

test("chart smoke test", async ({ page }) => {
  await generateBasicChart(page);

  const chartSvg = page.locator(".react-transform-component svg");
  await expect(chartSvg.locator(`text=9`)).toBeVisible();
  await expect(chartSvg.locator("text=Delta").first()).toBeVisible();
  await expect(chartSvg.locator("text=ProDelta").last()).toBeVisible();
});