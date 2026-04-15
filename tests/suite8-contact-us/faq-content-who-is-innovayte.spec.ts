import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 8: Contact Us / FAQ', () => {
  test('8.2 FAQ Content - Who is Innovayte?', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Contact Us' }).first().click();
    await expect(page.getByText('Contact Us and Frequently Asked Questions')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Q: Who is Innovayte?')).toBeVisible();
    await expect(page.getByText(/ETC Brokerage Services and\/or Equity Trust Company/)).toBeVisible();
    await expect(page.getByText(/view-only/)).toBeVisible();
  });
});
