const { expect } = require('@playwright/test');

/**
 * Reusable UI assertion helpers (auth state, errors, protected routes).
 */
async function expectAuthenticated(page) {
  await expect(page.getByTestId('nav-sign-in')).not.toBeVisible();
}

async function expectUnauthenticated(page) {
  await expect(page.getByTestId('nav-sign-in')).toBeVisible();
}

async function expectLoginRejected(page) {
  await expect(page).toHaveURL(/auth\/login/);
  await expectUnauthenticated(page);
  await expect(page.locator('.alert-danger, [role="alert"]').first()).toBeVisible();
}

async function expectProtectedRouteBlocked(page, route = '/account/invoices') {
  await page.goto(route);
  await expect(page).toHaveURL(/auth\/login/);
  await expect(page.getByTestId('email')).toBeVisible();
}

async function expectRegistrationErrorVisible(page) {
  await expect(page.locator('.alert-danger, [role="alert"]').first()).toBeVisible();
}

module.exports = {
  expectAuthenticated,
  expectUnauthenticated,
  expectLoginRejected,
  expectProtectedRouteBlocked,
  expectRegistrationErrorVisible,
};
