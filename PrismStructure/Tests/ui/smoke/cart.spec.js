const { test } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { expectCheckoutLineItems } = require('../../../Utils/assertions');

test.describe('Cart Smoke @Smoke @UI', () => {
  test('TC-UI-SM-CART — add product to cart and verify line item', async ({ uiFlows, pages }) => {
    await uiFlows.loginAs(defaultCustomer.email, defaultCustomer.password);
    await uiFlows.addFirstProductToCart();

    const checkout = pages.checkoutPage();
    await checkout.openWithItems();

    await expectCheckoutLineItems(checkout, { minLines: 1 });
  });
});
