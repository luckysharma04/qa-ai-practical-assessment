const { expect } = require('@playwright/test');
const { INVOICE_NUMBER_PATTERN } = require('../API/schemas/apiSchemas');

/**
 * Reusable UI assertion helpers (auth, cart, invoice, catalog).
 */
async function expectAuthenticated(page) {
  await expect(page.getByTestId('nav-sign-in')).not.toBeVisible();
  await expect(page.getByTestId('nav-menu')).toBeVisible();
}

async function expectUnauthenticated(page) {
  await expect(page.getByTestId('nav-sign-in')).toBeVisible();
}

async function expectAccountPage(page) {
  await expect(page).toHaveURL(/\/account/);
  await expect(page.getByTestId('page-title')).toContainText(/my account/i);
  await expectAuthenticated(page);
}

async function expectLoginPage(page) {
  await expect(page).toHaveURL(/auth\/login/);
  await expect(page.getByTestId('email')).toBeVisible();
  await expect(page.getByTestId('password')).toBeVisible();
}

async function expectLoginRejected(page) {
  await expectLoginPage(page);
  await expectUnauthenticated(page);
  const alert = page.locator('.alert-danger, [role="alert"]').first();
  await expect(alert).toBeVisible();
  await expect(alert).not.toBeEmpty();
}

async function expectProtectedRouteBlocked(page, route = '/account/invoices') {
  await page.goto(route);
  await expectLoginPage(page);
}

async function expectRegistrationErrorVisible(page) {
  const alert = page.locator('.alert-danger, [role="alert"]').first();
  await expect(alert).toBeVisible();
  await expect(alert).not.toBeEmpty();
}

async function expectProfileDetails(profilePage, user) {
  await expect(profilePage.firstNameInput).toHaveValue(user.firstName);
  await expect(profilePage.lastNameInput).toHaveValue(user.lastName);
  await expect(profilePage.emailInput).toHaveValue(user.email);
  await expect(profilePage.firstNameInput).not.toHaveValue('');
  await expect(profilePage.lastNameInput).not.toHaveValue('');
}

async function expectProductCatalog(page, { minProducts = 1 } = {}) {
  const names = page.getByTestId('product-name');
  await expect(names.first()).toBeVisible();
  const count = await names.count();
  expect(count).toBeGreaterThanOrEqual(minProducts);
  await expect(names.first()).not.toBeEmpty();
  const price = page.getByTestId('product-price').first();
  await expect(price).toBeVisible();
  await expect(price).toContainText(/\d/);
}

async function expectProductSearchResults(page, searchTerm, { minResults = 1 } = {}) {
  await expect(page.getByTestId('product-name').first()).toBeVisible();
  const names = page.getByTestId('product-name');
  const count = await names.count();
  expect(count).toBeGreaterThanOrEqual(minResults);

  const texts = await names.allTextContents();
  const normalized = searchTerm.toLowerCase();
  const hasMatch = texts.some((text) => text.toLowerCase().includes(normalized));
  expect(hasMatch, `expected a product name containing "${searchTerm}"`).toBe(true);
}

async function expectCheckoutLineItems(checkout, {
  minLines = 1,
  quantities = [],
  attachedOnly = false,
} = {}) {
  const lineCount = await checkout.productTitle.count();
  expect(lineCount).toBeGreaterThanOrEqual(minLines);

  for (let i = 0; i < minLines; i++) {
    const title = checkout.productTitle.nth(i);
    if (attachedOnly) {
      await expect(title).toBeAttached();
    } else {
      await expect(title).toBeVisible();
    }
    await expect(title).not.toBeEmpty();
  }

  if (attachedOnly) {
    await expect(checkout.cartTotal).toBeAttached();
  } else {
    await expect(checkout.cartTotal).toBeVisible();
  }
  await expect(checkout.cartTotal).toContainText(/\d/);

  for (let i = 0; i < quantities.length; i++) {
    const qtyValue = await checkout.getLineItemQuantityValue(i);
    expect(Number(qtyValue)).toBe(quantities[i]);
  }
}

async function expectCheckoutConfirmStep(page, checkout) {
  await expect(page.getByTestId('finish')).toBeAttached();
  await expect(checkout.finishButton).toBeEnabled();
  await expectCheckoutLineItems(checkout, { minLines: 1, attachedOnly: true });
}

async function expectBillingFieldsPopulated(checkout) {
  await expect(checkout.streetInput).not.toHaveValue('');
  await expect(checkout.cityInput).not.toHaveValue('');
  await expect(checkout.stateInput).not.toHaveValue('');
  await expect(checkout.postalCodeInput).not.toHaveValue('');
  await expect(checkout.houseNumberInput).not.toHaveValue('');
}

async function expectBillingFieldsFilled(checkout, billing) {
  await expect(checkout.streetInput).toHaveValue(billing.street);
  await expect(checkout.cityInput).toHaveValue(billing.city);
  await expect(checkout.stateInput).toHaveValue(billing.state);
  await expect(checkout.postalCodeInput).toHaveValue(billing.postalCode);
}

async function expectInvoiceListPage(page, invoicePage, {
  minRows = 1,
  billing,
} = {}) {
  await expect(page.getByTestId('page-title')).toContainText(/invoice/i);
  await invoicePage.waitForInvoiceRows(minRows);

  const rowCount = await invoicePage.getInvoiceRowCount();
  expect(rowCount).toBeGreaterThanOrEqual(minRows);

  const invoiceNumber = await invoicePage.getLatestInvoiceNumber();
  expect(invoiceNumber).toBeTruthy();
  expect(invoiceNumber.trim()).toMatch(INVOICE_NUMBER_PATTERN);

  if (billing) {
    const latestBilling = await invoicePage.getLatestInvoiceBillingText();
    expect(latestBilling).toContain(billing.street);
    await invoicePage.openLatestInvoiceDetails();
    await invoicePage.expectLatestInvoiceBilling(billing);
  }
}

async function expectInvoiceCountStable(invoicePage, expectedCount) {
  const count = await invoicePage.getInvoiceRowCount();
  expect(count).toBe(expectedCount);
}

async function expectEmptyCheckoutBlocked(checkout) {
  expect(await checkout.isCartEmpty()).toBe(true);
  await expect(checkout.proceed1).not.toBeVisible();
  await expect(checkout.productTitle).toHaveCount(0);
}

async function expectBillingValidationBlocksProceed(checkout) {
  await expect(checkout.proceed3).toBeDisabled();
  await expect(checkout.streetInput).toBeVisible();

  const street = await checkout.streetInput.inputValue();
  const postal = await checkout.postalCodeInput.inputValue();
  const house = await checkout.houseNumberInput.inputValue();
  const hasMissingRequired = street === '' || postal === '' || house === '';
  expect(hasMissingRequired).toBe(true);
}

module.exports = {
  expectAuthenticated,
  expectUnauthenticated,
  expectAccountPage,
  expectLoginPage,
  expectLoginRejected,
  expectProtectedRouteBlocked,
  expectRegistrationErrorVisible,
  expectProfileDetails,
  expectProductCatalog,
  expectProductSearchResults,
  expectCheckoutLineItems,
  expectCheckoutConfirmStep,
  expectBillingFieldsPopulated,
  expectBillingFieldsFilled,
  expectInvoiceListPage,
  expectInvoiceCountStable,
  expectEmptyCheckoutBlocked,
  expectBillingValidationBlocksProceed,
};
