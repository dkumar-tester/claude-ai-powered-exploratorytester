import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 8: Contact Us / FAQ', () => {
  test('8.4 FAQ Content - Where to Send a Check (Equity Trust)', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Contact Us' }).first().click();
    await expect(page.getByText('Contact Us and Frequently Asked Questions')).toBeVisible({ timeout: 10000 });
    const equityTrustSection = page.getByText(/Equity Trust Company/);
    await equityTrustSection.first().scrollIntoViewIfNeeded();
    await expect(page.getByText(/Equity Trust Company/).first()).toBeVisible();
  });
});
