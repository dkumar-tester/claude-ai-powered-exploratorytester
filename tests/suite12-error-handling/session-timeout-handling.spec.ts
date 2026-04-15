import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 12: Error Handling & Edge Cases', () => {
  test('12.3 Session Timeout Handling', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await expect(page.getByText(/Welcome to the Innovayte Investor Portal/)).toBeVisible({ timeout: 10000 });

    await page.context().clearCookies();

    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Accounts' }).first().click();

    await page.waitForLoadState('networkidle');

    const loginButton = page.getByRole('button', { name: 'Log In to Sandbox' });
    const isLoginVisible = await loginButton.isVisible({ timeout: 15000 }).catch(() => false);

    expect(isLoginVisible).toBeTruthy();
  });
});
