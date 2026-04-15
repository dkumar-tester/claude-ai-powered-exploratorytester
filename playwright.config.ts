import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  testMatch: [
    '**/suite3-password-reset/*.spec.ts',
    '**/suite12-error-handling/special*.spec.ts',
    '**/suite12-error-handling/sql*.spec.ts',
    '**/cloudqa/*.spec.ts',
  ],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [['list']],

  use: {
    trace: 'off',
    screenshot: 'off',
    video: 'off',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: [],
    },
  ],
});
