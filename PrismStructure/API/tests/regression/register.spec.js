const { test, expect } = require('../../../Fixtures/testFixtures');
const { apiRegistrationPayload } = require('../../../Utils/dataGenerator');
const { expectStatus } = require('../../../Utils/apiAssertions');

test.describe('API Registration Regression @Regression', () => {
  test('TC-API-RG-001 — POST /users/register creates user', async ({ apiServices }) => {
    const payload = apiRegistrationPayload();

    const response = await apiServices.auth.register(payload);
    expectStatus(response, 201);

    const loginResponse = await apiServices.auth.login(payload.email, payload.password);
    expectStatus(loginResponse, 200);

    const body = await loginResponse.json();
    expect(body.access_token).toBeTruthy();
  });
});
