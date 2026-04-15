import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 4: Home / Dashboard', () => {
  test('4.3 Switch to Positions by Custodian Tab', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.getByText('Portfolio Breakdown').first().scrollIntoViewIfNeeded();
    await page.getByText('Positions by Custodian').click();
    await expect(page.getByText('Positions by Custodian')).toBeVisible();
  });
});
