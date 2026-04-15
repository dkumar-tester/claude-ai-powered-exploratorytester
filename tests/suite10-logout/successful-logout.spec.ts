import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 10: Logout', () => {
  test('10.1 Successful Logout', async ({ page }) => {
    // Navigate to portal and check if session is valid
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    test.skip(currentUrl.includes('login'), 'Auth session expired - storageState is no longer valid');

    await expect(page.getByText(/Welcome to the Innovayte Investor Portal/)).toBeVisible({ timeout: 10000 });

    // Click the user profile icon in the top-right corner
    await page.locator('.slds-avatar, [class*="avatar"], [class*="profile"]').first().click();
    await expect(page.getByText('Log Out')).toBeVisible({ timeout: 5000 });

    // Step 2: Click "Log Out" from the dropdown menu
    await page.getByText('Log Out').click();

    // Expected: User is logged out and redirected to the login page
    await page.waitForURL(/.*login.*/, { timeout: 15000 });
    await expect(page.getByLabel('Username')).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Log In to Sandbox' })).toBeVisible();
  });
});
