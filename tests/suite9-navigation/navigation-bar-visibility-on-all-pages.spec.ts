import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 9: Navigation & Header', () => {
  test('9.1 Navigation Bar Visibility on All Pages', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    const navItems = ['Home', 'Accounts', 'Documents', 'Positions', 'Contact Us'];
    const pages = [
      { nav: 'Home' },
      { nav: 'Accounts' },
      { nav: 'Documents' },
      { nav: 'Positions' },
      { nav: 'Contact Us' },
    ];

    for (const pageInfo of pages) {
      await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: pageInfo.nav }).first().click();
      await page.waitForLoadState('domcontentloaded');

      for (const item of navItems) {
        await expect(
          page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: item }).first()
        ).toBeVisible({ timeout: 10000 });
      }

      await expect(page.locator('.slds-avatar, [class*="avatar"], [class*="profile"]').first()).toBeVisible();
    }
  });
});
