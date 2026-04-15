import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 4: Home / Dashboard', () => {
  test('4.10 Positions Card Navigation', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    const positionsCards = page.locator('.card, [class*="card"], [class*="tile"]').filter({ hasText: 'Positions' });
    await positionsCards.first().click();
    await expect(page.getByText('Positions').first()).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/.*position.*/i);
  });
});
