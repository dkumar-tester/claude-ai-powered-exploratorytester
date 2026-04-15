import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 12: Error Handling & Edge Cases', () => {
  test('12.5 Browser Back Button After Login', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await expect(page.getByText(/Welcome to the Innovayte Investor Portal/)).toBeVisible({ timeout: 10000 });

    await page.goBack();
    await page.waitForLoadState('networkidle');

    const passwordField = page.getByLabel('Password');
    if (await passwordField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(passwordField).toHaveValue('');
    }
  });
});
