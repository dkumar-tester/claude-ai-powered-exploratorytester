import { test, expect } from '@playwright/test';

test.describe('Suite 1: Login & Authentication', () => {
  test('1.5 Login with Empty Password', async ({ page }) => {
    const username = process.env.TEST_USERNAME ?? '';

    // Step 1: Navigate to the login page
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');

    // Step 2: Enter a valid username
    await page.getByLabel('Username').fill(username);

    // Step 3: Leave the Password field empty

    // Step 4: Click "Log In to Sandbox" button
    await page.getByRole('button', { name: 'Log In to Sandbox' }).click();

    // Expected: Error message is displayed or form validation prevents submission
    const errorMessage = page.getByText(/error|please enter|password/i);
    await expect(errorMessage.first()).toBeVisible({ timeout: 10000 });

    // User remains on the login page
    await expect(page.getByRole('button', { name: 'Log In to Sandbox' })).toBeVisible();
  });
});
