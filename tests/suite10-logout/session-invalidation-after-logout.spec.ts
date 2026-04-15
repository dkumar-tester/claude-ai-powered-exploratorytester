import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 10: Logout', () => {
  test('10.2 Session Invalidation After Logout', async ({ page }) => {
    // Navigate to portal and check if session is valid
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    const currentUrl = page.url();
    test.skip(currentUrl.includes('login'), 'Auth session expired - storageState is no longer valid');

    await expect(page.getByText(/Welcome to the Innovayte Investor Portal/)).toBeVisible({ timeout: 10000 });

    // Log out
    await page.locator('.slds-avatar, [class*="avatar"], [class*="profile"]').first().click();
    await page.getByText('Log Out').click();
    await page.waitForURL(/.*login.*/, { timeout: 15000 });

    // Step 2: Use the browser back button to try to access the Home/Dashboard page
    await page.goBack();

    // Expected: User is redirected to the login page. No authenticated content is accessible.
    await page.waitForLoadState('networkidle');

    const loginButton = page.getByRole('button', { name: 'Log In to Sandbox' });
    const welcomeMessage = page.getByText(/Welcome to the Innovayte Investor Portal/);

    const isLoginVisible = await loginButton.isVisible({ timeout: 10000 }).catch(() => false);
    const isWelcomeVisible = await welcomeMessage.isVisible({ timeout: 3000 }).catch(() => false);

    expect(isLoginVisible || !isWelcomeVisible).toBeTruthy();
  });
});
