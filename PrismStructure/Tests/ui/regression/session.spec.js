const { test, expect } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const {
  expectAuthenticated,
  expectUnauthenticated,
  expectProtectedRouteBlocked,
} = require('../../../Utils/assertions');

test.describe('Session Regression @Regression', () => {
  test('TC-UI-RG-003 — login establishes session and logout blocks protected routes', async ({
    uiFlows,
    loginPage,
    page,
  }) => {
    await loginPage.open();
    await loginPage.login(defaultCustomer.email, defaultCustomer.password);

    await expect(page).toHaveURL(/\/account/);
    await expect(page.getByTestId('page-title')).toContainText(/my account/i);
    await expectAuthenticated(page);

    await uiFlows.signOut();
    await expectUnauthenticated(page);

    await expectProtectedRouteBlocked(page, '/account/invoices');
    await expectProtectedRouteBlocked(page, '/account/profile');
  });
});
