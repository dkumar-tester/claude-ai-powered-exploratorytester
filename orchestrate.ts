#!/usr/bin/env tsx
/**
 * Playwright Test Orchestrator
 *
 * AI-powered end-to-end test pipeline: explore → plan → approve → generate → heal → report
 *
 * Credential resolution order (highest → lowest priority):
 *   1. CLI flags          --url, --username, --password, --api-key
 *   2. Config file        config.json  (or --config <path>)
 *   3. Environment vars   TEST_URL, TEST_USERNAME, TEST_PASSWORD, ANTHROPIC_API_KEY
 *
 * Usage:
 *   npx tsx orchestrate.ts                          # reads config.json
 *   npx tsx orchestrate.ts --url https://app.com    # flag overrides config
 *   npx tsx orchestrate.ts --config staging.json    # use a different config file
 */

import Anthropic from '@anthropic-ai/sdk';
import { chromium, type Page, type BrowserContext } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { spawnSync } from 'child_process';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Credentials {
  url: string;
  username?: string;
  password?: string;
  apiKey?: string;
}

interface ToolOutput {
  text?: string;
  image?: { type: 'base64'; media_type: 'image/png'; data: string };
  isError?: boolean;
  done?: { type: string; data: Record<string, unknown> };
}

// ─── CLI & Config ─────────────────────────────────────────────────────────────

interface ConfigFile {
  name?: string;
  url?: string;
  username?: string;
  password?: string;
  apiKey?: string;
}

function parseArgs(): Credentials {
  const args = process.argv.slice(2);
  const flag = (name: string) => { const i = args.indexOf(name); return i !== -1 ? args[i + 1] : undefined; };

  // Load config file (--config flag or default config.json)
  const configPath = flag('--config') ?? 'config.json';
  let fileConfig: ConfigFile = {};
  if (fs.existsSync(configPath)) {
    try {
      fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      console.log(`  Config : loaded from ${configPath}${fileConfig.name ? ` (${fileConfig.name})` : ''}`);
    } catch {
      console.warn(`  Warning: could not parse ${configPath} — ignoring`);
    }
  }

  // Priority: CLI flag > config file > environment variable
  const url      = flag('--url')       ?? fileConfig.url      ?? process.env.TEST_URL;
  const username = flag('--username')  ?? fileConfig.username ?? process.env.TEST_USERNAME;
  const password = flag('--password')  ?? fileConfig.password ?? process.env.TEST_PASSWORD;
  const apiKey   = flag('--api-key')   ?? fileConfig.apiKey   ?? process.env.ANTHROPIC_API_KEY;

  if (!url) {
    console.error('\nNo URL provided. Either:');
    console.error('  1. Add "url" to config.json');
    console.error('  2. Pass --url https://yourapp.com');
    console.error('  3. Set TEST_URL environment variable\n');
    process.exit(1);
  }

  if (!apiKey) {
    console.error('\nNo Anthropic API key provided. Either:');
    console.error('  1. Add "apiKey" to config.json');
    console.error('  2. Pass --api-key sk-ant-...');
    console.error('  3. Set ANTHROPIC_API_KEY environment variable\n');
    process.exit(1);
  }

  return { url, username, password, apiKey };
}

function prompt(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()); }));
}

function divider(title: string) {
  const bar = '═'.repeat(56);
  console.log(`\n${bar}\n  ${title}\n${bar}\n`);
}

// ─── Tool Definitions ─────────────────────────────────────────────────────────

const BROWSER_TOOLS: Anthropic.Tool[] = [
  {
    name: 'navigate',
    description: 'Navigate the browser to a URL and wait for the page to load.',
    input_schema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] },
  },
  {
    name: 'click',
    description: "Click an element. Use text-based selectors when possible (e.g. \"button:has-text('Login')\", \"[aria-label='Submit']\"). Falls back to CSS/XPath.",
    input_schema: { type: 'object', properties: { selector: { type: 'string' } }, required: ['selector'] },
  },
  {
    name: 'fill',
    description: 'Type text into a form field. Use CSS selector, name, or placeholder.',
    input_schema: {
      type: 'object',
      properties: { selector: { type: 'string' }, value: { type: 'string' } },
      required: ['selector', 'value'],
    },
  },
  {
    name: 'screenshot',
    description: 'Take a screenshot of the current page. Returns the image so you can see the current state.',
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'get_page_info',
    description: 'Get the current URL, title, and all interactive elements (buttons, links, inputs, nav items, headings).',
    input_schema: { type: 'object', properties: {} },
  },
  {
    name: 'ask_user',
    description: 'Pause and ask the user for input — use for OTP codes, confirmations, or any clarification needed.',
    input_schema: {
      type: 'object',
      properties: { message: { type: 'string', description: 'The message/question to show the user' } },
      required: ['message'],
    },
  },
];

const PLANNER_TOOLS: Anthropic.Tool[] = [
  ...BROWSER_TOOLS,
  {
    name: 'save_test_plan',
    description: 'Save the completed test plan as a markdown file in the specs/ directory.',
    input_schema: {
      type: 'object',
      properties: {
        filename: { type: 'string', description: 'Filename, e.g. "app-test-plan.md"' },
        content: { type: 'string', description: 'Full markdown content of the test plan' },
      },
      required: ['filename', 'content'],
    },
  },
  {
    name: 'exploration_complete',
    description: 'Signal that exploration is finished and the plan is saved. Call this last.',
    input_schema: {
      type: 'object',
      properties: {
        plan_file: { type: 'string', description: 'Path to the saved plan, e.g. "specs/app-test-plan.md"' },
        summary: { type: 'string', description: 'Brief summary of what you explored and found' },
      },
      required: ['plan_file', 'summary'],
    },
  },
];

const GENERATOR_TOOLS: Anthropic.Tool[] = [
  ...BROWSER_TOOLS,
  {
    name: 'write_test_file',
    description: 'Write a Playwright TypeScript test file to disk.',
    input_schema: {
      type: 'object',
      properties: {
        filename: { type: 'string', description: 'File path, e.g. "login-valid.spec.ts"' },
        content: { type: 'string', description: 'Full TypeScript test content' },
      },
      required: ['filename', 'content'],
    },
  },
  {
    name: 'generation_complete',
    description: 'Signal that all test files have been generated.',
    input_schema: {
      type: 'object',
      properties: {
        files: { type: 'array', items: { type: 'string' }, description: 'List of generated test file paths' },
      },
      required: ['files'],
    },
  },
];

const HEALER_TOOLS: Anthropic.Tool[] = [
  ...BROWSER_TOOLS,
  {
    name: 'run_tests',
    description: 'Run Playwright tests and return the full output with pass/fail results.',
    input_schema: {
      type: 'object',
      properties: {
        filter: { type: 'string', description: 'Optional: specific file path or --grep pattern' },
        project: { type: 'string', description: 'Browser project: chromium (default), firefox, or webkit' },
      },
    },
  },
  {
    name: 'read_file',
    description: 'Read a file from disk.',
    input_schema: { type: 'object', properties: { filepath: { type: 'string' } }, required: ['filepath'] },
  },
  {
    name: 'write_file',
    description: 'Write or overwrite a file on disk.',
    input_schema: {
      type: 'object',
      properties: { filepath: { type: 'string' }, content: { type: 'string' } },
      required: ['filepath', 'content'],
    },
  },
  {
    name: 'healing_complete',
    description: 'Signal that healing is done — all tests either pass or are marked fixme.',
    input_schema: {
      type: 'object',
      properties: {
        passed: { type: 'array', items: { type: 'string' }, description: 'Names of passing tests' },
        fixme: { type: 'array', items: { type: 'string' }, description: 'Names and reasons for fixme tests' },
      },
      required: ['passed', 'fixme'],
    },
  },
];

// ─── Tool Handler ─────────────────────────────────────────────────────────────

async function handleTool(name: string, input: Record<string, unknown>, page: Page): Promise<ToolOutput> {
  try {
    switch (name) {

      case 'navigate': {
        await page.goto(input.url as string, { waitUntil: 'domcontentloaded', timeout: 30_000 });
        await page.waitForTimeout(800);
        return { text: `Navigated to: ${page.url()}` };
      }

      case 'click': {
        const sel = input.selector as string;
        try {
          await page.locator(sel).first().click({ timeout: 8_000 });
        } catch {
          // Try as plain text fallback
          await page.getByText(sel, { exact: false }).first().click({ timeout: 5_000 });
        }
        await page.waitForTimeout(500);
        return { text: `Clicked: ${sel}` };
      }

      case 'fill': {
        await page.locator(input.selector as string).first().fill(input.value as string, { timeout: 8_000 });
        return { text: `Filled: ${input.selector}` };
      }

      case 'screenshot': {
        const buf = await page.screenshot({ type: 'png' });
        return { image: { type: 'base64', media_type: 'image/png', data: buf.toString('base64') } };
      }

      case 'get_page_info': {
        const info = await page.evaluate(() => {
          const collect = (sel: string, max = 25) =>
            [...document.querySelectorAll(sel)].slice(0, max)
              .map(el => ((el as HTMLElement).innerText?.trim() ?? el.getAttribute('aria-label') ?? el.getAttribute('placeholder') ?? ''))
              .filter(Boolean);
          return {
            url: location.href,
            title: document.title,
            headings: collect('h1,h2,h3', 10),
            buttons: collect('button,[role="button"]', 25),
            links: collect('a[href]', 30),
            navItems: collect('nav a,[role="navigation"] a,.nav a,.menu a', 20),
            inputs: [...document.querySelectorAll('input,select,textarea')].slice(0, 20).map(el => ({
              type: (el as HTMLInputElement).type || el.tagName.toLowerCase(),
              name: el.getAttribute('name') ?? el.getAttribute('id') ?? '',
              placeholder: el.getAttribute('placeholder') ?? '',
              label: el.getAttribute('aria-label') ?? '',
            })),
          };
        });
        return { text: JSON.stringify(info, null, 2) };
      }

      case 'ask_user': {
        const answer = await prompt(`\n🔔  ${input.message as string}\n> `);
        return { text: answer };
      }

      case 'save_test_plan': {
        fs.mkdirSync('specs', { recursive: true });
        const fp = path.join('specs', input.filename as string);
        fs.writeFileSync(fp, input.content as string, 'utf8');
        return { text: `Saved: ${fp}` };
      }

      case 'exploration_complete':
        return { text: 'Exploration complete.', done: { type: 'exploration_complete', data: input } };

      case 'write_test_file': {
        const fp = input.filename as string;
        const dir = path.dirname(fp);
        if (dir !== '.') fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(fp, input.content as string, 'utf8');
        console.log(`    ✓ Written: ${fp}`);
        return { text: `Written: ${fp}` };
      }

      case 'generation_complete':
        return { text: 'Generation complete.', done: { type: 'generation_complete', data: input } };

      case 'run_tests': {
        const args = ['playwright', 'test', '--reporter=list',
          '--project', (input.project as string | undefined) ?? 'chromium'];
        if (input.filter) args.push(input.filter as string);
        const r = spawnSync('npx', args, { encoding: 'utf8', timeout: 120_000 });
        return { text: ((r.stdout ?? '') + (r.stderr ?? '')).slice(0, 12_000) || '(no output)' };
      }

      case 'read_file': {
        const fp = input.filepath as string;
        if (!fs.existsSync(fp)) return { text: `File not found: ${fp}`, isError: true };
        return { text: fs.readFileSync(fp, 'utf8') };
      }

      case 'write_file': {
        const fp = input.filepath as string;
        const dir = path.dirname(fp);
        if (dir !== '.') fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(fp, input.content as string, 'utf8');
        console.log(`    ✓ Updated: ${fp}`);
        return { text: `Written: ${fp}` };
      }

      case 'healing_complete':
        return { text: 'Healing complete.', done: { type: 'healing_complete', data: input } };

      default:
        return { text: `Unknown tool: ${name}`, isError: true };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`    ✗ [${name}] ${msg}`);
    return { text: `Error in ${name}: ${msg}`, isError: true };
  }
}

// ─── Agent Loop ───────────────────────────────────────────────────────────────

async function runAgentLoop(
  client: Anthropic,
  system: string,
  initialMessage: string,
  tools: Anthropic.Tool[],
  page: Page,
  maxSteps = 100,
): Promise<Record<string, unknown> | null> {
  const messages: Anthropic.MessageParam[] = [{ role: 'user', content: initialMessage }];

  for (let step = 0; step < maxSteps; step++) {
    // Use streaming so Claude's reasoning is shown in real-time
    const stream = client.messages.stream({
      model: 'claude-opus-4-6',
      max_tokens: 16_000,
      thinking: { type: 'adaptive' } as any, // adaptive thinking for complex reasoning
      system,
      tools,
      messages,
    } as any);

    stream.on('text', delta => process.stdout.write(delta));

    const response = await stream.finalMessage();
    if (response.content.some(b => b.type === 'text' && (b as Anthropic.TextBlock).text.length > 0)) {
      process.stdout.write('\n');
    }

    // Preserve full assistant content (includes thinking blocks)
    messages.push({ role: 'assistant', content: response.content });

    if (response.stop_reason === 'end_turn') break;
    if (response.stop_reason !== 'tool_use') break;

    // Process all tool calls in this turn
    const results: Anthropic.ToolResultBlockParam[] = [];
    let doneData: Record<string, unknown> | null = null;

    for (const block of response.content) {
      if (block.type !== 'tool_use') continue;
      const tu = block as Anthropic.ToolUseBlock;
      const inp = tu.input as Record<string, unknown>;

      // Show tool calls (except screenshots to keep output clean)
      if (tu.name !== 'screenshot') {
        console.log(`\n  [${tu.name}] ${JSON.stringify(inp).slice(0, 130)}`);
      } else {
        process.stdout.write('  [screenshot] ');
      }

      const out = await handleTool(tu.name, inp, page);

      if (tu.name === 'screenshot') process.stdout.write('captured\n');
      if (out.done) doneData = out.done.data;

      results.push({
        type: 'tool_result',
        tool_use_id: tu.id,
        content: out.image
          ? ([{ type: 'image', source: out.image }] as any)
          : (out.text ?? ''),
        is_error: out.isError ?? false,
      });
    }

    messages.push({ role: 'user', content: results });
    if (doneData !== null) return doneData;
  }

  return null;
}

// ─── System Prompts ───────────────────────────────────────────────────────────

function plannerPrompt(creds: Credentials): string {
  const authNote = creds.username
    ? `Credentials provided:\n  Username: ${creds.username}\n  Password: [use fill tool — never echo it in text]`
    : 'No credentials — this appears to be a public application.';

  return `You are an expert web QA engineer. Explore a live web application and produce a comprehensive, structured test plan.

TARGET
  URL: ${creds.url}
  Auth: ${authNote}

WORKFLOW

1. navigate to the URL. Then screenshot + get_page_info to understand what you see.

2. LOGIN (if credentials provided):
   • fill the username/email field
   • fill the password field
   • click the submit button
   • screenshot to confirm you are logged in

3. MFA / OTP HANDLING — after login, check the screenshot for:
   • "Enter verification code", "Check your email", "Authenticator app", etc.
   If an OTP screen is detected:
   → ask_user: "🔐 The app needs a verification code. Check your email/SMS/authenticator and enter it here."
   → If you see a "Trust this device" / "Remember this browser" checkbox, click it first.
   → fill the OTP field with the code the user gives you.
   → click submit. screenshot to confirm success.
   → If another MFA step appears, repeat.

4. EXPLORE ALL SECTIONS:
   • Click every nav item, menu, tab, and link you find
   • Fill and submit forms (use test data — do not modify real records unless necessary)
   • Note every interactive widget: tables, filters, date pickers, modals, accordions
   • Go 2-3 levels deep across the entire navigation hierarchy
   • Capture screenshots of key pages

5. DESIGN THE TEST PLAN covering:
   • Happy path scenarios for every major feature
   • Negative scenarios: wrong credentials, missing required fields, invalid formats
   • Edge cases and boundary conditions
   • Mark auth-needed tests: [AUTH REQUIRED]
   • Mark login-flow tests: [LOGIN FLOW]

6. save_test_plan — use filename "<app-name>-test-plan.md"

7. exploration_complete

TEST PLAN FORMAT:
# Test Plan: [App Name]
**URL:** ${creds.url}
**Date:** ${new Date().toISOString().split('T')[0]}

## Suite 1: [Feature Name]
### 1.1 [Test Name] [AUTH REQUIRED]
**Starting state:** logged-in user on the dashboard
**Steps:**
1. ...
**Expected:** ...

Each scenario must be independent and assume a fresh starting state.`;
}

function generatorPrompt(creds: Credentials, plan: string): string {
  return `You are an expert Playwright test engineer. Generate production-quality TypeScript test files from the test plan below.

RULES
• Never hardcode credentials — use process.env.TEST_USERNAME and process.env.TEST_PASSWORD
• One test per file — filename = kebab-case test name + ".spec.ts"
• Add test.use({ storageState: 'auth/auth-state.json' }) for [AUTH REQUIRED] tests
• Do NOT add storageState for [LOGIN FLOW] tests
• Prefer getByRole, getByLabel, getByText over raw CSS selectors
• Add a comment before each step that matches the plan step text
• All assertions must use await expect(...)

CODE TEMPLATE — [AUTH REQUIRED] test:
\`\`\`typescript
import { test, expect } from '@playwright/test';

test.use({ storageState: 'auth/auth-state.json' });

test.describe('[Suite Name]', () => {
  test('[Test Name]', async ({ page }) => {
    // Step 1: Navigate to the feature page
    await page.goto('${creds.url}/path');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    // ...
  });
});
\`\`\`

CODE TEMPLATE — [LOGIN FLOW] test:
\`\`\`typescript
import { test, expect } from '@playwright/test';

test.describe('[Suite Name]', () => {
  test('[Test Name]', async ({ page }) => {
    const username = process.env.TEST_USERNAME ?? '';
    const password = process.env.TEST_PASSWORD ?? '';
    // Step 1: Navigate to login page
    await page.goto('${creds.url}');
    // Step 2: Fill credentials
    await page.getByLabel('Username').fill(username);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/dashboard/);
  });
});
\`\`\`

WORKFLOW
For each test case:
1. navigate to the relevant page + screenshot to observe the real UI
2. get_page_info to find actual element names and roles
3. write_test_file with the correct test code

After all tests are written, call generation_complete with the list of filenames.

TEST PLAN
${plan}`;
}

function healerPrompt(creds: Credentials): string {
  return `You are an expert Playwright test healer. Run tests, find failures, and fix them.

WORKFLOW
1. run_tests to see all results.
2. For each failing test:
   a. read_file to see the test source
   b. navigate + screenshot to see the current app state at the relevant URL
   c. get_page_info to find the actual current element names/attributes
   d. Diagnose: selector mismatch? wrong URL? timing? auth failure? assertion value changed?
   e. write_file with the corrected test
   f. run_tests with that specific file to confirm the fix works
3. If a test cannot be fixed after 3 attempts:
   • Mark it with test.fixme() at the top of the test body
   • Add a comment above the failing line: // FIXME: [describe actual vs expected behavior]
4. Continue until ALL tests either pass or are marked fixme.
5. Call healing_complete with the final lists.

COMMON FIXES
• "Element not found" — use get_page_info to find the real locator, update getByRole/getByLabel/getByText
• "Navigation timeout" — add await page.waitForURL(...) or a waitFor assertion
• "Auth redirect" — test needs test.use({ storageState: 'auth/auth-state.json' }) or session has expired
• "Expected value mismatch" — screenshot the page, compare with the assertion, update the expected value

App URL: ${creds.url}`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const creds = parseArgs();
  const client = new Anthropic({ apiKey: creds.apiKey });

  divider('Playwright Test Orchestrator');
  console.log(`  URL    : ${creds.url}`);
  console.log(`  Auth   : ${creds.username ? `username provided` : 'none (public app)'}`);
  console.log(`  Model  : claude-opus-4-6`);
  console.log(`  Output : specs/  +  *.spec.ts  +  auth/auth-state.json`);

  const browser = await chromium.launch({ headless: false, slowMo: 40 });
  const context: BrowserContext = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  try {
    // ── Phase 1: Exploration ───────────────────────────────────────────────────
    divider('Phase 1 — Exploration & Planning');

    const exploreResult = await runAgentLoop(
      client,
      plannerPrompt(creds),
      `Please explore the web application at ${creds.url} and create a comprehensive test plan. Start by navigating there now.`,
      PLANNER_TOOLS,
      page,
    );

    // Find the saved plan file
    let planFile = (exploreResult as { plan_file?: string } | null)?.plan_file ?? 'specs/test-plan.md';
    if (!fs.existsSync(planFile)) {
      const found = fs.readdirSync('specs').find(f => f.endsWith('.md'));
      if (found) planFile = path.join('specs', found);
      else { console.error('\n✗ No test plan found in specs/. Exiting.'); process.exit(1); }
    }
    console.log(`\n✓ Test plan: ${planFile}`);

    // Save authenticated browser session right after exploration
    try {
      fs.mkdirSync('auth', { recursive: true });
      await context.storageState({ path: 'auth/auth-state.json' });
      console.log('✓ Auth session saved → auth/auth-state.json');
    } catch {
      console.log('(No auth state — public app)');
    }

    // ── Phase 2: User Approval ─────────────────────────────────────────────────
    divider('Phase 2 — Test Plan Review');

    let approved = false;
    while (!approved) {
      console.log(fs.readFileSync(planFile, 'utf8'));
      console.log('\n' + '─'.repeat(56));

      const answer = await prompt(
        '\n  APPROVE          → generate all tests\n' +
        '  REVISE: <text>   → update the plan first\n\n> '
      );

      if (/^approve$/i.test(answer)) {
        approved = true;
        console.log('\n✓ Approved. Proceeding to test generation...');
      } else if (/^revise:/i.test(answer)) {
        const feedback = answer.replace(/^revise:/i, '').trim();
        console.log('\nRevising plan...\n');
        await runAgentLoop(
          client,
          plannerPrompt(creds),
          `The user requested these changes to the test plan:\n\n"${feedback}"\n\nPlease update the plan at ${planFile} with these changes, then call exploration_complete.`,
          PLANNER_TOOLS,
          page,
        );
        console.log('\n✓ Plan updated — please review again.');
      } else {
        console.log('  Please type  APPROVE  or  REVISE: <your feedback>');
      }
    }

    // ── Phase 3: Test Generation ───────────────────────────────────────────────
    divider('Phase 3 — Test Generation');

    const plan = fs.readFileSync(planFile, 'utf8');
    const genResult = await runAgentLoop(
      client,
      generatorPrompt(creds, plan),
      'Generate a Playwright test file for every test case in the plan. Navigate to relevant pages to observe the real UI before writing each test.',
      GENERATOR_TOOLS,
      page,
    );

    const files = (genResult as { files?: string[] } | null)?.files ?? [];
    console.log(`\n✓ Generated ${files.length} test file(s)`);

    // ── Phase 4: Healing ───────────────────────────────────────────────────────
    divider('Phase 4 — Running & Healing Tests');

    // New context with saved auth state so tests can load it
    const healCtx = await browser.newContext({
      storageState: fs.existsSync('auth/auth-state.json') ? 'auth/auth-state.json' : undefined,
      viewport: { width: 1280, height: 800 },
    });
    const healPage = await healCtx.newPage();

    await runAgentLoop(
      client,
      healerPrompt(creds),
      'Please run all generated tests, diagnose any failures, and fix them. Start by calling run_tests.',
      HEALER_TOOLS,
      healPage,
      150,
    );

    await healPage.close();
    await healCtx.close();

    // ── Phase 5: Final Report ──────────────────────────────────────────────────
    divider('Phase 5 — Final Report');

    const finalRun = spawnSync('npx', ['playwright', 'test', '--reporter=list', '--project=chromium'], {
      encoding: 'utf8', timeout: 120_000,
    });
    console.log((finalRun.stdout ?? '') + (finalRun.stderr ?? ''));

    console.log('─'.repeat(56));
    console.log('Run tests:');
    console.log(`  TEST_USERNAME="${creds.username ?? ''}" TEST_PASSWORD="***" npx playwright test`);
    console.log('\nRefresh session when it expires:');
    console.log(`  TEST_URL="${creds.url}" TEST_USERNAME="${creds.username ?? ''}" TEST_PASSWORD="***" npx playwright test --project=setup`);
    console.log('─'.repeat(56) + '\n');

  } finally {
    await page.close();
    await context.close();
    await browser.close();
  }
}

main().catch(err => {
  console.error('\n✗ Orchestration failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
