import { test, expect } from '@playwright/test';

const USERNAME = process.env.TEST_USER_USERNAME ?? "standard_user";
const PASSWORD = process.env.TEST_USER_PASSWORD ?? "pizza123";

test.describe("Smoke Omnipizza platform tests cases", () =>{
  test("TC-001 - Succesfull Omnipizza login using valide user", {tag: "@smoke"}, async ({ page }) => {
    // Arrange
    await page.goto("/");

    // Act
    await page.getByTestId("username-desktop").fill(USERNAME);
    await page.getByTestId("password-desktop").fill(PASSWORD);

    await page.getByTestId("market-MX").click();

    await page.getByTestId("login-button-desktop").click();
    
    // Assert
    await expect(page).toHaveURL(/\/catalog/);
  })
})
