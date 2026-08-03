const { test } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { expectLoginResponse } = require('../../../Utils/apiAssertions');

test.describe('API Auth Smoke @Smoke', () => {
  test('TC-API-SM-002 — login returns access_token', async ({ apiServices }) => {
    const response = await apiServices.auth.login(
      defaultCustomer.email,
      defaultCustomer.password
    );

    await expectLoginResponse(response);
  });
});
