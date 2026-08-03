const { test as base, expect } = require('@playwright/test');
const { LoginPage } = require('../Pages/LoginPage');
const { HomePage } = require('../Pages/HomePage');
const { CheckoutPage } = require('../Pages/CheckoutPage');
const { ApiClient } = require('../API/clients/ApiClient');
const { AuthApi } = require('../API/services/AuthApi');
const { CartApi } = require('../API/services/CartApi');
const { InvoiceApi } = require('../API/services/InvoiceApi');
const { ProductApi } = require('../API/services/ProductApi');
const { defaultCustomer } = require('../Data/users');

/**
 * Prism fixtures — inject page objects and API services into tests.
 */
const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  apiClient: async ({}, use) => {
    const client = await ApiClient.create();
    await use(client);
    await client.request.dispose();
  },
  authenticatedApi: async ({}, use) => {
    const client = await ApiClient.create();
    const authApi = new AuthApi(client);
    const token = await authApi.getAccessToken(
      defaultCustomer.email,
      defaultCustomer.password
    );
    client.setToken(token);
    await use({
      client,
      auth: new AuthApi(client),
      cart: new CartApi(client),
      invoice: new InvoiceApi(client),
      product: new ProductApi(client),
    });
    await client.request.dispose();
  },
});

module.exports = { test, expect };
