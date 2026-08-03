const { test, expect } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');

test.describe('Cart Smoke @Smoke', () => {
  test('TC-UI-SM-CART — add product to cart and verify line item', async ({ uiFlows, pages, page }) => {
    await uiFlows.loginAs(defaultCustomer.email, defaultCustomer.password);
    await uiFlows.addFirstProductToCart();

    const checkout = pages.checkoutPage();
    await checkout.open();

    await expect(page.getByTestId('product-title').first()).toBeVisible();
    expect(await checkout.hasCheckoutLineItems()).toBeTruthy();
  });
});
