import { test, expect } from '@playwright/test';

test.describe('Suite 1: Login & Authentication', () => {
  test('1.4 Login with Empty Username', async ({ page }) => {
    // Step 1: Navigate to the login page
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');

    // Step 2: Leave the Username field empty (do not fill it)

    // Step 3: Enter any password
    await page.getByLabel('Password').fill('SomePassword123!');

    // Step 4: Click "Log In to Sandbox" button
    await page.getByRole('button', { name: 'Log In to Sandbox' }).click();

    // Wait for page to reload after form submission (server roundtrip)
    await page.waitForLoadState('load');

    // Expected: Error message is displayed or form validation prevents submission
    const errorMessage = page.getByText(/Please enter your username/i);
    await expect(errorMessage.first()).toBeVisible({ timeout: 15000 });

    // User remains on the login page
    await expect(page.getByRole('button', { name: 'Log In to Sandbox' })).toBeVisible();
  });
});
