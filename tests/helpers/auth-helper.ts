import { Page } from '@playwright/test';

/**
 * Checks if the current auth session is valid by navigating to the portal
 * and checking if we get redirected to the login page.
 * Returns true if the session is valid, false if expired.
 */
export async function isSessionValid(page: Page): Promise<boolean> {
  await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
  // Wait a moment for redirects
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(2000);
  const url = page.url();
  // If redirected to login, session is invalid
  return !url.includes('login');
}
