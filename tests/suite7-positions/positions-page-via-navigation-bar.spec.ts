import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 7: Positions', () => {
  test('7.4 Positions Page via Navigation Bar', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Accounts' }).first().click();
    await expect(page.getByText('Investment Accounts').first()).toBeVisible({ timeout: 10000 });
    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Positions' }).first().click();
    await expect(page.getByText('Positions').first()).toBeVisible({ timeout: 10000 });
    const positionsNav = page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Positions' }).first();
    await expect(positionsNav).toBeVisible();
  });
});
