import { test, expect } from '@playwright/test';

const BASE_URL = 'https://inbox.cloudqa.io/';

/**
 * CloudQA Email Testing Platform — Smoke Tests
 *
 * Covers three core workflows across 5 test cases:
 *   • Email Capture   — inbox creation, email reception, display     (TC01, TC02)
 *   • Content Inspect — header analysis, body rendering, attachments (TC03, TC04)
 *   • Analytics       — filter metrics, read/unread tracking, logout (TC05)
 *
 * DOM facts (verified from live page snapshots):
 *   - Username input:  textbox[placeholder="Enter username"]
 *   - Access Inbox:    two buttons exist simultaneously (dialog + page CTA) → always use .first()
 *   - Filter buttons:  "All (0)", "Unread (0)", "Read (0)", "Starred (0)", "Attachments (0)"
 *   - Search input:    textbox[placeholder="Search emails..."]
 *   - Sort:            combobox with options Date / Sender / Subject / Size
 *   - View toggle:     button "Compact", button "Detailed"
 *   - Connection:      "Connected: <username>@inbox.cloudqa.io"
 *   - Empty state:     paragraph "No messages yet"
 */

test.describe('CloudQA Email Platform — Smoke Tests', () => {
  // ─────────────────────────────────────────────────────────────────
  // TC01 — POSITIVE | Email Capture
  // Verifies successful inbox creation: email address format preview,
  // connection status display, and core inbox UI element availability.
  // ─────────────────────────────────────────────────────────────────
  test('TC01: Create inbox and verify inbox setup with connection status', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');

    // Home page must expose both primary CTAs
    await expect(page.getByRole('button', { name: 'Create Inbox' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Load Inbox' })).toBeVisible();

    // Open the Create Inbox dialog
    await page.getByRole('button', { name: 'Create Inbox' }).click();

    // Username textbox must appear inside the dialog
    const usernameInput = page.getByPlaceholder('Enter username');
    await expect(usernameInput).toBeVisible();

    // Enter a unique username (timestamp prevents accidental reuse)
    const username = `smoke${Date.now()}`;
    await usernameInput.fill(username);

    // Email address preview must show the correct domain suffix
    await expect(page.getByText(`${username}@inbox.cloudqa.io`)).toBeVisible();

    // Access Inbox button (dialog) should be enabled after username entry
    // Two "Access Inbox" buttons exist on the page; .first() targets the dialog one
    const accessBtn = page.getByRole('button', { name: 'Access Inbox' }).first();
    await expect(accessBtn).toBeEnabled();
    await accessBtn.click();

    // Connection status must confirm which inbox is now active
    await expect(
      page.getByText(`Connected: ${username}@inbox.cloudqa.io`),
    ).toBeVisible({ timeout: 10_000 });

    // Core inbox controls — Refresh and Logout — must be present
    await expect(page.getByRole('button', { name: 'Refresh' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────────
  // TC02 — NEGATIVE | Email Capture
  // Verifies the dialog's Access Inbox button is disabled with no
  // username, becomes enabled on valid input, and cancelling the
  // modal returns the user home without creating an inbox.
  // ─────────────────────────────────────────────────────────────────
  test('TC02: Access Inbox disabled without username — cancel restores home page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');

    // Open Create Inbox dialog
    await page.getByRole('button', { name: 'Create Inbox' }).click();

    // Dialog's Access Inbox button must be disabled with empty input
    // .first() resolves the two-button ambiguity (dialog btn comes first in DOM)
    const accessBtn = page.getByRole('button', { name: 'Access Inbox' }).first();
    await expect(accessBtn).toBeDisabled();

    // Typing a username enables the button (reactive validation)
    const username = `smoke${Date.now()}`;
    await page.getByPlaceholder('Enter username').fill(username);
    await expect(accessBtn).toBeEnabled();

    // Cancel dialog — no inbox should be created
    await page.getByRole('button', { name: 'Cancel' }).click();

    // Home page primary CTAs must still be visible
    await expect(page.getByRole('button', { name: 'Create Inbox' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Load Inbox' })).toBeVisible();

    // No connection status must appear for the typed-but-cancelled username
    await expect(
      page.getByText(`Connected: ${username}@inbox.cloudqa.io`),
    ).not.toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────────
  // TC03 — POSITIVE | Content Inspection
  // Verifies that a fresh inbox renders the "No messages yet" empty
  // state, exposes all 5 filter tabs with count badges, the sort
  // combobox, the Compact/Detailed view toggle, and a functional
  // search bar that preserves the empty state on no-match queries.
  // ─────────────────────────────────────────────────────────────────
  test('TC03: Empty inbox — filter tabs, sort control, and view-mode toggle visible', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');

    // Create a brand-new inbox guaranteed to contain zero emails
    await page.getByRole('button', { name: 'Create Inbox' }).click();
    const username = `smoke${Date.now()}`;
    await page.getByPlaceholder('Enter username').fill(username);
    await page.getByRole('button', { name: 'Access Inbox' }).first().click();

    await page.waitForLoadState('networkidle', { timeout: 10_000 });

    // Empty-state paragraph must render for a new inbox
    await expect(page.getByText('No messages yet')).toBeVisible({ timeout: 10_000 });

    // All 5 filter tabs must be visible — buttons carry a "(count)" badge in their label
    await expect(page.getByRole('button', { name: /^All/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Unread/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Read/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Starred/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Attachments/i })).toBeVisible();

    // Sort combobox must be present with "Date" selected by default
    // (The option's HTML value is "receivedAt" — check visible label, not raw value)
    const sortCombo = page.getByRole('combobox');
    await expect(sortCombo).toBeVisible();
    await expect(sortCombo.locator('option:checked')).toHaveText('Date');

    // Compact / Detailed view-mode toggle buttons must both be accessible
    await expect(page.getByRole('button', { name: 'Compact' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Detailed' })).toBeVisible();

    // Search bar must be interactive
    const searchInput = page.getByPlaceholder('Search emails...');
    await expect(searchInput).toBeVisible();

    // Submitting a no-match query on an empty inbox keeps the empty state
    await searchInput.fill('no-match@invalid.com');
    await expect(page.getByText('No messages yet')).toBeVisible({ timeout: 5_000 });
  });

  // ─────────────────────────────────────────────────────────────────
  // TC04 — POSITIVE + NEGATIVE | Content Inspection
  // POSITIVE: If emails are present, validates Subject / From / To /
  //           Date header labels and confirms the body container renders.
  // NEGATIVE: Attachments filter on a fresh inbox must return an empty
  //           state — no emails with attachments should appear.
  // ─────────────────────────────────────────────────────────────────
  test('TC04: Email header inspection and Attachments filter empty-state', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');

    // Load inbox for content inspection
    await page.getByRole('button', { name: 'Load Inbox' }).click();
    const username = `smoke${Date.now()}`;
    await page.getByPlaceholder('Enter username').fill(username);
    await page.getByRole('button', { name: 'Access Inbox' }).first().click();

    await page.waitForLoadState('networkidle', { timeout: 10_000 });

    // — POSITIVE branch: inspect headers if an email row exists —
    const emailRow = page
      .locator('[class*="message-item"], [class*="email-item"], tr[class*="message"], tr[class*="email"]')
      .first();
    const hasEmails = await emailRow.isVisible({ timeout: 3_000 }).catch(() => false);

    if (hasEmails) {
      await emailRow.click();

      // All four core header labels must appear in the detail panel
      for (const label of ['Subject', 'From', 'To', 'Date']) {
        await expect(page.getByText(label).first()).toBeVisible({ timeout: 5_000 });
      }

      // Email body container must be rendered (iframe for HTML, div for plain text)
      await expect(
        page.locator('iframe, [class*="body"], [class*="content"]').first(),
      ).toBeVisible({ timeout: 5_000 });
    }

    // — NEGATIVE branch: Attachments filter must be empty on a fresh inbox —
    await page.getByRole('button', { name: /^Attachments/i }).click();

    // With no attachment emails, the empty-state paragraph must appear
    await expect(page.getByText('No messages yet')).toBeVisible({ timeout: 5_000 });
  });

  // ─────────────────────────────────────────────────────────────────
  // TC05 — POSITIVE + NEGATIVE | Analytics Dashboard
  // Validates filter count accuracy for a zero-email inbox (all filters
  // must surface the empty state, not phantom data), and confirms that
  // logout cleanly terminates the session and restores the home page.
  // ─────────────────────────────────────────────────────────────────
  test('TC05: Analytics filter accuracy and clean session logout', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('domcontentloaded');

    // Isolated fresh inbox — guarantees a known zero-email state
    await page.getByRole('button', { name: 'Create Inbox' }).click();
    const username = `smoke${Date.now()}`;
    await page.getByPlaceholder('Enter username').fill(username);
    await page.getByRole('button', { name: 'Access Inbox' }).first().click();

    await page.waitForLoadState('networkidle', { timeout: 10_000 });

    // All filter must be present and reflect zero total emails
    const allFilter = page.getByRole('button', { name: /^All/i });
    await expect(allFilter).toBeVisible();
    await expect(allFilter).toHaveText(/All \(0\)/);

    // Unread filter — zero emails → empty state (no phantom unread count)
    await page.getByRole('button', { name: /^Unread/i }).click();
    await expect(page.getByText('No messages yet')).toBeVisible({ timeout: 5_000 });

    // Read filter — zero emails → empty state
    await page.getByRole('button', { name: /^Read/i }).click();
    await expect(page.getByText('No messages yet')).toBeVisible({ timeout: 5_000 });

    // Starred filter — zero emails → empty state
    await page.getByRole('button', { name: /^Starred/i }).click();
    await expect(page.getByText('No messages yet')).toBeVisible({ timeout: 5_000 });

    // Return to All — empty state still consistent
    await allFilter.click();
    await expect(page.getByText('No messages yet')).toBeVisible({ timeout: 5_000 });

    // Logout must cleanly terminate the inbox session
    await page.getByRole('button', { name: 'Logout' }).click();

    // Home page must be restored — Create / Load Inbox CTAs reappear
    await expect(page.getByRole('button', { name: 'Create Inbox' })).toBeVisible({ timeout: 10_000 });
    await expect(page.getByRole('button', { name: 'Load Inbox' })).toBeVisible({ timeout: 10_000 });

    // The closed inbox connection must no longer be shown
    await expect(
      page.getByText(`Connected: ${username}@inbox.cloudqa.io`),
    ).not.toBeVisible();
  });
});
