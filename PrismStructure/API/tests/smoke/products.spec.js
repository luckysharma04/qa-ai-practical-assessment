const { test, expect } = require('../../../Fixtures/testFixtures');

test.describe('API Products Smoke @Smoke', () => {
  test('TC-API-SM-001 — GET /products returns catalog', async ({ apiClient }) => {
    const { ProductApi } = require('../services/ProductApi');
    const productApi = new ProductApi(apiClient);
    const response = await productApi.listProducts();
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    const products = body.data || body;
    expect(products.length).toBeGreaterThan(0);
  });
});
