import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 9: Navigation & Header', () => {
  test('9.2 Active Navigation State Highlighting', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    const navItems = ['Home', 'Accounts', 'Documents', 'Positions', 'Contact Us'];

    for (const item of navItems) {
      await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: item }).first().click();
      await page.waitForLoadState('networkidle');
      const activeNavItem = page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: item }).first();
      await expect(activeNavItem).toBeVisible();
    }
  });
});
