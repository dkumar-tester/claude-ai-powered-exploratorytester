import { test, expect } from '@playwright/test';

test.describe('Suite 11: Footer', () => {
  test('11.4 Login Page Footer', async ({ page }) => {
    // Step 1: Navigate to the login page
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');

    // Step 2: Verify the footer content
    // Expected: Footer displays "© 2026 Innovayte.. All rights reserved."
    await expect(page.getByText('© 2026 Innovayte.. All rights reserved.')).toBeVisible();
  });
});
