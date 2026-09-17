import { expect, test } from "@playwright/test";

const VIEWPORTS: { width: number; height: number }[] = [
  { width: 390, height: 844 },
  { width: 393, height: 852 },
  { width: 402, height: 874 },
  { width: 768, height: 1024 },
  { width: 820, height: 1180 },
  { width: 1024, height: 1366 },
  { width: 1920, height: 1080 },
];

async function loginAdmin(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Email admin").fill("admin@banjarkaja.id");
  await page.getByPlaceholder("Masukkan password").fill("admin123");
  await page.getByRole("button", { name: "Masuk ke dasbor" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test("admin login flow protects dashboard", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await loginAdmin(page);
  await expect(page.getByRole("heading", { name: /Prajuru Banjar/ })).toBeVisible();
  await page.getByRole("button", { name: "Keluar dari akun" }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("admin login rejects wrong credentials", async ({ page }) => {
  await page.goto("/admin/login");
  await page.getByLabel("Email admin").fill("admin@banjarkaja.id");
  await page.getByPlaceholder("Masukkan password").fill("salah");
  await page.getByRole("button", { name: "Masuk ke dasbor" }).click();
  await expect(page.locator(".error-message")).toContainText("tidak sesuai");
});

test("public map shows dummy ceremony and updates detail", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Ruang untuk tradisi/ })).toBeVisible();
  const agenda = page.getByRole("button", { name: /Pitra Yadnya/ });
  await expect(agenda.first()).toBeVisible();
  await agenda.first().click();
  await expect(page.getByRole("heading", { name: /Makna upacara/ })).toBeVisible();
});

test("calendar opens event detail", async ({ page }) => {
  await page.goto("/kalender");
  await expect(page.getByRole("heading", { name: /Kalender/ })).toBeVisible();
  await page.getByRole("button", { name: /17 September 2026/ }).click();
  await expect(page.getByRole("heading", { name: "Pitra Yadnya · Ngaben Ageng" })).toBeVisible();
});

test("public nav collapses to hamburger on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".public-nav")).toBeHidden();
  await page.getByRole("button", { name: "Buka menu" }).click();
  await expect(page.locator(".public-mobile-nav")).toBeVisible();
  await page.locator(".public-mobile-nav").getByRole("link", { name: "Kalender Yadnya" }).click();
  await expect(page).toHaveURL(/\/kalender$/);
  await expect(page.locator(".public-mobile-nav")).toBeHidden();
});

test("desktop public layout uses wide container", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/");
  await expect(page.locator(".public-nav")).toBeVisible();
  const width = await page.locator(".public-container").evaluate((el) => el.getBoundingClientRect().width);
  expect(width).toBeGreaterThanOrEqual(1600);
});

test("admin dashboard: sidebar on desktop, rows on mobile, no overflow", async ({ page }) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await loginAdmin(page);
  const sidebar = page.locator(".admin-sidebar");
  await expect(sidebar).toBeVisible();
  const box = await sidebar.boundingBox();
  expect(box?.width).toBeLessThanOrEqual(280);
  await expect(page.locator(".admin-topbar")).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(sidebar).toBeVisible();
  const mobileBox = await sidebar.boundingBox();
  expect(mobileBox?.height).toBeLessThan(400);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("admin workspace uses two columns on tablet", async ({ page }) => {
  await page.setViewportSize({ width: 820, height: 1180 });
  await loginAdmin(page);
  const columns = await page.locator(".admin-workspace").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(2);
});

for (const viewport of VIEWPORTS) {
  test(`no horizontal overflow at ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport);
    for (const path of ["/", "/kalender", "/admin/login"]) {
      await page.goto(path);
      await expect(page.getByRole("contentinfo").or(page.getByRole("heading", { name: /Ruang untuk tradisi|Kalender|Selamat datang/ })).first()).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${path} overflows by ${overflow}px`).toBeLessThanOrEqual(0);
    }
  });
}
