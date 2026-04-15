import { test, expect } from '@playwright/test';

test.describe('Suite 3: Password Reset', () => {
  test('3.2 Password Reset with Valid Username', async ({ page }) => {
    const username = process.env.TEST_USERNAME ?? '';
    test.skip(!username, 'TEST_USERNAME environment variable is not set');

    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');
    await page.getByText('Forgot Your Password?').click();
    await expect(page.getByText('PASSWORD RESET')).toBeVisible({ timeout: 10000 });

    await page.getByPlaceholder('Username').fill(username);
    await page.getByRole('button', { name: 'Reset Password' }).click();

    await expect(page.getByText(/email|sent|instructions|reset/i).first()).toBeVisible({ timeout: 10000 });
  });
});
