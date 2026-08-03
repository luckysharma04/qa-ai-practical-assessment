const { BasePage } = require('./BasePage');
const { ROUTES } = require('../Config/constants');
const { PAYMENT_METHOD } = require('../Config/constants');

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.streetInput = this.byTestId('street');
    this.cityInput = this.byTestId('city');
    this.stateInput = this.byTestId('state');
    this.countryInput = this.byTestId('country');
    this.postalCodeInput = this.byTestId('postal_code');
    this.houseNumberInput = this.byTestId('house_number');
    this.paymentMethodSelect = this.byTestId('payment-method');
    this.finishButton = this.byTestId('finish');
    this.proceed1 = this.byTestId('proceed-1');
    this.proceed2 = this.byTestId('proceed-2');
    this.proceed3 = this.byTestId('proceed-3');
    this.cartTotal = this.byTestId('cart-total');
    this.productTitle = this.byTestId('product-title');
  }

  async open() {
    await this.goto(ROUTES.checkout);
    await this.waitForNetworkIdle();
  }

  async openWithItems() {
    await this.open();
    await this.productTitle.first().waitFor({ state: 'visible', timeout: 20_000 });
  }

  async openEmpty() {
    await this.open();
    await this.page.waitForTimeout(1000);
  }

  async isCartEmpty() {
    return (await this.productTitle.count()) === 0;
  }

  async clickProceed(stepLocator) {
    if (await stepLocator.isVisible() && !(await stepLocator.isDisabled())) {
      await stepLocator.click();
      await this.page.waitForTimeout(800);
      return true;
    }
    return false;
  }

  async clickEnabledProceed() {
    for (const step of [this.proceed1, this.proceed2, this.proceed3]) {
      if (await step.isVisible() && !(await step.isDisabled())) {
        await step.click();
        await this.page.waitForTimeout(800);
        return true;
      }
    }
    return false;
  }

  async fillField(locator, value) {
    if (!value) return;
    const tagName = await locator.evaluate((el) => el.tagName.toLowerCase());
    if (tagName === 'select') {
      await locator.selectOption(value);
      return;
    }
    await locator.fill(value, { force: true });
  }

  async goToBillingStep() {
    await this.clickProceed(this.proceed1);
    await this.clickProceed(this.proceed2);
    await this.streetInput.waitFor({ state: 'visible', timeout: 15_000 });
  }

  /**
   * @param {object} billing
   */
  async fillBillingAddress(billing) {
    await this.goToBillingStep();

    await this.fillField(this.streetInput, billing.street);
    await this.fillField(this.cityInput, billing.city);
    await this.fillField(this.stateInput, billing.state);
    await this.fillField(this.countryInput, billing.country);
    await this.fillField(this.postalCodeInput, billing.postalCode);
    await this.fillField(this.houseNumberInput, billing.houseNumber || '42');
    await this.postalCodeInput.press('Tab');
    await this.page.waitForTimeout(400);

    await this.clickEnabledProceed();
    await this.page.waitForTimeout(500);
  }

  async selectCashOnDelivery() {
    const paymentVisible = await this.paymentMethodSelect
      .waitFor({ state: 'visible', timeout: 10_000 })
      .then(() => true)
      .catch(() => false);

    if (paymentVisible) {
      await this.paymentMethodSelect.selectOption(PAYMENT_METHOD.cashOnDelivery);
    } else {
      await this.paymentMethodSelect.selectOption(PAYMENT_METHOD.cashOnDelivery, { force: true });
    }
    await this.clickEnabledProceed();
  }

  async goToConfirmStep() {
    await this.finishButton.waitFor({ state: 'attached', timeout: 15_000 });
    await this.page.waitForFunction(
      (selector) => {
        const el = document.querySelector(`[data-test="${selector}"]`);
        return el && !el.disabled;
      },
      'finish',
      { timeout: 15_000 }
    );
  }

  /** Single confirm — used for negative invoice scenarios. */
  async confirmInvoiceOnce() {
    await this.goToConfirmStep();
    await this.clickFinishButton();
    await this.page.waitForTimeout(1000);
  }

  async isProceedDisabled(stepLocator) {
    return stepLocator.isDisabled();
  }

  async getLineItemQuantityValue(index = 0) {
    const qtyInput = this.byTestId('product-quantity').nth(index);
    return qtyInput.inputValue();
  }

  async setLineItemQuantity(index, quantity) {
    const qtyInput = this.byTestId('product-quantity').nth(index);
    await qtyInput.fill(String(quantity));
    await qtyInput.press('Tab');
    await this.page.waitForTimeout(500);
  }

  async clickFinishButton() {
    await this.page.evaluate(() => {
      const finish = document.querySelector('[data-test="finish"]');
      if (finish && !finish.disabled) finish.click();
    });
  }

  /** Assessment: invoice requires two Confirm/Finish actions. */
  async confirmInvoiceTwice() {
    await this.goToConfirmStep();

    const invoiceResponse = this.page.waitForResponse(
      (response) => response.url().includes('/invoices') && response.request().method() === 'POST',
      { timeout: 20_000 }
    );

    await this.clickFinishButton();
    await invoiceResponse.catch(() => null);
    await this.page.waitForTimeout(600);
    await this.clickFinishButton();
    await this.waitForNetworkIdle();
  }

  async completeCashOnDeliveryCheckout(billing) {
    await this.fillBillingAddress(billing);
    await this.selectCashOnDelivery();
    await this.confirmInvoiceTwice();
  }

  async hasCheckoutLineItems() {
    return (await this.productTitle.count()) > 0;
  }
}

module.exports = { CheckoutPage };
