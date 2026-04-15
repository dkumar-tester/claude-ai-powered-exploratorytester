import { test, expect } from '@playwright/test';

test.describe('Suite 1: Login & Authentication', () => {
  test('1.6 Login with Both Fields Empty', async ({ page }) => {
    // Step 1: Navigate to the login page
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');

    // Step 2: Leave both Username and Password fields empty

    // Step 3: Click "Log In to Sandbox" button
    await page.getByRole('button', { name: 'Log In to Sandbox' }).click();

    // Expected: Error message is displayed
    const errorMessage = page.getByText(/error|please enter/i);
    await expect(errorMessage.first()).toBeVisible({ timeout: 10000 });

    // User remains on the login page
    await expect(page.getByRole('button', { name: 'Log In to Sandbox' })).toBeVisible();
  });
});
