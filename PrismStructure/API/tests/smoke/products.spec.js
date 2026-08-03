const { test, expect } = require('../../../Fixtures/testFixtures');
const { expectProductListResponse } = require('../../../Utils/apiAssertions');

test.describe('API Products Smoke @Smoke', () => {
  test('TC-API-SM-001 — GET /products returns catalog', async ({ apiClient }) => {
    const { ProductApi } = require('../../services/ProductApi');
    const productApi = new ProductApi(apiClient);
    const response = await productApi.listProducts();

    const body = await expectProductListResponse(response);
    const inStock = body.data.filter((product) => product.in_stock);
    expect(inStock.length).toBeGreaterThan(0);
  });
});
