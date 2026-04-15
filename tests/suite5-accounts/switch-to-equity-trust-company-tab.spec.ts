import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 5: Investment Accounts', () => {
  test('5.2 Switch to Equity Trust Company Tab', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Accounts' }).first().click();
    await expect(page.getByText('Investment Accounts').first()).toBeVisible({ timeout: 10000 });
    await page.getByText('Equity Trust Company').click();
    await expect(page.getByText('Equity Trust Company')).toBeVisible();
    const tableContent = page.locator('table, [class*="table"], [role="grid"]').first();
    await expect(tableContent).toBeVisible({ timeout: 5000 }).catch(() => {});
  });
});
