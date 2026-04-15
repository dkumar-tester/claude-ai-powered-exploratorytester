import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 9: Navigation & Header', () => {
  test('9.3 Navigation Consistency Across Pages', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await expect(page.getByText(/Welcome to the Innovayte Investor Portal/)).toBeVisible({ timeout: 10000 });
    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Accounts' }).first().click();
    await expect(page.getByText('Investment Accounts').first()).toBeVisible({ timeout: 10000 });
    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Documents' }).first().click();
    await expect(page.getByText('Documents').first()).toBeVisible({ timeout: 10000 });
    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Positions' }).first().click();
    await expect(page.getByText('Positions').first()).toBeVisible({ timeout: 10000 });
    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Contact Us' }).first().click();
    await expect(page.getByText('Contact Us and Frequently Asked Questions')).toBeVisible({ timeout: 10000 });
  });
});
