import { test, expect } from '@playwright/test';

test.describe('Suite 1: Login & Authentication', () => {
  test('1.3 Login with Invalid Password', async ({ page }) => {
    const username = process.env.TEST_USERNAME ?? '';

    // Skip if no test username is configured
    test.skip(!username, 'TEST_USERNAME environment variable is not set');

    // Step 1: Navigate to the login page
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');

    // Step 2: Enter a valid username
    await page.getByLabel('Username').fill(username);

    // Step 3: Enter an incorrect password
    await page.getByLabel('Password').fill('WrongPassword123!');

    // Step 4: Click "Log In to Sandbox" button
    await page.getByRole('button', { name: 'Log In to Sandbox' }).click();

    // Wait for page to reload after form submission
    await page.waitForLoadState('load');

    // Expected: Error message is displayed
    const errorMessage = page.getByText(/please check your username and password|error|invalid/i);
    await expect(errorMessage.first()).toBeVisible({ timeout: 15000 });

    // User remains on the login page - fields are cleared
    await expect(page.getByRole('button', { name: 'Log In to Sandbox' })).toBeVisible();
  });
});
