import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 5: Investment Accounts', () => {
  test('5.5 Accounts Page Refresh Button', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Accounts' }).first().click();
    await expect(page.getByText('Investment Accounts').first()).toBeVisible({ timeout: 10000 });
    const refreshButton = page.locator('button[title*="Refresh" i], button[aria-label*="Refresh" i], [class*="refresh"], button:has(svg)').first();
    await expect(refreshButton).toBeVisible();
    await refreshButton.click();
    await expect(page.getByText('Investment Accounts').first()).toBeVisible({ timeout: 10000 });
  });
});
