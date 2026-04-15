import { test, expect } from '@playwright/test';

test.describe('Suite 1: Login & Authentication', () => {
  test('1.8 Login Page UI Elements Verification', async ({ page }) => {
    // Step 1: Navigate to the login page
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');

    // Step 2: Verify all UI elements are present

    // Innovayte logo (dark blue)
    const logo = page.locator('img[alt*="innovayte" i], img[src*="innovayte" i], img[alt*="logo" i]').first();
    await expect(logo).toBeVisible();

    // "Username" label and input field
    await expect(page.getByLabel('Username')).toBeVisible();
    await expect(page.getByText('Username', { exact: true })).toBeVisible();

    // "Password" label and input field
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByText('Password', { exact: true })).toBeVisible();

    // "Log In to Sandbox" button (dark navy)
    const loginButton = page.getByRole('button', { name: 'Log In to Sandbox' });
    await expect(loginButton).toBeVisible();

    // "Remember me" checkbox (unchecked by default)
    const rememberMe = page.getByLabel('Remember me');
    await expect(rememberMe).toBeVisible();
    await expect(rememberMe).not.toBeChecked();

    // "Forgot Your Password?" link (teal/green color)
    const forgotPasswordLink = page.getByText('Forgot Your Password?');
    await expect(forgotPasswordLink).toBeVisible();

    // "Innovayte LLC employee? Log In" link at the bottom
    await expect(page.getByText('Innovayte LLC employee?')).toBeVisible();

    // Copyright footer: "© 2026 Innovayte.. All rights reserved."
    await expect(page.getByText('© 2026 Innovayte.. All rights reserved.')).toBeVisible();
  });
});
