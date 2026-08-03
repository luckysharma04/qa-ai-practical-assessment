const playwright = require('@playwright/test');
const { expect } = playwright;
const { PageFactory } = require('../Pages/PageFactory');
const { HomePage } = require('../Pages/HomePage');
const { LoginPage } = require('../Pages/LoginPage');
const { RegistrationPage } = require('../Pages/RegistrationPage');
const { ProductPage } = require('../Pages/ProductPage');
const { CartPage } = require('../Pages/CartPage');
const { CheckoutPage } = require('../Pages/CheckoutPage');
const { InvoicePage } = require('../Pages/InvoicePage');
const { ProfilePage } = require('../Pages/ProfilePage');
const { ApiClient } = require('../API/clients/ApiClient');
const { AuthApi } = require('../API/services/AuthApi');
const { CartApi } = require('../API/services/CartApi');
const { InvoiceApi } = require('../API/services/InvoiceApi');
const { ProductApi } = require('../API/services/ProductApi');
const { defaultCustomer } = require('../Data/users');

/**
 * Prism fixtures — inject page objects, page factory, and API services.
 */
const test = playwright.test.extend({
  pages: async ({ page }, use) => {
    await use(new PageFactory(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registrationPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  invoicePage: async ({ page }, use) => {
    await use(new InvoicePage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
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
  loggedInPage: async ({ page, loginPage }, use) => {
    await loginPage.open();
    await loginPage.login(defaultCustomer.email, defaultCustomer.password);
    await use(page);
  },
});

module.exports = { test, expect };
