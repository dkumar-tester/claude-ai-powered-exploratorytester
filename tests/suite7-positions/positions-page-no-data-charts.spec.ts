import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 7: Positions', () => {
  test('7.2 Positions Page - No Data Charts', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Positions' }).first().click();
    await expect(page.getByText('Positions').first()).toBeVisible({ timeout: 10000 });
    const noDataMessages = page.getByText("We can't draw this chart because there is no data.");
    await expect(noDataMessages.first()).toBeVisible();
    const count = await noDataMessages.count();
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
