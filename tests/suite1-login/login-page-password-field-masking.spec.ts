import { test, expect } from '@playwright/test';

test.describe('Suite 1: Login & Authentication', () => {
  test('1.9 Login Page - Password Field Masking', async ({ page }) => {
    // Step 1: Navigate to the login page
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');

    // Step 2: Click into the Password field
    await page.getByLabel('Password').click();

    // Step 3: Type a password string
    await page.getByLabel('Password').fill('TestPassword123!');

    // Expected: Characters are masked/hidden (input type is "password")
    await expect(page.getByLabel('Password')).toHaveAttribute('type', 'password');
  });
});
