const path = require('path');
const { test, expect } = require('../../../Fixtures/testFixtures');

const productsData = require(path.join(__dirname, '../../../../test-data/products.json'));

test.describe('Product Search Smoke @Smoke', () => {
  test('TC-UI-SM-SEARCH — search returns product results', async ({ homePage, page }) => {
    const searchTerm = productsData.searchTerms.valid[1];

    await homePage.open();
    const initialCount = await homePage.getProductCount();
    expect(initialCount).toBeGreaterThan(0);

    await homePage.search(searchTerm);
    await expect(page.getByTestId('product-name').first()).toBeVisible();

    const resultCount = await homePage.getProductCount();
    expect(resultCount).toBeGreaterThan(0);
  });
});
