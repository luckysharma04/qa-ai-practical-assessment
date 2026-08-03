const { test, expect } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const {
  expectAccountPage,
  expectAuthenticated,
  expectUnauthenticated,
  expectProtectedRouteBlocked,
} = require('../../../Utils/assertions');

test.describe('Session Regression @Regression @UI', () => {
  test('TC-UI-RG-003 — login establishes session and logout blocks protected routes', async ({
    uiFlows,
    loginPage,
    page,
  }) => {
    await loginPage.open();
    await loginPage.login(defaultCustomer.email, defaultCustomer.password);

    await expectAccountPage(page);
    await expectAuthenticated(page);

    await uiFlows.signOut();
    await expectUnauthenticated(page);

    await expectProtectedRouteBlocked(page, '/account/invoices');
    await expectProtectedRouteBlocked(page, '/account/profile');
  });
});
