import { test, expect } from '@playwright/test';

test.describe('Suite 3: Password Reset', () => {
  test('3.5 Password Reset Cancel Button', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');
    await page.getByText('Forgot Your Password?').click();
    await expect(page.getByText('PASSWORD RESET')).toBeVisible({ timeout: 10000 });

    await page.getByText('Cancel').click();
    await page.waitForLoadState('domcontentloaded');

    await expect(page.getByText('PASSWORD RESET')).not.toBeVisible({ timeout: 10000 });
  });
});
