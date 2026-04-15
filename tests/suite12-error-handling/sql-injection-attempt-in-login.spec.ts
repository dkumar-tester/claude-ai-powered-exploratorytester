import { test, expect } from '@playwright/test';

test.describe('Suite 12: Error Handling & Edge Cases', () => {
  test('12.7 SQL Injection Attempt in Login', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');

    await page.getByLabel('Username').fill("' OR 1=1 --");
    await page.getByLabel('Password').fill('password');

    await page.getByRole('button', { name: 'Log In to Sandbox' }).click();
    await page.waitForLoadState('load');

    // Should NOT be on dashboard
    const welcomeMessage = page.getByText(/Welcome to the Innovayte Investor Portal/);
    await expect(welcomeMessage).not.toBeVisible({ timeout: 5000 });

    // Should remain on login page with error
    await expect(page.getByRole('button', { name: 'Log In to Sandbox' })).toBeVisible();
  });
});
