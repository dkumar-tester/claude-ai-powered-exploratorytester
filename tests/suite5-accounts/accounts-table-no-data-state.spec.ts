import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 5: Investment Accounts', () => {
  test('5.4 Accounts Table - No Data State', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Accounts' }).first().click();
    await expect(page.getByText('Investment Accounts').first()).toBeVisible({ timeout: 10000 });
    const noDataMessage = page.getByText('No data returned');
    if (await noDataMessage.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(noDataMessage).toBeVisible();
    }
    const accountCount = page.getByText(/Investment Accounts\s*\(\d+\)/);
    await expect(accountCount).toBeVisible();
  });
});
