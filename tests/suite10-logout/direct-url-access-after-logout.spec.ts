import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 10: Logout', () => {
  test('10.3 Direct URL Access After Logout', async ({ page }) => {
    // Navigate to portal and check if session is valid
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    test.skip(currentUrl.includes('login'), 'Auth session expired - storageState is no longer valid');

    await expect(page.getByText(/Welcome to the Innovayte Investor Portal/)).toBeVisible({ timeout: 10000 });
    const homeUrl = page.url();

    // Step 2: Log out
    await page.locator('.slds-avatar, [class*="avatar"], [class*="profile"]').first().click();
    await page.getByText('Log Out').click();
    await page.waitForURL(/.*login.*/, { timeout: 15000 });

    // Step 3: Attempt to navigate directly to the Home page URL
    await page.goto(homeUrl);
    await page.waitForLoadState('networkidle');

    // Expected: User is redirected to the login page
    await expect(page.getByRole('button', { name: 'Log In to Sandbox' })).toBeVisible({ timeout: 15000 });
  });
});
