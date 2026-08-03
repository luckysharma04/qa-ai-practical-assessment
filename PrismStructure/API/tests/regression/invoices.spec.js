const { test } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { getApiInvoiceBilling } = require('../../../Utils/dataGenerator');
const {
  expectCartCreateResponse,
  expectInvoiceCreateResponse,
  expectInvoiceListResponse,
  expectInvoiceListed,
  expectDeleteCartResponse,
  expectStatus,
} = require('../../../Utils/apiAssertions');

test.describe('API Invoices Regression @Regression @API', () => {
  test('TC-API-RG-005 — list invoices after COD order', async ({ apiServices }) => {
    const token = await apiServices.auth.getAccessToken(
      defaultCustomer.email,
      defaultCustomer.password
    );
    apiServices.client.setToken(token);

    const cartResponse = await apiServices.cart.createCart();
    const { id: cartId } = await expectCartCreateResponse(cartResponse);

    const productId = await apiServices.product.getFirstInStockProductId();
    const addResponse = await apiServices.cart.addProduct(cartId, productId, 1);
    expectStatus(addResponse, 200);

    const billing = getApiInvoiceBilling();
    const createResponse = await apiServices.invoice.createInvoice(cartId, billing);
    const created = await expectInvoiceCreateResponse(createResponse, billing);

    const listResponse = await apiServices.invoice.listInvoices();
    const listBody = await expectInvoiceListResponse(listResponse);
    expectInvoiceListed(listBody.data, created, billing);

    const deleteResponse = await apiServices.cart.deleteCart(cartId);
    await expectDeleteCartResponse(deleteResponse);
  });
});
