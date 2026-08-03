/**
 * Prism Page Factory — central access to all page objects.
 */
const { HomePage } = require('./HomePage');
const { LoginPage } = require('./LoginPage');
const { RegistrationPage } = require('./RegistrationPage');
const { ProductPage } = require('./ProductPage');
const { CartPage } = require('./CartPage');
const { CheckoutPage } = require('./CheckoutPage');
const { InvoicePage } = require('./InvoicePage');
const { ProfilePage } = require('./ProfilePage');

class PageFactory {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
  }

  homePage() {
    return new HomePage(this.page);
  }

  loginPage() {
    return new LoginPage(this.page);
  }

  registrationPage() {
    return new RegistrationPage(this.page);
  }

  productPage() {
    return new ProductPage(this.page);
  }

  cartPage() {
    return new CartPage(this.page);
  }

  checkoutPage() {
    return new CheckoutPage(this.page);
  }

  invoicePage() {
    return new InvoicePage(this.page);
  }

  profilePage() {
    return new ProfilePage(this.page);
  }
}

module.exports = { PageFactory };
