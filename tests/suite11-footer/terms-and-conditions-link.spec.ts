import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 11: Footer', () => {
  test('11.2 Terms and Conditions Link', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await page.locator('nav a, [class*="nav"] a, [class*="navigation"] a').filter({ hasText: 'Accounts' }).first().click();
    await expect(page.getByText('Investment Accounts').first()).toBeVisible({ timeout: 10000 });

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    const termsLink = page.getByText('Terms and Conditions');
    await expect(termsLink).toBeVisible();

    const [newPage] = await Promise.all([
      page.context().waitForEvent('page', { timeout: 5000 }).catch(() => null),
      termsLink.click(),
    ]);

    if (newPage) {
      await newPage.waitForLoadState();
      expect(newPage.url()).toBeTruthy();
      await newPage.close();
    }
  });
});
