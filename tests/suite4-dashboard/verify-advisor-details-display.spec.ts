import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 4: Home / Dashboard', () => {
  test('4.6 Verify Advisor Details Display', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await expect(page.getByText('Your Advisor Details')).toBeVisible();
    await expect(page.getByText(/Advisor:\s*.+/)).toBeVisible();
    await expect(page.getByText(/Firm:\s*.+/)).toBeVisible();
    const emailLink = page.locator('a[href^="mailto:"]').first();
    await expect(emailLink).toBeVisible();
    await expect(page.getByText(/Phone:\s*\(?\d{3}\)?\s*\d{3}[-.]?\d{4}/)).toBeVisible();
  });
});
