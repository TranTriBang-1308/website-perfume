import { test, expect } from "@playwright/test";

test("trang chủ hiển thị đúng", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Whisper of Scent/i);
  await expect(page.locator("header")).toBeVisible();
  await expect(page.locator("footer")).toBeVisible();
});

test("điều hướng tới trang sản phẩm", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /sản phẩm/i }).first().click();
  await expect(page).toHaveURL(/.*\/products/);
});

test("trang sản phẩm hiển thị danh sách", async ({ page }) => {
  await page.goto("/products");
  await expect(page.locator("main")).toBeVisible();
});
