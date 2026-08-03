const { BasePage } = require('./BasePage');
const { ROUTES } = require('../Config/constants');

class HomePage extends BasePage {
  constructor(page) {
    super(page);
    this.productNames = this.byTestId('product-name');
    this.productPrices = this.byTestId('product-price');
    this.searchInput = this.byTestId('search-query');
    this.searchSubmit = this.byTestId('search-submit');
    this.searchReset = this.byTestId('search-reset');
    this.sortSelect = this.byTestId('sort');
    this.filtersPanel = this.byTestId('filters');
    this.ecoFilter = this.byTestId('eco-friendly-filter');
  }

  async open() {
    await this.goto(ROUTES.home);
    await this.waitForNetworkIdle();
  }

  async getProductCount() {
    return this.productNames.count();
  }

  async search(query) {
    await this.searchInput.fill(query);
    await this.searchSubmit.click();
    await this.waitForNetworkIdle();
  }

  async clearSearch() {
    if (await this.searchReset.isVisible()) {
      await this.searchReset.click();
      await this.waitForNetworkIdle();
    }
  }

  async selectSort(optionLabel) {
    await this.sortSelect.selectOption({ label: optionLabel });
    await this.waitForNetworkIdle();
  }

  async toggleEcoFriendlyFilter() {
    await this.ecoFilter.click();
    await this.waitForNetworkIdle();
  }

  async openFirstProduct() {
    await this.productNames.first().click();
    await this.waitForNetworkIdle();
  }

  async openProductByIndex(index = 0) {
    await this.productNames.nth(index).click();
    await this.waitForNetworkIdle();
  }

  async clickCategory(testId) {
    await this.byTestId(testId).click();
    await this.waitForNetworkIdle();
  }

  async clickBrand(testId) {
    await this.byTestId(testId).click();
    await this.waitForNetworkIdle();
  }
}

module.exports = { HomePage };
