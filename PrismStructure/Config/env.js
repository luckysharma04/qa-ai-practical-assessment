/**
 * Environment configuration — single source for URLs and runtime flags.
 * Override via env vars: UI_BASE_URL, API_BASE_URL
 */
const env = {
  uiBaseUrl: process.env.UI_BASE_URL || 'https://practicesoftwaretesting.com',
  apiBaseUrl: process.env.API_BASE_URL || 'https://api.practicesoftwaretesting.com',
  isCI: !!process.env.CI,
};

module.exports = { env };
