const { test, expect } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { expectAccountPage } = require('../../../Utils/assertions');

test.describe('Login Smoke @Smoke', () => {
  test('TC-UI-SM-LOGIN — login with valid customer credentials', async ({ loginPage, page }) => {
    await loginPage.open();
    await loginPage.fillCredentials(defaultCustomer.email, defaultCustomer.password);
    await loginPage.submit();

    await expectAccountPage(page);
  });
});
