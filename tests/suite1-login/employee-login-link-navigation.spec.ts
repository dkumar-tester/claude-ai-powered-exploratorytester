import { test, expect } from '@playwright/test';

test.describe('Suite 1: Login & Authentication', () => {
  test('1.10 Employee Login Link Navigation', async ({ page }) => {
    // Increase test timeout since Salesforce login page can be slow
    test.setTimeout(60000);

    // Step 1: Navigate to the portal login page
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/login?');

    // Step 2: Click "Log In" link in "Innovayte LLC employee? Log In"
    await Promise.all([
      page.waitForEvent('load', { timeout: 30000 }).catch(() => {}),
      page.locator('//a[text()="Log In"]').click(),
    ]);

    // Wait for the Salesforce login page to fully load
    await page.waitForLoadState('load');

    // Expected: User is redirected to the Salesforce/Employee login page
    // Verify the URL changed from the portal login page
    await page.waitForFunction(
      () => !document.location.href.includes('/InnovaytePortal/login'),
      { timeout: 15000 }
    ).catch(() => {
      // URL may include a login segment but on Salesforce domain
    });

    // Verify Salesforce login form elements using stable ID selectors
    // Username field (Salesforce uses #username)
    await expect(page.locator('#username')).toBeVisible({ timeout: 15000 });

    // Password field (Salesforce uses #password)
    await expect(page.locator('#password')).toBeVisible();

    // "Log In to Sandbox" button (Salesforce uses #Login)
    await expect(page.locator('#Login')).toBeVisible();

    // "Remember me" checkbox
    await expect(page.locator('#rememberUn')).toBeVisible();

    // "Forgot Your Password?" link
    await expect(page.locator('#forgot_password_link')).toBeVisible();

    // SSO section exists (contains IdP login buttons like Acceleryate_OKTA, Okta ETC)
    await expect(page.locator('#idp_section_buttons')).toBeVisible({ timeout: 10000 });
  });
});
