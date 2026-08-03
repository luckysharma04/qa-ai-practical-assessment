// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');
const { env } = require('./Config/env');

module.exports = defineConfig({
  testDir: '.',
  testMatch: ['Tests/**/*.spec.js', 'API/tests/**/*.spec.js'],
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  timeout: 60_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: path.join('Reports', 'playwright-report'), open: 'never' }],
    ['json', { outputFile: path.join('Reports', 'test-results.json') }],
  ],
  outputDir: path.join('Reports', 'test-results'),
  use: {
    baseURL: env.uiBaseUrl,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'off',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
