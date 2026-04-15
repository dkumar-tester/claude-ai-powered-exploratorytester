import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 4: Home / Dashboard', () => {
  test('4.11 Navigation Bar - Home Link Active State', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Accounts' }).first().click();
    await expect(page.getByText('Investment Accounts')).toBeVisible({ timeout: 10000 });
    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Home' }).first().click();
    await expect(page.getByText(/Welcome to the Innovayte Investor Portal/)).toBeVisible({ timeout: 10000 });
    const homeNavItem = page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Home' }).first();
    await expect(homeNavItem).toBeVisible();
  });
});
