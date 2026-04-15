import { test, expect } from '@playwright/test';

test.describe('Suite 1: Login & Authentication', () => {
  test('1.2 Login with Invalid Username', async ({ page }) => {
    // Step 1: Navigate to the login page
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');

    // Step 2: Enter an invalid/non-existent username
    await page.getByLabel('Username').fill('invaliduser@test.com');

    // Step 3: Enter any password
    await page.getByLabel('Password').fill('InvalidPassword123!');

    // Step 4: Click "Log In to Sandbox" button
    await page.getByRole('button', { name: 'Log In to Sandbox' }).click();

    // Expected: Error message is displayed
    await expect(page.getByText('Please check your username and password. If you still can\'t log in, contact your Innovayte Portal administrator.')).toBeVisible({ timeout: 10000 });

    // User remains on the login page
    await expect(page.getByRole('button', { name: 'Log In to Sandbox' })).toBeVisible();
  });
});
