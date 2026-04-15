import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 5: Investment Accounts', () => {
  test('5.3 Switch Between Custodian Tabs', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Accounts' }).first().click();
    await expect(page.getByText('Investment Accounts').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('ETC Brokerage Services')).toBeVisible();
    await page.getByText('Equity Trust Company').click();
    await expect(page.getByText('Equity Trust Company')).toBeVisible();
    await page.getByText('ETC Brokerage Services').click();
    await expect(page.getByText('ETC Brokerage Services')).toBeVisible();
  });
});
