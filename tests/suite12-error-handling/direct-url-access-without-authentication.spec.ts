import { test, expect } from '@playwright/test';

test.describe('Suite 12: Error Handling & Edge Cases', () => {
  test('12.2 Direct URL Access Without Authentication', async ({ page }) => {
    // Step 1: Open a browser with no active session
    // Step 2: Navigate directly to an authenticated page URL
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');

    // Expected: User is redirected to a login page. No authenticated content is shown.
    // The community login page at /InnovaytePortal/s/login/ has a "Log in" button
    await expect(page).toHaveURL(/.*login.*/, { timeout: 15000 });

    // Verify login form elements are visible (community login page uses placeholders)
    await expect(page.getByPlaceholder('Username')).toBeVisible({ timeout: 10000 });
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log in' })).toBeVisible();
  });
});
