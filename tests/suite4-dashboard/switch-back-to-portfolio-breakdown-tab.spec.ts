import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 4: Home / Dashboard', () => {
  test('4.4 Switch Back to Portfolio Breakdown Tab', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.getByText('Portfolio Breakdown').first().scrollIntoViewIfNeeded();
    await page.getByText('Positions by Custodian').click();
    await expect(page.getByText('Positions by Custodian')).toBeVisible();
    await page.getByText('Portfolio Breakdown').last().click();
    await expect(page.getByText('Portfolio Breakdown').last()).toBeVisible();
  });
});
