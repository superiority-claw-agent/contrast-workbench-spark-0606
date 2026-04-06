import { expect, test } from "@playwright/test";

test("evaluates presets, swap, and invalid guidance", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Contrast Workbench" })).toBeVisible();
  await expect(page.getByTestId("contrast-ratio")).toHaveText(/:1$/);

  await page.getByRole("button", { name: /Warning Example/ }).click();
  await expect(page.getByTestId("contrast-ratio")).toHaveText("1.92:1");
  await expect(page.getByText("Fail").first()).toBeVisible();

  await page.getByRole("button", { name: "Swap foreground and background colors" }).click();
  await expect(page.locator("#foreground-hex")).toHaveValue("#FFF6E8");
  await expect(page.locator("#background-hex")).toHaveValue("#F4A261");

  await page.locator("#foreground-hex").fill("#12345678");
  await expect(page.getByText("Use opaque hex only. Alpha formats are out of scope in v1.")).toBeVisible();
  await expect(page.getByTestId("contrast-ratio")).toHaveText("1.92:1");
  await expect(page.getByText("Unavailable").first()).toBeVisible();
});
