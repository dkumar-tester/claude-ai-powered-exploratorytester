import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('Suite 4: Home / Dashboard', () => {
  test('4.1 Dashboard Page Load and Content Verification', async ({ page }) => {
    await page.goto('https://innovayte--uat.sandbox.my.site.com/InnovaytePortal/s/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);
    test.skip(page.url().includes('login'), 'Auth session expired - storageState is no longer valid');

    await expect(page.getByText('Home', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Accounts', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Documents', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Positions', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Contact Us', { exact: true }).first()).toBeVisible();

    await expect(page.locator('.slds-avatar, [class*="avatar"], [class*="profile"]').first()).toBeVisible();
    await expect(page.getByText(/Welcome to the Innovayte Investor Portal/)).toBeVisible();

    const accountsCard = page.locator('text=Accounts').nth(1);
    await expect(accountsCard).toBeVisible();
    const documentsCard = page.locator('text=Documents').nth(1);
    await expect(documentsCard).toBeVisible();
    const positionsCard = page.locator('text=Positions').nth(1);
    await expect(positionsCard).toBeVisible();

    await expect(page.getByText('Portfolio Breakdown').first()).toBeVisible();
    await expect(page.getByText(/Total Market Value/)).toBeVisible();
    await expect(page.getByText('Value as of Last Market Close')).toBeVisible();
    await expect(page.getByText('Portfolio Breakdown').first()).toBeVisible();
    await expect(page.getByText('Positions by Custodian')).toBeVisible();
    await expect(page.getByText('Your Advisor Details')).toBeVisible();
    await expect(page.getByText(/Advisor:/)).toBeVisible();
    await expect(page.getByText(/Firm:/)).toBeVisible();
    await expect(page.getByText(/Email:/)).toBeVisible();
    await expect(page.getByText(/Phone:/)).toBeVisible();
    await expect(page.getByText('Quick Links')).toBeVisible();
  });
});
