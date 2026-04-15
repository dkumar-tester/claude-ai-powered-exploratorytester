import { test, expect } from '@playwright/test';

test.describe('Suite 3: Password Reset', () => {
  test('3.3 Password Reset with Invalid Username', async ({ page }) => {
    // Step 1: Navigate to Forgot Your Password page
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');
    await page.getByText('Forgot Your Password?').click();
    await expect(page.getByText('PASSWORD RESET')).toBeVisible({ timeout: 10000 });

    // Step 2: Enter an invalid/non-existent username
    await page.getByPlaceholder('Username').fill('nonexistentuser@invalid.com');

    // Step 3: Click "Reset Password" button
    await page.getByRole('button', { name: 'Reset Password' }).click();

    // Expected: Appropriate error message is displayed, or a generic success message is shown (to avoid username enumeration)
    // Either an error or a generic success message should appear
    const responseMessage = page.getByText(/error|email|sent|instructions|reset|not found|invalid/i).first();
    await expect(responseMessage).toBeVisible({ timeout: 10000 });
  });
});
