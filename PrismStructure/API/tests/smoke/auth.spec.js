const { test, expect } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { expectStatus } = require('../../../Utils/apiAssertions');

test.describe('API Auth Smoke @Smoke', () => {
  test('TC-API-SM-002 — login returns access_token', async ({ apiServices }) => {
    const response = await apiServices.auth.login(
      defaultCustomer.email,
      defaultCustomer.password
    );

    expectStatus(response, 200);
    const body = await response.json();
    expect(body.access_token).toBeTruthy();
    expect(typeof body.access_token).toBe('string');
  });
});
