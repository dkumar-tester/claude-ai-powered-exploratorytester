import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 5: Investment Accounts', () => {
  test('5.7 Account Count Display', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Accounts' }).first().click();
    await expect(page.getByText('Investment Accounts').first()).toBeVisible({ timeout: 10000 });
    const accountCountText = page.getByText(/Investment Accounts\s*\(\d+\)/);
    await expect(accountCountText).toBeVisible();
    const countText = await accountCountText.textContent();
    const match = countText?.match(/\((\d+)\)/);
    const displayedCount = match ? parseInt(match[1], 10) : -1;
    const noData = page.getByText('No data returned');
    if (await noData.isVisible({ timeout: 2000 }).catch(() => false)) {
      expect(displayedCount).toBe(0);
    } else {
      const rows = page.locator('table tbody tr, [class*="table"] [class*="row"]:not(:first-child)');
      const rowCount = await rows.count();
      expect(displayedCount).toBe(rowCount);
    }
  });
});
