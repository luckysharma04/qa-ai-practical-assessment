const { test } = require('../../../Fixtures/testFixtures');
const { apiRegistrationPayload } = require('../../../Utils/dataGenerator');
const {
  expectRegisterResponse,
  expectLoginResponse,
} = require('../../../Utils/apiAssertions');

test.describe('API Registration Regression @Regression', () => {
  test('TC-API-RG-001 — POST /users/register creates user', async ({ apiServices }) => {
    const payload = apiRegistrationPayload();

    const response = await apiServices.auth.register(payload);
    await expectRegisterResponse(response, payload);

    const loginResponse = await apiServices.auth.login(payload.email, payload.password);
    await expectLoginResponse(loginResponse);
  });
});
