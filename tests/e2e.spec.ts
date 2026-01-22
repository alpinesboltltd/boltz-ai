import { test, expect } from "@playwright/test";

const mockUser = {
  id: "test-user-id",
  email: "test@boltz.ai",
  name: "Test User",
  role: "admin",
  avatar: "https://ui-avatars.com/api/?name=Test+User",
};

const authState = {
  state: {
    user: mockUser,
    token: "mock-token",
    isAuthenticated: true,
  },
  version: 0,
};

test.beforeEach(async ({ page }) => {
  // Listen for console logs
  page.on("console", (msg) => console.log(`BROWSER LOG: ${msg.text()}`));
  page.on("pageerror", (err) => console.log(`BROWSER ERROR: ${err}`));

  await page.addInitScript((value) => {
    window.localStorage.setItem("boltz-auth-storage", JSON.stringify(value));
    window.localStorage.setItem(
      "boltz_by_alpinesbolt_auth_token",
      "mock-token"
    );
    document.cookie =
      "boltz_by_alpinesbolt_auth_token=mock-token; path=/; secure; samesite=strict";
  }, authState);
});

test.describe("Dashboard Flow", () => {
  test("should navigate to dashboard and verify sidebar", async ({ page }) => {
    await page.goto("/dashboard");

    // Check if loading appears
    const loading = page.getByText("Loading workspace...");
    if (await loading.isVisible()) {
      await expect(loading).not.toBeVisible({ timeout: 10000 });
    }

    // Verify Sidebar is present
    const sidebar = page.locator("aside");

    // Debug bounding box
    const box = await sidebar.boundingBox();
    console.log("Sidebar Bounding Box:", box);

    await expect(sidebar).toBeVisible();

    // Verify "Level-x" logo text
    await expect(page.getByText("Level-x", { exact: true })).toBeVisible();

    // Verify Navigation Links
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Analytics" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Settings" })).toBeVisible();
  });

  test("should navigate to Create Agent page", async ({ page }) => {
    await page.goto("/dashboard/create");

    // Wait for loading to finish
    await expect(page.getByText("Loading workspace...")).not.toBeVisible({
      timeout: 10000,
    });

    // Verify Create Agent page content
    await expect(page.getByText("Create New Agent")).toBeVisible();
    await expect(
      page.getByPlaceholder("e.g. Customer Support Bot")
    ).toBeVisible();
  });

  test("should navigate to Settings page", async ({ page }) => {
    await page.goto("/dashboard/settings");

    // Wait for loading to finish
    await expect(page.getByText("Loading workspace...")).not.toBeVisible({
      timeout: 10000,
    });

    // Verify Settings page content
    await expect(page.getByText("Settings")).toBeVisible();
    await expect(page.getByText("Profile")).toBeVisible();
  });
});
