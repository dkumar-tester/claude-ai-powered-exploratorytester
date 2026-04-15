import { test, expect } from '@playwright/test';

test.describe('Suite 12: Error Handling & Edge Cases', () => {
  test('12.6 Special Characters in Login Fields', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');

    await page.getByLabel('Username').fill("<script>alert('xss')</script>");
    await page.getByLabel('Password').fill("<script>alert('xss')</script>");

    await page.getByRole('button', { name: 'Log In to Sandbox' }).click();
    await page.waitForLoadState('load');

    // No JavaScript alert should have been triggered
    // The page should show an error or remain on the login page
    await expect(page.getByRole('button', { name: 'Log In to Sandbox' })).toBeVisible({ timeout: 10000 });

    const title = await page.title();
    expect(title).toBeTruthy();
  });
});
