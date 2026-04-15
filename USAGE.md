# Playwright Test Orchestrator — Usage Guide

End-to-end AI-powered test automation. Give it a URL and credentials; it explores the app, proposes a test plan, waits for your approval, generates all tests, and fixes any failures automatically.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Installation](#2-installation)
3. [Set Your API Key](#3-set-your-api-key)
4. [Configure Your Target App](#4-configure-your-target-app)
5. [Run the Orchestrator](#5-run-the-orchestrator)
6. [Phase Walkthrough](#6-phase-walkthrough)
7. [Handling MFA / OTP](#7-handling-mfa--otp)
8. [Approving or Revising the Test Plan](#8-approving-or-revising-the-test-plan)
9. [Running Tests After Generation](#9-running-tests-after-generation)
10. [Refreshing an Expired Session](#10-refreshing-an-expired-session)
11. [Multiple Environments](#11-multiple-environments)
12. [CLI Flags Reference](#12-cli-flags-reference)
13. [File Reference](#13-file-reference)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Prerequisites

Make sure the following are installed before you begin.

| Requirement | Minimum version | Check |
|---|---|---|
| Node.js | 18+ | `node --version` |
| npm | 8+ | `npm --version` |
| Anthropic API key | — | [console.anthropic.com](https://console.anthropic.com) |

---

## 2. Installation

**Step 1 — Install npm dependencies:**

```bash
npm install
```

**Step 2 — Install Playwright browsers:**

```bash
npx playwright install --with-deps
```

This downloads Chromium, Firefox, and WebKit. Required once; re-run if you update Playwright.

---

## 3. Set Your API Key

The orchestrator uses Claude (claude-opus-4-6) to analyse the app and generate tests. You need an Anthropic API key from [console.anthropic.com](https://console.anthropic.com).

**Option A — Add to `config.json` (recommended):**

```json
{
  "apiKey": "sk-ant-api03-..."
}
```

**Option B — Environment variable:**

```bash
export ANTHROPIC_API_KEY="sk-ant-api03-..."
```

**Option C — CLI flag:**

```bash
npm run orchestrate -- --api-key sk-ant-api03-...
```

`config.json` is gitignored, so storing the key there is safe.

---

## 4. Configure Your Target App

Open `config.json` in the project root and fill in your app details:

```json
{
  "name": "My App",
  "url": "https://yourapp.com",
  "username": "your-username-or-email",
  "password": "your-password",
  "apiKey": "sk-ant-api03-..."
}
```

| Field | Required | Description |
|---|---|---|
| `name` | No | Human-friendly label shown in the terminal |
| `url` | **Yes** | Full URL of the application to test |
| `username` | No | Login username or email (leave out for public apps) |
| `password` | No | Login password (leave out for public apps) |
| `apiKey` | **Yes** | Anthropic API key — get one at console.anthropic.com |

**`config.json` is gitignored** — your credentials and API key are never committed to version control.

### Public apps (no login)

```json
{
  "name": "Public Site",
  "url": "https://example.com"
}
```

---

## 5. Run the Orchestrator

Once `config.json` is filled in, run:

```bash
npm run orchestrate
```

That's it. A browser window will open and the pipeline will start automatically.

---

## 6. Phase Walkthrough

The orchestrator runs through five phases. Here is what happens in each one.

### Phase 1 — Exploration & Planning

The AI opens the app in a browser, logs in using your credentials (if provided), and navigates every page, form, and feature it can find. It takes screenshots, reads page structure, and builds up a picture of the application.

**What you will see in the terminal:**

```
════════════════════════════════════════════════════════
  Phase 1 — Exploration & Planning
════════════════════════════════════════════════════════

  [navigate] {"url":"https://yourapp.com"}
  [screenshot] captured
  [fill] {"selector":"#email","value":"..."}
  [click] {"selector":"button:has-text('Sign in')"}
  ...
```

The browser window is visible so you can watch the AI explore in real time.

At the end of this phase, the test plan is saved to `specs/`.

---

### Phase 2 — Test Plan Review *(you act here)*

The complete test plan is printed to your terminal. Read through it carefully.

You will then be prompted:

```
  APPROVE          → generate all tests
  REVISE: <text>   → update the plan first

>
```

- Type `APPROVE` and press Enter to proceed.
- Type `REVISE: add tests for the export CSV feature` (or any feedback) to have the plan updated before generating.

You can revise as many times as needed. The plan is only locked in when you type `APPROVE`.

---

### Phase 3 — Test Generation

After approval the AI navigates to each relevant page in the app, observes the real UI, and writes a `.spec.ts` test file for every test case in the plan.

Files are written to the project root (e.g. `login-valid.spec.ts`, `add-product-to-cart.spec.ts`).

Tests that require a logged-in session are written with:

```ts
test.use({ storageState: 'auth/auth-state.json' });
```

Tests that test the login flow itself are written without it, using `process.env.TEST_USERNAME` and `process.env.TEST_PASSWORD`.

---

### Phase 4 — Healing

The AI runs all generated tests and checks the results. For every failing test it:

1. Reads the test file
2. Navigates to the relevant page to see its current state
3. Diagnoses the issue (wrong selector, changed URL, timing, etc.)
4. Edits the test file to fix it
5. Re-runs that test to confirm the fix

If a test cannot be fixed after multiple attempts, it is marked `test.fixme()` with an explanatory comment.

---

### Phase 5 — Final Report

A final test run is performed and the results are printed to your terminal, along with commands to run the tests yourself going forward.

---

## 7. Handling MFA / OTP

If your app requires multi-factor authentication (Salesforce, Okta, Google Workspace, Azure AD, etc.), the AI will detect the verification screen and pause with a prompt:

```
🔔  The app needs a verification code.
    Check your email / SMS / authenticator app and enter it here.
>
```

**What to do:**

1. Check your email (or SMS, or authenticator app) for the code.
2. Type the code into the terminal and press Enter.
3. The AI enters the code in the browser and continues.

If the app shows a **"Trust this device"** or **"Remember this browser"** checkbox, the AI will check it automatically to reduce future prompts.

> **MFA is only triggered once.** After successful login the browser session is saved to `auth/auth-state.json`. All generated tests load this session and skip the login flow entirely — you will not be asked for an OTP again during test generation or test runs.

---

## 8. Approving or Revising the Test Plan

When the test plan is displayed in Phase 2, you have full control before any test code is written.

### Approve as-is

```
> APPROVE
```

### Request changes

```
> REVISE: add negative tests for the search feature and remove the admin-only suite
```

```
> REVISE: the checkout flow has 3 steps not 2, please update suite 4
```

```
> REVISE: focus only on the core user journey, remove edge case tests
```

You can revise multiple times. The AI updates the plan and re-displays it for your review each time.

---

## 9. Running Tests After Generation

Once the orchestrator finishes, run the tests yourself at any time:

```bash
# Run all tests (Chromium only, fastest)
npx playwright test --project=chromium

# Run all tests across all browsers
npx playwright test

# Run a single test file
npx playwright test login-valid.spec.ts

# Run tests matching a keyword
npx playwright test --grep "checkout"

# Open the HTML report after a run
npx playwright show-report
```

> **Note:** Tests that use `storageState` require a valid `auth/auth-state.json`. If the file does not exist yet, run the setup step first (see Section 10).

---

## 10. Refreshing an Expired Session

Browser sessions expire. When tests start failing with login redirects or "session expired" errors, regenerate `auth/auth-state.json`:

**Step 1 — Set the required environment variables:**

```bash
export TEST_URL="https://yourapp.com"
export TEST_USERNAME="your-username"
export TEST_PASSWORD="your-password"
```

**Step 2 — Run the auth setup:**

```bash
npx playwright test --project=setup
```

This runs `auth.setup.ts`, logs in to the app (and will prompt for OTP in the terminal if required), and saves a fresh session to `auth/auth-state.json`.

**Step 3 — Re-run your tests:**

```bash
npx playwright test
```

---

## 11. Multiple Environments

You can keep separate config files for different environments and switch between them.

**Create environment-specific configs:**

```bash
# config.staging.json
{
  "name": "Staging",
  "url": "https://staging.yourapp.com",
  "username": "staging-user@company.com",
  "password": "staging-password"
}
```

```bash
# config.prod.json
{
  "name": "Production",
  "url": "https://yourapp.com",
  "username": "prod-user@company.com",
  "password": "prod-password"
}
```

**Run against a specific environment:**

```bash
npm run orchestrate -- --config config.staging.json
npm run orchestrate -- --config config.prod.json
```

**Override a single value without editing the file:**

```bash
# Use config.json but point to a different URL
npm run orchestrate -- --url https://feature-branch.yourapp.com
```

---

## 12. CLI Flags Reference

All flags are optional. If a value is not provided via flag, it falls back to `config.json`, then to the environment variable.

| Flag | Description | Env var fallback |
|---|---|---|
| `--url <url>` | Target application URL | `TEST_URL` |
| `--username <u>` | Login username or email | `TEST_USERNAME` |
| `--password <p>` | Login password | `TEST_PASSWORD` |
| `--api-key <key>` | Anthropic API key | `ANTHROPIC_API_KEY` |
| `--config <path>` | Path to a config JSON file | *(defaults to `config.json`)* |

**Examples:**

```bash
# No flags — reads everything from config.json
npm run orchestrate

# Override URL only
npm run orchestrate -- --url https://staging.yourapp.com

# Override all credentials inline (ignores config.json values)
npm run orchestrate -- --url https://app.com --username admin --password secret

# Use a different config file
npm run orchestrate -- --config config.staging.json

# Mix: use a named config but override the URL
npm run orchestrate -- --config config.staging.json --url https://feature-preview.app.com
```

---

## 13. File Reference

```
Playwright/
├── config.json              ← YOUR credentials go here (gitignored)
├── orchestrate.ts           ← Main AI orchestration script
├── playwright.config.ts     ← Playwright project configuration
├── auth.setup.ts            ← Standalone login script (refreshes session)
├── auth/
│   └── auth-state.json      ← Saved browser session (gitignored, auto-generated)
├── specs/
│   └── *.md                 ← Generated test plans (one per app)
├── *.spec.ts                ← Generated test files (one per test case)
├── package.json
├── tsconfig.json
└── .gitignore               ← Excludes config.json and auth-state.json
```

### .github/agents/ — GitHub Copilot agents (alternative interface)

If you use GitHub Copilot, you can invoke the same pipeline through chat:

| Agent | Trigger with |
|---|---|
| `playwright-orchestrator` | `@playwright-orchestrator URL: https://app.com \| Username: u \| Password: p` |
| `playwright-test-planner` | `@playwright-test-planner URL: https://app.com` |
| `playwright-test-generator` | `@playwright-test-generator` *(after a plan exists in specs/)* |
| `playwright-test-healer` | `@playwright-test-healer` *(after tests exist)* |

---

## 14. Troubleshooting

### "No URL provided"

`config.json` is missing or has a placeholder value. Edit it and fill in the `url` field, or pass `--url`.

### "ANTHROPIC_API_KEY is not set"

Export the key in your terminal: `export ANTHROPIC_API_KEY="sk-ant-..."`. See [Section 3](#3-set-your-api-key).

### Tests fail with "page redirected to login"

The session in `auth/auth-state.json` has expired. Follow [Section 10](#10-refreshing-an-expired-session) to refresh it.

### Browser window does not open

Playwright may not have its browsers installed. Run `npx playwright install --with-deps`.

### OTP prompt does not appear

The AI may have navigated past the OTP screen before prompting. If this happens, type `CTRL+C` to stop, re-run the orchestrator, and respond to the `🔔` prompt quickly after login.

### Generated tests have wrong selectors

This is expected occasionally — the healing phase (Phase 4) fixes them automatically. If a test is still broken after healing, it will be marked `test.fixme()` with an explanation.

### "config.json is not valid JSON"

Check for trailing commas or missing quotes. Validate at [jsonlint.com](https://jsonlint.com).
