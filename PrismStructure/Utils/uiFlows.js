const { validBillingUi } = require('../Data/billing');

/**
 * Reusable UI flows composing page objects (Prism workflow helpers).
 */
class UiFlows {
  /** @param {import('../Pages/PageFactory').PageFactory} pages */
  constructor(pages) {
    this.pages = pages;
  }

  async loginAs(email, password) {
    const login = this.pages.loginPage();
    await login.open();
    await login.login(email, password);
  }

  async addFirstProductToCart() {
    const home = this.pages.homePage();
    const product = this.pages.productPage();
    await home.open();
    await home.openFirstProduct();
    await product.addToCart();
  }

  async completeCodCheckout(billing = validBillingUi) {
    const checkout = this.pages.checkoutPage();
    await checkout.open();
    await checkout.completeCashOnDeliveryCheckout(billing);
  }

  async smokePurchaseFlow(email, password, billing = validBillingUi) {
    await this.loginAs(email, password);
    await this.addFirstProductToCart();
    await this.completeCodCheckout(billing);
    return this.pages.invoicePage();
  }
}

module.exports = { UiFlows };
