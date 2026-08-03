const { test, expect } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { expectStatus } = require('../../../Utils/apiAssertions');

test.describe('API Cart Regression @Regression', () => {
  test('TC-API-RG-002 — add update and verify cart via GET /carts/{id}', async ({
    apiServices,
  }) => {
    const token = await apiServices.auth.getAccessToken(
      defaultCustomer.email,
      defaultCustomer.password
    );
    apiServices.client.setToken(token);

    const createResponse = await apiServices.cart.createCart();
    expectStatus(createResponse, 201);
    const { id: cartId } = await createResponse.json();

    const productId = await apiServices.product.getFirstInStockProductId();
    expect(productId).toBeTruthy();

    const addResponse = await apiServices.cart.addProduct(cartId, productId, 1);
    expectStatus(addResponse, 200);

    const incrementResponse = await apiServices.cart.addProduct(cartId, productId, 2);
    expectStatus(incrementResponse, 200);

    const getResponse = await apiServices.cart.getCart(cartId);
    expectStatus(getResponse, 200);
    const cart = await getResponse.json();

    expect(cart.cart_items.length).toBeGreaterThan(0);
    expect(cart.cart_items[0].product_id).toBe(productId);
    expect(cart.cart_items[0].quantity).toBe(3);

    const deleteResponse = await apiServices.cart.deleteCart(cartId);
    expect([200, 204]).toContain(deleteResponse.status());
  });
});
