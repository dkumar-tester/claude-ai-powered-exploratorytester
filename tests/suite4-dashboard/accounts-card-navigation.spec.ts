import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 4: Home / Dashboard', () => {
  test('4.8 Accounts Card Navigation', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    const accountsCards = page.locator('.card, [class*="card"], [class*="tile"]').filter({ hasText: 'Accounts' });
    await accountsCards.first().click();
    await expect(page.getByText('Investment Accounts')).toBeVisible({ timeout: 10000 });
  });
});
