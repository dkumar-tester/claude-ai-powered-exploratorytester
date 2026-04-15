import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 6: Documents', () => {
  test('6.3 Documents Page via Navigation Bar', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Accounts' }).first().click();
    await expect(page.getByText('Investment Accounts').first()).toBeVisible({ timeout: 10000 });
    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Documents' }).first().click();
    await expect(page.getByText('Documents').first()).toBeVisible({ timeout: 10000 });
    const documentsNav = page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Documents' }).first();
    await expect(documentsNav).toBeVisible();
  });
});
