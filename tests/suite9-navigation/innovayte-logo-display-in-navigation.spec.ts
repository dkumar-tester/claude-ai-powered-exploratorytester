import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 9: Navigation & Header', () => {
  test('9.4 Innovayte Logo Display in Navigation', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    const logo = page.locator('header img, nav img, [class*="nav"] img, [class*="header"] img').first();
    await expect(logo).toBeVisible();
  });
});
