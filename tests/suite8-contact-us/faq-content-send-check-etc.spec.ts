import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 8: Contact Us / FAQ', () => {
  test('8.3 FAQ Content - Where to Send a Check (ETC)', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Contact Us' }).first().click();
    await expect(page.getByText('Contact Us and Frequently Asked Questions')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Q: Where do I send a check?')).toBeVisible();
    await expect(page.getByText(/For ETC Brokerage Services/)).toBeVisible();
    await expect(page.getByText('Overnight Address:')).toBeVisible();
    await expect(page.getByText('1 Equity Way')).toBeVisible();
    await expect(page.getByText('Westlake, OH 44145').first()).toBeVisible();
    await expect(page.getByText('Regular Mail:')).toBeVisible();
    await expect(page.getByText('P. O. Box 451249')).toBeVisible();
  });
});
