const { test, expect } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const { getApiInvoiceBilling } = require('../../../Utils/dataGenerator');
const { expectStatus } = require('../../../Utils/apiAssertions');

test.describe('API Invoices Regression @Regression', () => {
  test('TC-API-RG-005 — list invoices after COD order', async ({ apiServices }) => {
    const token = await apiServices.auth.getAccessToken(
      defaultCustomer.email,
      defaultCustomer.password
    );
    apiServices.client.setToken(token);

    const cartResponse = await apiServices.cart.createCart();
    expectStatus(cartResponse, 201);
    const { id: cartId } = await cartResponse.json();

    const productId = await apiServices.product.getFirstInStockProductId();
    await apiServices.cart.addProduct(cartId, productId, 1);

    const billing = getApiInvoiceBilling();
    const createResponse = await apiServices.invoice.createInvoice(cartId, billing);
    expectStatus(createResponse, 201);
    const created = await createResponse.json();

    const listResponse = await apiServices.invoice.listInvoices();
    expectStatus(listResponse, 200);
    const invoices = (await listResponse.json()).data || await listResponse.json();

    const match = invoices.find((row) => row.id === created.id);
    expect(match).toBeTruthy();
    expect(match.billing_city).toBe(billing.billing_city);
    expect(match.billing_postal_code).toBe(billing.billing_postal_code);
    expect(match.total).toBeGreaterThan(0);

    await apiServices.cart.deleteCart(cartId);
  });
});
