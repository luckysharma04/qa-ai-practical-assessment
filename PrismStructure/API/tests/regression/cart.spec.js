const { test } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const {
  expectCartCreateResponse,
  expectCartGetResponse,
  expectDeleteCartResponse,
  expectResourceId,
  expectStatus,
} = require('../../../Utils/apiAssertions');

test.describe('API Cart Regression @Regression @API', () => {
  test('TC-API-RG-002 — add update and verify cart via GET /carts/{id}', async ({
    apiServices,
  }) => {
    const token = await apiServices.auth.getAccessToken(
      defaultCustomer.email,
      defaultCustomer.password
    );
    apiServices.client.setToken(token);

    const createResponse = await apiServices.cart.createCart();
    const { id: cartId } = await expectCartCreateResponse(createResponse);

    const productId = await apiServices.product.getFirstInStockProductId();
    expectResourceId(productId, 'product id');

    const addResponse = await apiServices.cart.addProduct(cartId, productId, 1);
    expectStatus(addResponse, 200);

    const incrementResponse = await apiServices.cart.addProduct(cartId, productId, 2);
    expectStatus(incrementResponse, 200);

    const getResponse = await apiServices.cart.getCart(cartId);
    await expectCartGetResponse(getResponse, {
      cartId,
      productId,
      quantity: 3,
      lineCount: 1,
    });

    const deleteResponse = await apiServices.cart.deleteCart(cartId);
    await expectDeleteCartResponse(deleteResponse);
  });
});
