const path = require('path');
const { test } = require('../../../Fixtures/testFixtures');
const { expectProductCatalog, expectProductSearchResults } = require('../../../Utils/assertions');

const productsData = require(path.join(__dirname, '../../../../test-data/products.json'));

test.describe('Catalog Smoke @Smoke @UI', () => {
  test('TC-UI-SM-001 — home catalog loads and search returns products', async ({ homePage, page }) => {
    test.setTimeout(90_000);
    const searchTerm = productsData.searchTerms.valid[1];

    await homePage.open();
    await expectProductCatalog(page, { minProducts: 1 });

    await homePage.search(searchTerm);
    await expectProductSearchResults(page, searchTerm, { minResults: 1 });
  });
});
