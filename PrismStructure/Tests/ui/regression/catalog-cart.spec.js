const { test } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { getSearchTerm } = require('../../../Utils/dataGenerator');
const {
  expectProductCatalog,
  expectProductSearchResults,
  expectCheckoutLineItems,
} = require('../../../Utils/assertions');

test.describe('Catalog Cart Regression @Regression', () => {
  test('TC-UI-RG-002 — search filter multi-item cart and quantity update', async ({
    uiFlows,
    homePage,
    page,
  }) => {
    test.setTimeout(120_000);
    const searchTerm = getSearchTerm(1);

    await uiFlows.loginAs(defaultCustomer.email, defaultCustomer.password);
    await homePage.open();
    await expectProductCatalog(page, { minProducts: 1 });

    await homePage.search(searchTerm);
    await expectProductSearchResults(page, searchTerm, { minResults: 1 });

    await homePage.clearSearch();

    const checkout = await uiFlows.navigateToCheckoutWithItems(2);
    await expectCheckoutLineItems(checkout, { minLines: 2 });

    await checkout.setLineItemQuantity(0, 2);
    await expectCheckoutLineItems(checkout, { minLines: 2, quantities: [2] });

    await homePage.open();
    await homePage.toggleEcoFriendlyFilter();
    await expectProductCatalog(page, { minProducts: 1 });
  });
});
