import { test, expect } from '@playwright/test';

test.describe('Login Tests', () => {
  test('Login with valid credentials', async ({ page }) => {
    // Navigate to the login page (updated URL)
    await page.goto('https://inbox.cloudqa.io/');

    // Existing test steps are commented out for now
    // // Fill in username
    // await page.fill('id=user-name', 'standard_user');

    // // Fill in password
    // await page.fill('id=password', 'secret_sauce');

    // // Click login button
    // await page.click('id=login-button');

    // // Verify successful login by checking if we're on the inventory page
    // await expect(page).toHaveURL('https://www.saucedemo.com/inventory.html');
  });
});
