import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 12: Error Handling & Edge Cases', () => {
  test('12.4 Multiple Tab Login', async ({ page, context }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await expect(page.getByText(/Welcome to the Innovayte Investor Portal/)).toBeVisible({ timeout: 10000 });

    const newPage = await context.newPage();
    await newPage.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');
    await newPage.waitForLoadState('networkidle');

    const isOnDashboard = await newPage.getByText(/Welcome to the Innovayte Investor Portal/).isVisible({ timeout: 10000 }).catch(() => false);
    const isOnLogin = await newPage.getByRole('button', { name: 'Log In to Sandbox' }).isVisible({ timeout: 5000 }).catch(() => false);

    expect(isOnDashboard || isOnLogin).toBeTruthy();

    await newPage.close();
  });
});
