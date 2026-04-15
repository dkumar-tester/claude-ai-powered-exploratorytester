import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 12: Error Handling & Edge Cases', () => {
  test('12.1 404 Page - Invalid URL', async ({ page }) => {
    // Check if session is valid first
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    // Step 1: Navigate to an invalid URL path within the portal
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/invalid-page');

    // Expected: A "Page not available" error page is displayed
    await expect(page.getByText('Page not available')).toBeVisible({ timeout: 10000 });

    await expect(page.getByText(/Maybe the page was deleted, the URL is incorrect, or something else went wrong/)).toBeVisible();
    await expect(page.getByText(/please ask the community administrator for help/)).toBeVisible();
  });
});
