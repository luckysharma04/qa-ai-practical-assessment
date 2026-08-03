const { BasePage } = require('./BasePage');

class ProductPage extends BasePage {
  constructor(page) {
    super(page);
    this.productName = this.byTestId('product-name');
    this.productDescription = this.byTestId('product-description');
    this.quantityInput = this.byTestId('quantity');
    this.decreaseQuantity = this.byTestId('decrease-quantity');
    this.increaseQuantity = this.byTestId('increase-quantity');
    this.addToCartButton = this.byTestId('add-to-cart');
    this.addToFavoritesButton = this.byTestId('add-to-favorites');
    this.outOfStockLabel = this.byTestId('out-of-stock');
  }

  async open(productId) {
    await this.goto(`/product/${productId}`);
    await this.waitForNetworkIdle();
  }

  async getName() {
    return this.productName.textContent();
  }

  async setQuantity(quantity) {
    await this.quantityInput.fill(String(quantity));
  }

  async increaseQuantity(times = 1) {
    for (let i = 0; i < times; i += 1) {
      await this.increaseQuantity.click();
    }
  }

  async decreaseQuantity(times = 1) {
    for (let i = 0; i < times; i += 1) {
      await this.decreaseQuantity.click();
    }
  }

  async addToCart(quantity) {
    await this.page.waitForURL(/\/product\//);
    await this.addToCartButton.waitFor({ state: 'visible' });

    if (quantity !== undefined) {
      await this.setQuantity(quantity);
    }

    const cartResponse = this.page.waitForResponse(
      (response) => response.url().includes('/carts') && response.request().method() === 'POST',
      { timeout: 20_000 }
    );

    await this.addToCartButton.click();
    const response = await cartResponse;
    if (!response.ok()) {
      throw new Error(`Add to cart failed with status ${response.status()}`);
    }

    await this.page.waitForResponse(
      (res) => res.url().includes('/carts') && res.request().method() === 'GET',
      { timeout: 10_000 }
    ).catch(() => null);
    await this.page.waitForTimeout(500);
  }

  async isOutOfStock() {
    return this.outOfStockLabel.isVisible();
  }
}

module.exports = { ProductPage };
