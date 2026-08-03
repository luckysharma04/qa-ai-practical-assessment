const { getAssessmentBilling } = require('./dataGenerator');

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

  async registerUser(user) {
    const registration = this.pages.registrationPage();
    await registration.open();
    await registration.register(user);
  }

  async searchProducts(query) {
    const home = this.pages.homePage();
    await home.open();
    await home.search(query);
  }

  async addFirstProductToCart() {
    const home = this.pages.homePage();
    const product = this.pages.productPage();
    await home.open();
    await home.openFirstProduct();
    await product.addToCart();
  }

  async openCartWithItems() {
    await this.addFirstProductToCart();
    const cart = this.pages.cartPage();
    await cart.open();
    return cart;
  }

  async navigateToCheckout() {
    await this.addFirstProductToCart();
    const checkout = this.pages.checkoutPage();
    await checkout.open();
    return checkout;
  }

  async completeCodCheckout(billing = getAssessmentBilling().ui) {
    const checkout = await this.navigateToCheckout();
    await checkout.completeCashOnDeliveryCheckout(billing);
  }

  async smokePurchaseFlow(email, password, billing = getAssessmentBilling().ui) {
    await this.loginAs(email, password);
    await this.completeCodCheckout(billing);
    return this.pages.invoicePage();
  }

  async signOut() {
    const home = this.pages.homePage();
    await home.page.goto('/');
    await home.page.getByTestId('nav-menu').waitFor({ state: 'visible', timeout: 15_000 });
    await home.signOut();
  }
}

module.exports = { UiFlows };
