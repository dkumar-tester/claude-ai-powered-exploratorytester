import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 4: Home / Dashboard', () => {
  test('4.5 Verify Total Market Value Display', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    const totalMarketValue = page.getByText(/Total Market Value:/);
    await expect(totalMarketValue).toBeVisible();
    await expect(page.getByText(/Total Market Value:\s*\$[\d,]+\.\d{2}/)).toBeVisible();
    await expect(page.getByText('Value as of Last Market Close')).toBeVisible();
  });
});
