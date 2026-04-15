import { test, expect } from '@playwright/test';

test.describe('Suite 1: Login & Authentication', () => {
  test('1.7 Remember Me Checkbox Functionality', async ({ page }) => {
    const username = process.env.TEST_USERNAME ?? '';
    const password = process.env.TEST_PASSWORD ?? '';

    // Skip if no test credentials are configured
    test.skip(!username || !password, 'TEST_USERNAME and/or TEST_PASSWORD environment variables are not set');

    // Step 1: Navigate to the login page
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');

    // Step 2: Enter valid credentials
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password').fill(password);

    // Step 3: Check the "Remember me" checkbox
    await page.getByLabel('Remember me').check();
    await expect(page.getByLabel('Remember me')).toBeChecked();

    // Step 4: Click "Log In to Sandbox" button
    await page.getByRole('button', { name: 'Log In to Sandbox' }).click();

    // Step 5: Complete MFA if required
    await page.waitForURL(/.*/, { timeout: 15000 });
    const mfaHeading = page.getByText('Verify Your Identity');
    if (await mfaHeading.isVisible({ timeout: 5000 }).catch(() => false)) {
      // MFA present - test would need external code input in real scenario
      test.skip(true, 'MFA verification required - cannot complete Remember Me test without MFA automation');
    }

    // Step 6: Log out of the portal
    // Click user profile icon and then Log Out
    await page.locator('.userProfileCard, [class*="profile"], .slds-avatar, img[alt*="User"]').first().click({ timeout: 5000 }).catch(async () => {
      // Try alternative selectors for user profile
      await page.locator('.profileTrigger, [class*="avatar"], .uiImage').first().click();
    });
    await page.getByText('Log Out').click();

    // Step 7: Navigate back to the login page
    await page.waitForURL(/.*login.*/);

    // Expected: The Username field is pre-populated with the previously used username
    const usernameField = page.getByLabel('Username');
    await expect(usernameField).toHaveValue(username);
  });
});
