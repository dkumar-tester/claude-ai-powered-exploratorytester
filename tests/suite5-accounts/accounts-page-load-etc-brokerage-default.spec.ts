import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 5: Investment Accounts', () => {
  test('5.1 Accounts Page Load - ETC Brokerage Services Tab (Default)', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Accounts' }).first().click();
    await expect(page.getByText('Investment Accounts').first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('ETC Brokerage Services')).toBeVisible();
    await expect(page.getByText('ACCOUNT #')).toBeVisible();
    await expect(page.getByText('NAME')).toBeVisible();
    await expect(page.getByText('CUSTODIAN')).toBeVisible();
    await expect(page.getByText('TYPE')).toBeVisible();
    await expect(page.getByText('CASH BALANCE')).toBeVisible();
    await expect(page.getByText('TOTAL MARKET VALUE')).toBeVisible();
  });
});
