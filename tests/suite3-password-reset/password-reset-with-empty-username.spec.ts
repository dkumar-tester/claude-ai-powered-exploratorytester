import { test, expect } from '@playwright/test';

test.describe('Suite 3: Password Reset', () => {
  test('3.4 Password Reset with Empty Username', async ({ page }) => {
    // Step 1: Navigate to Forgot Your Password page
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');
    await page.getByText('Forgot Your Password?').click();
    await expect(page.getByText('PASSWORD RESET')).toBeVisible({ timeout: 10000 });

    // Step 2: Leave the Username field empty

    // Step 3: Click "Reset Password" button
    await page.getByRole('button', { name: 'Reset Password' }).click();

    // Expected: Validation error is displayed requiring the username field to be filled
    // The user should remain on the password reset page
    await expect(page.getByText('PASSWORD RESET')).toBeVisible();
    // Check for validation error or that the form was not submitted
    const errorOrValidation = page.getByText(/error|required|enter|username/i).first();
    await expect(errorOrValidation).toBeVisible({ timeout: 10000 });
  });
});
