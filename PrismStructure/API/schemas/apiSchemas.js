const { expect } = require('@playwright/test');

const JWT_PATTERN = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
const INVOICE_NUMBER_PATTERN = /^INV-\d+/;
const RESOURCE_ID_PATTERN = /^[0-9A-Z]{26}$/i;

function expectResourceId(value, label = 'id') {
  expect(value, `${label} must be present`).toBeTruthy();
  expect(typeof value).toBe('string');
  expect(value.length).toBeGreaterThan(10);
  expect(value).toMatch(RESOURCE_ID_PATTERN);
}

function expectKeys(obj, keys) {
  for (const key of keys) {
    expect(obj, `missing property "${key}"`).toHaveProperty(key);
  }
}

function expectStringFields(obj, fields) {
  for (const field of fields) {
    expect(typeof obj[field]).toBe('string');
    expect(obj[field].length).toBeGreaterThan(0);
  }
}

function expectNumberFields(obj, fields, { min = 0 } = {}) {
  for (const field of fields) {
    expect(typeof obj[field]).toBe('number');
    expect(obj[field]).toBeGreaterThanOrEqual(min);
  }
}

function expectLoginBody(body) {
  expectKeys(body, ['access_token', 'token_type', 'expires_in']);
  expect(body.access_token).toMatch(JWT_PATTERN);
  expect(body.token_type).toBe('bearer');
  expect(typeof body.expires_in).toBe('number');
  expect(body.expires_in).toBeGreaterThan(0);
}

function expectRegisterBody(body, payload) {
  expectKeys(body, ['id', 'email', 'first_name', 'last_name', 'created_at']);
  expectResourceId(body.id, 'user id');
  expect(body.email).toBe(payload.email);
  expect(body.first_name).toBe(payload.first_name);
  expect(body.last_name).toBe(payload.last_name);
  expect(body).toHaveProperty('address');
  expect(typeof body.address).toBe('object');
}

function expectCartCreateBody(body) {
  expectKeys(body, ['id']);
  expectResourceId(body.id, 'cart id');
}

function expectCartItem(item) {
  expectKeys(item, ['id', 'product_id', 'quantity', 'cart_id', 'product']);
  expectResourceId(item.id, 'cart item id');
  expectResourceId(item.product_id, 'product_id');
  expectResourceId(item.cart_id, 'cart_id');
  expect(typeof item.quantity).toBe('number');
  expect(item.quantity).toBeGreaterThan(0);
  expectProductSummary(item.product);
}

function expectProductSummary(product) {
  expectKeys(product, ['id', 'name', 'price']);
  expectResourceId(product.id, 'product id');
  expectStringFields(product, ['name']);
  expect(typeof product.price).toBe('number');
  expect(product.price).toBeGreaterThan(0);
}

function expectCartBody(cart, { cartId, productId, quantity, lineCount = 1 } = {}) {
  expectKeys(cart, ['id', 'cart_items']);
  expectResourceId(cart.id, 'cart id');
  if (cartId) {
    expect(cart.id).toBe(cartId);
  }
  expect(Array.isArray(cart.cart_items)).toBe(true);
  expect(cart.cart_items.length).toBe(lineCount);

  const line = cart.cart_items.find((row) => row.product_id === productId) || cart.cart_items[0];
  expectCartItem(line);

  if (productId) {
    expect(line.product_id).toBe(productId);
  }
  if (quantity !== undefined) {
    expect(line.quantity).toBe(quantity);
  }
}

function expectInvoiceBody(invoice, billing) {
  expectKeys(invoice, [
    'id',
    'invoice_number',
    'invoice_date',
    'subtotal',
    'total',
    'billing_street',
    'billing_city',
    'billing_state',
    'billing_country',
    'billing_postal_code',
    'user_id',
    'created_at',
  ]);
  expectResourceId(invoice.id, 'invoice id');
  expectResourceId(invoice.user_id, 'user_id');
  expect(invoice.invoice_number).toMatch(INVOICE_NUMBER_PATTERN);
  expectStringFields(invoice, [
    'billing_street',
    'billing_city',
    'billing_state',
    'billing_country',
    'billing_postal_code',
  ]);
  expectNumberFields(invoice, ['subtotal', 'total'], { min: 0.01 });
  expect(invoice.total).toBeGreaterThanOrEqual(invoice.subtotal);

  if (billing) {
    expect(invoice.billing_street).toBe(billing.billing_street);
    expect(invoice.billing_city).toBe(billing.billing_city);
    expect(invoice.billing_state).toBe(billing.billing_state);
    expect(invoice.billing_country).toBe(billing.billing_country);
    expect(invoice.billing_postal_code).toBe(billing.billing_postal_code);
  }
}

function expectInvoiceListItem(item, createdInvoice, billing) {
  expectKeys(item, [
    'id',
    'invoice_number',
    'total',
    'subtotal',
    'billing_street',
    'billing_city',
    'billing_state',
    'billing_country',
    'billing_postal_code',
    'invoicelines',
    'payment',
  ]);
  expect(item.id).toBe(createdInvoice.id);
  expect(item.invoice_number).toBe(createdInvoice.invoice_number);
  expectNumberFields(item, ['total', 'subtotal'], { min: 0.01 });
  expect(Array.isArray(item.invoicelines)).toBe(true);
  expect(item.invoicelines.length).toBeGreaterThan(0);
  expect(typeof item.payment).toBe('object');

  if (billing) {
    expect(item.billing_street).toBe(billing.billing_street);
    expect(item.billing_city).toBe(billing.billing_city);
    expect(item.billing_state).toBe(billing.billing_state);
    expect(item.billing_country).toBe(billing.billing_country);
    expect(item.billing_postal_code).toBe(billing.billing_postal_code);
  }
}

function expectProduct(product) {
  expectKeys(product, [
    'id',
    'name',
    'description',
    'price',
    'in_stock',
    'product_image',
    'category',
    'brand',
  ]);
  expectProductSummary(product);
  expect(typeof product.in_stock).toBe('boolean');
  expectStringFields(product, ['description']);
  expect(typeof product.product_image).toBe('object');
  expect(typeof product.category).toBe('object');
  expect(typeof product.brand).toBe('object');
}

function expectProductListBody(body) {
  expect(body).toHaveProperty('data');
  expect(Array.isArray(body.data)).toBe(true);
  expect(body.data.length).toBeGreaterThan(0);
  expectProduct(body.data[0]);
  if (body.current_page !== undefined) {
    expect(typeof body.current_page).toBe('number');
  }
  if (body.total !== undefined) {
    expect(body.total).toBeGreaterThan(0);
  }
}

function expectUnauthorizedBody(body) {
  expectKeys(body, ['message']);
  expectStringFields(body, ['message']);
  expect(body.message.toLowerCase()).toMatch(/unauthorized|forbidden|token/);
}

function expectErrorBody(body) {
  expect(typeof body).toBe('object');
  const hasMessage = typeof body.message === 'string' && body.message.length > 0;
  const hasErrors = typeof body.errors === 'object' && body.errors !== null;
  const hasFieldErrors = Object.keys(body).some(
    (key) =>
      key !== 'message' &&
      key !== 'errors' &&
      Array.isArray(body[key]) &&
      body[key].length > 0
  );
  expect(hasMessage || hasErrors || hasFieldErrors).toBe(true);
}

module.exports = {
  JWT_PATTERN,
  INVOICE_NUMBER_PATTERN,
  expectLoginBody,
  expectRegisterBody,
  expectCartCreateBody,
  expectCartBody,
  expectCartItem,
  expectInvoiceBody,
  expectInvoiceListItem,
  expectProduct,
  expectProductListBody,
  expectUnauthorizedBody,
  expectErrorBody,
  expectResourceId,
};
