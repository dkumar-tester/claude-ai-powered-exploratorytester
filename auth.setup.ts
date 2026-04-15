/**
 * auth.setup.ts
 *
 * Logs in to the application once and saves the authenticated browser session
 * to auth/auth-state.json. All tests that declare:
 *
 *   test.use({ storageState: 'auth/auth-state.json' });
 *
 * will reuse this session and skip the login flow entirely (no MFA re-prompt).
 *
 * Run this manually when the saved session expires:
 *   npx playwright test --project=setup
 *
 * Required environment variables:
 *   TEST_URL       - The base URL of the application
 *   TEST_USERNAME  - Login username / email
 *   TEST_PASSWORD  - Login password
 *
 * For MFA apps (Salesforce, Okta, etc.):
 *   If the app prompts for an OTP during this setup, the test will pause and
 *   print instructions. Enter the OTP in the terminal when prompted.
 *   Set TEST_OTP env var if you have a time-based OTP (TOTP) secret available.
 */

import { test as setup, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const AUTH_STATE_PATH = 'auth/auth-state.json';

/** Read OTP from stdin when running interactively */
async function promptForOTP(message: string): Promise<string> {
  // If OTP is pre-supplied via environment variable, use it
  if (process.env.TEST_OTP) {
    console.log('Using OTP from TEST_OTP environment variable.');
    return process.env.TEST_OTP;
  }

  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`\n🔐 ${message}\nEnter OTP: `, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

setup('authenticate and save session', async ({ page }) => {
  const url = process.env.TEST_URL;
  const username = process.env.TEST_USERNAME;
  const password = process.env.TEST_PASSWORD;

  if (!url || !username || !password) {
    throw new Error(
      'Missing required environment variables: TEST_URL, TEST_USERNAME, TEST_PASSWORD'
    );
  }

  // Ensure auth directory exists
  fs.mkdirSync(path.dirname(AUTH_STATE_PATH), { recursive: true });

  await page.goto(url);

  // --- Fill login form ---
  // NOTE: Update these selectors to match your application's login page.
  // Common patterns are shown; uncomment the one that matches your app.

  // Generic email/username + password form:
  await page.locator('input[type="email"], input[name*="user"], input[name*="email"], input[id*="user"], input[id*="email"]').first().fill(username);
  await page.locator('input[type="password"]').first().fill(password);
  await page.locator('button[type="submit"], input[type="submit"], button:has-text("Log in"), button:has-text("Sign in")').first().click();

  // --- MFA / OTP handling ---
  // Wait briefly to see if an MFA screen appears
  await page.waitForTimeout(3000);

  const pageContent = await page.content();
  const mfaIndicators = [
    'verification code', 'verify your identity', 'enter the code',
    'two-factor', 'multi-factor', 'otp', 'one-time', 'authenticator',
    'sent a code', 'check your email', 'sent to your',
  ];
  const hasMFA = mfaIndicators.some(indicator =>
    pageContent.toLowerCase().includes(indicator)
  );

  if (hasMFA) {
    console.log('\n⚠️  MFA screen detected.');
    const otp = await promptForOTP(
      'The app is asking for a verification code.\nCheck your email / SMS / authenticator app.'
    );

    // Look for "Trust this device" / "Remember this browser" checkbox and check it
    const trustCheckbox = page.locator(
      'input[type="checkbox"][name*="trust"], input[type="checkbox"][id*="trust"], ' +
      'input[type="checkbox"][name*="remember"], input[type="checkbox"][id*="remember"]'
    ).first();
    if (await trustCheckbox.isVisible().catch(() => false)) {
      await trustCheckbox.check();
      console.log('✅ Checked "Trust this device" to reduce future MFA prompts.');
    }

    // Enter the OTP
    const otpField = page.locator(
      'input[type="text"][name*="otp"], input[name*="code"], input[name*="token"], ' +
      'input[name*="verification"], input[autocomplete="one-time-code"], ' +
      'input[type="number"], input[inputmode="numeric"]'
    ).first();
    await otpField.fill(otp);
    await page.locator('button[type="submit"], input[type="submit"], button:has-text("Verify"), button:has-text("Continue")').first().click();
    await page.waitForTimeout(2000);
  }

  // --- Verify login succeeded ---
  // The page should no longer be on the login URL.
  // Adjust this assertion if your app uses a different post-login indicator.
  await expect(page).not.toHaveURL(/login|signin|auth/i, { timeout: 10000 });

  // --- Save authenticated session ---
  await page.context().storageState({ path: AUTH_STATE_PATH });
  console.log(`\n✅ Auth state saved to ${AUTH_STATE_PATH}`);
  console.log('All tests using storageState will now skip the login flow.\n');
});
