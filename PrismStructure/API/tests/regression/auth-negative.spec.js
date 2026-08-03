const { test, expect } = require('../../../Fixtures/testFixtures');
const { getNegativeApiCase } = require('../../../Utils/dataGenerator');
const { expectStatusOneOf } = require('../../../Utils/apiAssertions');

test.describe('API Auth Negative Regression @Regression', () => {
  test('TC-API-RG-003 — missing and invalid bearer token rejected', async ({
    apiServices,
  }) => {
    const noTokenCase = getNegativeApiCase('negative-api-no-token');
    const invalidTokenCase = getNegativeApiCase('negative-api-invalid-token');

    const noTokenResponse = await apiServices.client.get('/invoices', {
      headers: noTokenCase.headers,
    });
    expectStatusOneOf(noTokenResponse, noTokenCase.expectedStatus);

    const invalidTokenResponse = await apiServices.client.get('/invoices', {
      headers: invalidTokenCase.headers,
    });
    expectStatusOneOf(invalidTokenResponse, invalidTokenCase.expectedStatus);
  });
});
