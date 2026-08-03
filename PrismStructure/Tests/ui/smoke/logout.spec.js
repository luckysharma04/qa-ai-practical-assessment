const { test, expect } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');

test.describe('Logout Smoke @Smoke', () => {
  test('TC-UI-SM-LOGOUT — logout ends session and blocks protected routes', async ({
    uiFlows,
    page,
  }) => {
    await uiFlows.loginAs(defaultCustomer.email, defaultCustomer.password);
    await expect(page.getByTestId('page-title')).toContainText(/my account/i);

    await uiFlows.signOut();
    await expect(page.getByTestId('nav-sign-in')).toBeVisible();

    await page.goto('/account/invoices');
    await expect(page).toHaveURL(/auth\/login/);
    await expect(page.getByTestId('email')).toBeVisible();
    await expect(page.getByTestId('password')).toBeVisible();
  });
});
