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

  async addProductByIndex(index = 0) {
    const home = this.pages.homePage();
    const product = this.pages.productPage();
    await home.open();
    await home.openProductByIndex(index);
    await product.addToCart();
    return product;
  }

  async addMultipleProductsToCart(count = 2) {
    const home = this.pages.homePage();
    const product = this.pages.productPage();
    await home.open();

    let added = 0;
    const productCount = await home.getProductCount();

    for (let index = 0; index < productCount && added < count; index += 1) {
      await home.openProductByIndex(index);
      if (!(await product.isAvailableForCart())) {
        await home.open();
        continue;
      }
      await product.addToCart();
      added += 1;
      await home.open();
    }

    if (added < count) {
      throw new Error(`Expected ${count} cart items but added ${added}`);
    }
  }

  async registerAndLogin(user) {
    await this.registerUser(user);
    const page = this.pages.homePage().page;
    if (!page.url().includes('/account')) {
      await this.loginAs(user.email, user.password);
    }
    return user;
  }

  async addInStockProductToCart() {
    const home = this.pages.homePage();
    const product = this.pages.productPage();
    await home.open();
    const productCount = await home.getProductCount();

    for (let index = 0; index < productCount; index += 1) {
      await home.openProductByIndex(index);
      if (!(await product.isAvailableForCart())) {
        await home.open();
        continue;
      }
      await product.addToCart();
      return product;
    }

    throw new Error('No in-stock product available to add to cart');
  }

  async addFirstProductToCart() {
    return this.addInStockProductToCart();
  }

  async openCartWithItems() {
    await this.addFirstProductToCart();
    const cart = this.pages.cartPage();
    await cart.open();
    return cart;
  }

  async navigateToCheckoutWithItems(itemCount = 1) {
    if (itemCount > 1) {
      await this.addMultipleProductsToCart(itemCount);
    } else {
      await this.addFirstProductToCart();
    }
    const checkout = this.pages.checkoutPage();
    await checkout.openWithItems();
    return checkout;
  }

  async navigateToCheckout() {
    return this.navigateToCheckoutWithItems(1);
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
