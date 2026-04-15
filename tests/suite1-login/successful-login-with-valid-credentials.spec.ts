import { test, expect } from '@playwright/test';

test.describe('Suite 1: Login & Authentication', () => {
  test('1.1 Successful Login with Valid Credentials', async ({ page }) => {
    const username = process.env.TEST_USERNAME ?? '';
    const password = process.env.TEST_PASSWORD ?? '';

    // Skip if no test credentials are configured
    test.skip(!username || !password, 'TEST_USERNAME and/or TEST_PASSWORD environment variables are not set');

    // Step 1: Navigate to the login page
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');

    // Step 2: Verify the login page displays with required elements
    await expect(page.locator('img[alt*="innovayte" i], img[src*="innovayte" i], .logo, img[alt*="logo" i]').first()).toBeVisible();
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log In to Sandbox' })).toBeVisible();
    await expect(page.getByLabel('Remember me')).toBeVisible();
    await expect(page.getByText('Forgot Your Password?')).toBeVisible();

    // Step 3: Enter valid username in the Username field
    await page.getByLabel('Username').fill(username);

    // Step 4: Enter valid password in the Password field
    await page.getByLabel('Password').fill(password);

    // Step 5: Click "Log In to Sandbox" button
    await page.getByRole('button', { name: 'Log In to Sandbox' }).click();

    // Step 6: If MFA verification appears, handle it
    // Wait for either the dashboard or the MFA page
    await page.waitForURL(/.*/, { timeout: 15000 });

    // Check if MFA page appeared
    const mfaHeading = page.getByText('Verify Your Identity');
    if (await mfaHeading.isVisible({ timeout: 5000 }).catch(() => false)) {
      // MFA verification page appeared - this test acknowledges MFA may be required
      await expect(mfaHeading).toBeVisible();
    } else {
      // Step 7: User is redirected to the Home/Dashboard page
      await expect(page.getByText(/Welcome to the Innovayte Investor Portal/)).toBeVisible({ timeout: 15000 });
    }
  });
});
