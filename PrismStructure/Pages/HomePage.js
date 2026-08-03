const { BasePage } = require('./BasePage');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.productCards = page.locator('[data-test="product-name"], .card-title, .product-name');
    this.searchInput = page.getByPlaceholder(/search/i);
    this.searchButton = page.getByRole('button', { name: /search/i });
  }

  async open() {
    await this.goto('/');
    await this.waitForLoad();
  }

  async getProductCount() {
    return this.productCards.count();
  }

  async addFirstProductToCart() {
    const addBtn = this.page.getByRole('button', { name: /add to cart/i }).first();
    await addBtn.click();
  }
}

module.exports = { HomePage };
