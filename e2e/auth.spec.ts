import { test, expect } from "@playwright/test";

test("trang đăng nhập hiển thị form", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByLabel(/email/i)).toBeVisible();
  await expect(page.getByLabel(/mật khẩu/i)).toBeVisible();
});

test("trang đăng ký hiển thị form", async ({ page }) => {
  await page.goto("/register");
  await expect(page.getByLabel(/email/i)).toBeVisible();
});

test("bảo vệ route /admin khi chưa đăng nhập", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/.*\/login/);
});

test("bảo vệ route /account khi chưa đăng nhập", async ({ page }) => {
  await page.goto("/account");
  await expect(page).toHaveURL(/.*\/login/);
});
