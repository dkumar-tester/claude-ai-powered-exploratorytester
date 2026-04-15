import { test, expect } from '@playwright/test';

test.describe('Suite 2: MFA / Identity Verification', () => {
  test('2.4 MFA "Don\'t Ask Again" Checkbox', async ({ page }) => {
    const username = process.env.TEST_USERNAME ?? '';
    const password = process.env.TEST_PASSWORD ?? '';
    test.skip(!username || !password, 'TEST_USERNAME and/or TEST_PASSWORD environment variables are not set');

    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Log In to Sandbox' }).click();

    const mfaHeading = page.getByText('Verify Your Identity');
    const isMfaVisible = await mfaHeading.isVisible({ timeout: 10000 }).catch(() => false);

    if (!isMfaVisible) {
      test.skip(true, 'MFA page did not appear - device may be remembered');
      return;
    }

    const dontAskAgain = page.getByLabel(/Don't ask again/i);
    await expect(dontAskAgain).toBeVisible();
    await expect(dontAskAgain).toBeChecked();
  });
});
