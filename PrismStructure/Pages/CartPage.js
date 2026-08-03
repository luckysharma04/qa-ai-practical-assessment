const { BasePage } = require('./BasePage');
const { ROUTES } = require('../Config/constants');

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.cartQuantity = this.byTestId('cart-quantity');
    this.productTitle = this.byTestId('product-title');
    this.productQuantity = this.byTestId('product-quantity');
    this.productPrice = this.byTestId('product-price');
    this.linePrice = this.byTestId('line-price');
    this.cartTotal = this.byTestId('cart-total');
    this.continueShopping = this.byTestId('continue-shopping');
    this.proceed1 = this.byTestId('proceed-1');
    this.proceed2 = this.byTestId('proceed-2');
    this.proceed3 = this.byTestId('proceed-3');
  }

  async open() {
    await this.goto(ROUTES.cart);
    await this.waitForNetworkIdle();
  }

  async getCartQuantityBadge() {
    return this.cartQuantity.textContent();
  }

  async getLineItemCount() {
    return this.productTitle.count();
  }

  async getCartTotalText() {
    return this.cartTotal.textContent();
  }

  async continueShopping() {
    await this.continueShopping.click();
  }

  async proceedToCheckout() {
    if (await this.proceed1.isVisible()) {
      await this.proceed1.click();
    }
    if (await this.proceed2.isVisible()) {
      await this.proceed2.click();
    }
    if (await this.proceed3.isVisible()) {
      await this.proceed3.click();
    }
    await this.waitForNetworkIdle();
  }
}

module.exports = { CartPage };
