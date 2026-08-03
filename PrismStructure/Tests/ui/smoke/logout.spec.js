const { test } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const {
  expectAccountPage,
  expectLoginPage,
  expectUnauthenticated,
} = require('../../../Utils/assertions');

test.describe('Logout Smoke @Smoke', () => {
  test('TC-UI-SM-LOGOUT — logout ends session and blocks protected routes', async ({
    uiFlows,
    page,
  }) => {
    await uiFlows.loginAs(defaultCustomer.email, defaultCustomer.password);
    await expectAccountPage(page);

    await uiFlows.signOut();
    await expectUnauthenticated(page);

    await page.goto('/account/invoices');
    await expectLoginPage(page);
  });
});
