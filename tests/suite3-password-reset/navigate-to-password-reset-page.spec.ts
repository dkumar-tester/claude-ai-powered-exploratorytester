import { test, expect } from '@playwright/test';

test.describe('Suite 3: Password Reset', () => {
  test('3.1 Navigate to Password Reset Page', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');

    await page.getByText('Forgot Your Password?').click();
    await page.waitForLoadState('domcontentloaded');

    const logo = page.locator('img[alt*="innovayte" i], img[src*="innovayte" i], img[alt*="logo" i]').first();
    await expect(logo).toBeVisible({ timeout: 10000 });

    await expect(page.getByText('PASSWORD RESET')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/To reset your password/i)).toBeVisible();

    const usernameInput = page.getByPlaceholder('Username');
    await expect(usernameInput).toBeVisible();

    await expect(page.getByRole('button', { name: 'Reset Password' })).toBeVisible();
    await expect(page.getByText('Cancel')).toBeVisible();
  });
});
