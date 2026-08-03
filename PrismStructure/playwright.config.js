// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const path = require('path');
const { env } = require('./Config/env');
const { TAG_GREP } = require('./Config/constants');

const chrome = { ...devices['Desktop Chrome'] };
const reportsDir = path.join(__dirname, 'Reports');

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
    ['html', { outputFolder: path.join(reportsDir, 'playwright-report'), open: 'never' }],
    ['json', { outputFile: path.join(reportsDir, 'test-results.json') }],
    ['junit', { outputFile: path.join(reportsDir, 'junit-results.xml') }],
    [
      path.join(reportsDir, 'reporters', 'failureLogReporter.js'),
      { outputDir: path.join(reportsDir, 'failure-logs') },
    ],
  ],
  outputDir: path.join(reportsDir, 'test-results'),
  use: {
    baseURL: env.uiBaseUrl,
    testIdAttribute: 'data-test',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 60_000,
  },
  projects: [
    {
      name: 'ui-smoke',
      grep: TAG_GREP.uiSmoke,
      use: chrome,
      retries: 1,
    },
    {
      name: 'ui-regression',
      grep: TAG_GREP.uiRegression,
      use: chrome,
    },
    {
      name: 'api-smoke',
      grep: TAG_GREP.apiSmoke,
      use: chrome,
    },
    {
      name: 'api-regression',
      grep: TAG_GREP.apiRegression,
      use: chrome,
    },
  ],
});
