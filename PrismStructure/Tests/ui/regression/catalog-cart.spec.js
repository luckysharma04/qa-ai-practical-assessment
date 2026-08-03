const { test, expect } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { getSearchTerm } = require('../../../Utils/dataGenerator');

test.describe('Catalog Cart Regression @Regression', () => {
  test('TC-UI-RG-002 — search filter multi-item cart and quantity update', async ({
    uiFlows,
    homePage,
    page,
  }) => {
    const searchTerm = getSearchTerm(1);

    await uiFlows.loginAs(defaultCustomer.email, defaultCustomer.password);
    await homePage.open();

    const initialCount = await homePage.getProductCount();
    expect(initialCount).toBeGreaterThan(0);

    await homePage.search(searchTerm);
    await expect(page.getByTestId('product-name').first()).toBeVisible();
    const searchCount = await homePage.getProductCount();
    expect(searchCount).toBeGreaterThan(0);

    await homePage.clearSearch();

    const checkout = await uiFlows.navigateToCheckoutWithItems(2);

    const lineItems = await checkout.productTitle.count();
    expect(lineItems).toBeGreaterThanOrEqual(2);

    await checkout.setLineItemQuantity(0, 2);
    const qtyValue = await checkout.getLineItemQuantityValue(0);
    expect(Number(qtyValue)).toBe(2);

    await homePage.open();
    await homePage.toggleEcoFriendlyFilter();
    const filteredCount = await homePage.getProductCount();
    expect(filteredCount).toBeGreaterThan(0);
  });
});
