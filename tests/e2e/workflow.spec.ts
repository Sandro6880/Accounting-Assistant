// SPDX-License-Identifier: MPL-2.0
import { test, expect } from "@playwright/test";

test("draft, post and reversal preserve the original and correct totals", async ({
  page,
}) => {
  await page.goto("/");
  page.on("dialog", (dialog) => dialog.accept());
  await expect(page.getByTestId("total-net")).toHaveText("€1,120.10");
  await page.getByRole("button", { name: "Entries", exact: true }).click();
  await page.getByLabel("Fictional description").fill("E2E fictional expense");
  await page.getByLabel("Amount", { exact: true }).fill("10,05");
  await page.getByLabel("Date", { exact: true }).fill("2026-01-20");
  await page.getByRole("button", { name: "Save draft", exact: true }).click();
  const row = page
    .getByRole("row")
    .filter({ hasText: "E2E fictional expense" });
  await expect(row).toHaveCount(1);
  await row.getByRole("button", { name: "Post", exact: true }).click();
  await page.getByRole("button", { name: "Overview", exact: true }).click();
  await expect(page.getByTestId("total-net")).toHaveText("€1,110.05");
  await page.getByRole("button", { name: "Entries", exact: true }).click();
  await row.getByRole("button", { name: "Reverse", exact: true }).click();
  await expect(
    page.getByRole("row").filter({ hasText: "E2E fictional expense" }),
  ).toHaveCount(2);
  await page.getByRole("button", { name: "Overview", exact: true }).click();
  await expect(page.getByTestId("total-net")).toHaveText("€1,120.10");
});
test("business and language switches preserve the draft under its original business", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Entries", exact: true }).click();
  await page
    .getByLabel("Fictional description")
    .fill("Fictional unsaved description");
  await page.getByLabel("Amount", { exact: true }).fill("12,34");
  await page.getByRole("button", { name: "DE", exact: true }).click();
  await expect(page.getByLabel("Fiktive Beschreibung")).toHaveValue(
    "Fictional unsaved description",
  );
  await page.getByLabel("Betrieb", { exact: true }).selectOption("demo-studio");
  await expect(page.getByLabel("Fiktive Beschreibung")).toHaveValue("");
  await expect(
    page.getByRole("row").filter({ hasText: "Fictional project payment" }),
  ).toHaveCount(0);
  await page
    .getByLabel("Betrieb", { exact: true })
    .selectOption("demo-consulting");
  await expect(page.getByLabel("Fiktive Beschreibung")).toHaveValue(
    "Fictional unsaved description",
  );
  await expect(page.getByLabel("Betrag", { exact: true })).toHaveValue("12,34");
});
test("browser lab starts not-run, executes checks, and refresh resets session data", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Test Lab", exact: true }).click();
  await expect(
    page.getByText("Not run", { exact: true }).first(),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "Run browser checks", exact: true })
    .click();
  await expect(page.locator(".check-row .success")).toHaveCount(9);
  await page.getByRole("button", { name: "Businesses", exact: true }).click();
  await page
    .getByLabel("Fictional business name")
    .fill("E2E fictional business");
  await page
    .getByRole("button", { name: "Create business", exact: true })
    .click();
  await expect(page.getByLabel("Business", { exact: true })).toHaveValue(/.+/);
  await page.reload();
  await expect(
    page.getByLabel("Business", { exact: true }).locator("option"),
  ).toHaveCount(2);
  expect(await page.evaluate(() => Object.keys(localStorage))).toEqual([]);
  expect(await page.evaluate(() => Object.keys(sessionStorage))).toEqual([]);
});
