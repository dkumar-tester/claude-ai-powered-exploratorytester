import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 11: Footer', () => {
  test('11.1 Footer Content Verification', async ({ page }) => {
    // Check if session is valid
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Accounts' }).first().click();
    await expect(page.getByText('Investment Accounts').first()).toBeVisible({ timeout: 10000 });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await expect(page.getByText('© Innovayte 2026')).toBeVisible();
    await expect(page.getByText(/Clearing, custody or other brokerage services provided by ETC Brokerage Services, LLC/)).toBeVisible();
    await expect(page.getByText(/Innovayte is an affiliate of ETC Brokerage Services, LLC/)).toBeVisible();
    await expect(page.getByText('Terms and Conditions')).toBeVisible();
    await expect(page.getByText('Disclosures')).toBeVisible();
  });
});
