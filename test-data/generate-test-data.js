/**
 * Generates realistic Toolshop test data with @faker-js/faker and writes JSON files.
 *
 * Usage (from repo root):
 *   node test-data/generate-test-data.js
 *
 * Usage (from PrismStructure):
 *   node ../test-data/generate-test-data.js
 */
const path = require('path');
const { faker } = require(path.join(__dirname, '../PrismStructure/node_modules/@faker-js/faker'));
const fs = require('fs');

const OUT_DIR = path.join(__dirname);

/** Stable seed for reproducible committed JSON; change seed to refresh dataset. */
faker.seed(20260803);

function timestamp() {
  return Date.now();
}

function buildAddress() {
  return {
    street: faker.location.streetAddress(),
    houseNumber: String(faker.number.int({ min: 1, max: 999 })),
    city: faker.location.city(),
    state: faker.location.state(),
    country: 'United States of America',
    countryCode: faker.location.countryCode(),
    postalCode: faker.location.zipCode('#####'),
  };
}

function buildValidUser(index = 0) {
  const stamp = timestamp() + index;
  const address = buildAddress();
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  return {
    id: `user-valid-${index + 1}`,
    description: 'Valid registration and login user',
    firstName,
    lastName,
    email: `testuser_${stamp}@example.com`,
    password: 'TestPass123!',
    dob: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().slice(0, 10),
    phone: faker.phone.number('##########'),
    address: {
      street: address.street,
      houseNumber: address.houseNumber,
      city: address.city,
      state: address.state,
      country: address.country,
      postalCode: address.postalCode,
    },
    apiRegisterPayload: {
      first_name: firstName,
      last_name: lastName,
      email: `testuser_${stamp}@example.com`,
      password: 'TestPass123!',
      dob: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }).toISOString().slice(0, 10),
      phone: faker.phone.number('##########'),
      address: {
        street: address.street,
        city: address.city,
        state: address.state,
        country: address.country,
        postal_code: address.postalCode,
      },
    },
  };
}

function buildAssessmentBilling() {
  return {
    id: 'billing-assessment-reference',
    description: 'Assessment invoice POST example',
    billing_street: 'Zoey Shore',
    billing_city: 'Hesselbury',
    billing_state: 'Florida',
    billing_country: 'TG',
    billing_postal_code: '1234AA',
    payment_method: 'cash-on-delivery',
    payment_details: {},
    ui: {
      street: 'Zoey Shore',
      city: 'Hesselbury',
      state: 'Florida',
      country: 'TG',
      postalCode: '1234AA',
    },
  };
}

function generateUsersValid() {
  return {
    meta: {
      generatedAt: new Date().toISOString(),
      source: '@faker-js/faker',
      purpose: 'Valid users for registration, login, profile',
    },
    staticSutAccounts: {
      defaultCustomer: {
        email: 'customer@practicesoftwaretesting.com',
        password: 'welcome01',
        role: 'user',
      },
      secondaryCustomer: {
        email: 'customer2@practicesoftwaretesting.com',
        password: 'welcome01',
        role: 'user',
      },
      adminUser: {
        email: 'admin@practicesoftwaretesting.com',
        password: 'welcome01',
        role: 'admin',
      },
    },
    validUsers: Array.from({ length: 5 }, (_, i) => buildValidUser(i)),
  };
}

function generateAddresses() {
  const fakerAddresses = Array.from({ length: 5 }, (_, i) => {
    const a = buildAddress();
    return {
      id: `address-valid-${i + 1}`,
      description: 'Valid billing / registration address',
      ...a,
      ui: {
        street: a.street,
        city: a.city,
        state: a.state,
        country: a.countryCode,
        postalCode: a.postalCode,
        houseNumber: a.houseNumber,
      },
      api: {
        billing_street: a.street,
        billing_city: a.city,
        billing_state: a.state,
        billing_country: a.countryCode,
        billing_postal_code: a.postalCode,
      },
    };
  });

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      source: '@faker-js/faker',
    },
    assessmentReference: buildAssessmentBilling(),
    validAddresses: fakerAddresses,
  };
}

function generateProducts() {
  return {
    meta: {
      generatedAt: new Date().toISOString(),
      source: '@faker-js/faker + Toolshop catalog patterns',
      note: 'Product IDs are dynamic on public SUT; use GET /products or UI data-test product-* at runtime.',
    },
    searchTerms: {
      valid: [
        faker.commerce.productName().split(' ')[0],
        'hammer',
        'saw',
        'drill',
        faker.commerce.productAdjective(),
      ],
      invalid: ['', '   ', '%', '@#$', 'zzznonexistentproduct999'],
    },
    syntheticCatalogItems: Array.from({ length: 5 }, (_, i) => ({
      id: `synthetic-product-${i + 1}`,
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
      category: faker.commerce.department(),
      brand: faker.company.name(),
      inStock: faker.datatype.boolean(),
    })),
    filterExamples: {
      ecoFriendly: true,
      sortOptions: ['Name (A - Z)', 'Price (Low - High)', 'Price (High - Low)'],
    },
  };
}

function generateInvalidUsers() {
  const validEmail = `existing_${timestamp()}@example.com`;
  return {
    meta: {
      generatedAt: new Date().toISOString(),
      source: '@faker-js/faker + known SUT rules',
    },
    login: [
      {
        id: 'invalid-login-wrong-password',
        email: 'customer@practicesoftwaretesting.com',
        password: 'wrongpassword99',
        expected: 'Login rejected; no session',
      },
      {
        id: 'invalid-login-unknown-email',
        email: faker.internet.email(),
        password: 'TestPass123!',
        expected: 'Login rejected; no session',
      },
      {
        id: 'invalid-login-empty-password',
        email: 'customer@practicesoftwaretesting.com',
        password: '',
        expected: 'Validation error or login rejected',
      },
      {
        id: 'invalid-login-email-spaces',
        email: '  customer@practicesoftwaretesting.com  ',
        password: 'welcome01',
        expected: 'Trimmed success or validation error (document actual)',
      },
    ],
    registration: [
      {
        id: 'invalid-register-duplicate-email',
        email: 'customer@practicesoftwaretesting.com',
        password: 'TestPass123!',
        expected: 'Duplicate email error',
      },
      {
        id: 'invalid-register-bad-email',
        email: 'not-an-email',
        password: 'TestPass123!',
        expected: 'Email format validation error',
      },
      {
        id: 'invalid-register-weak-password',
        email: faker.internet.email(),
        password: 'weak',
        expected: 'Password policy validation error',
      },
      {
        id: 'invalid-register-missing-first-name',
        email: faker.internet.email(),
        password: 'TestPass123!',
        firstName: '',
        expected: 'Required field validation error',
      },
    ],
    duplicateEmailSample: validEmail,
  };
}

function generateNegativeData() {
  return {
    meta: {
      generatedAt: new Date().toISOString(),
      purpose: 'Negative UI and API test payloads',
    },
    checkout: [
      {
        id: 'negative-empty-cart',
        scenario: 'Checkout with empty cart',
        precondition: 'Cart has zero items',
        expected: 'Checkout blocked or error shown',
      },
      {
        id: 'negative-missing-billing-street',
        billing: {
          street: '',
          city: faker.location.city(),
          state: faker.location.state(),
          country: 'TG',
          postalCode: faker.location.zipCode(),
        },
        expected: 'Billing validation error',
      },
      {
        id: 'negative-missing-payment-method',
        scenario: 'Proceed without selecting payment method',
        expected: 'Checkout blocked',
      },
      {
        id: 'negative-single-confirm-invoice',
        scenario: 'Click finish/confirm only once',
        expected: 'Invoice not complete in My Invoices',
      },
    ],
    api: [
      {
        id: 'negative-api-no-token',
        headers: {},
        expectedStatus: [401, 403],
      },
      {
        id: 'negative-api-invalid-token',
        headers: { Authorization: 'Bearer invalid.token.value' },
        expectedStatus: [401, 403],
      },
      {
        id: 'negative-api-invalid-cart-id',
        invoicePayload: {
          billing_street: 'Zoey Shore',
          billing_city: 'Hesselbury',
          billing_state: 'Florida',
          billing_country: 'TG',
          billing_postal_code: '1234AA',
          payment_method: 'cash-on-delivery',
          cart_id: 'invalid-cart-id-000',
          payment_details: {},
        },
        expectedStatus: [400, 404, 422],
      },
      {
        id: 'negative-api-missing-billing-field',
        invoicePayload: {
          billing_city: 'Hesselbury',
          payment_method: 'cash-on-delivery',
          cart_id: '<dynamic>',
          payment_details: {},
        },
        expectedStatus: [400, 422],
      },
      {
        id: 'negative-api-wrong-payment-method',
        invoicePayload: {
          billing_street: 'Zoey Shore',
          billing_city: 'Hesselbury',
          billing_state: 'Florida',
          billing_country: 'TG',
          billing_postal_code: '1234AA',
          payment_method: 'invalid-method',
          cart_id: '<dynamic>',
          payment_details: {},
        },
        expectedStatus: [400, 422],
      },
    ],
    search: [
      { query: "'; DROP TABLE--", expected: 'No crash; safe handling' },
      { query: faker.string.alphanumeric(150), expected: 'Long input handled gracefully' },
    ],
  };
}

function generateBoundaryValues() {
  const longStreet = faker.lorem.words(30).slice(0, 120);
  return {
    meta: {
      generatedAt: new Date().toISOString(),
      purpose: 'Boundary and edge-case inputs',
    },
    registration: {
      passwordMinValid: 'TestPass1!',
      passwordBelowMin: 'Test1!',
      emailMaxLength: `${'a'.repeat(240)}@example.com`,
      phoneBoundary: '1234567890',
      dobFuture: '2099-01-01',
      dobMinAge: '2010-01-01',
    },
    cart: {
      quantityZero: 0,
      quantityNegative: -1,
      quantityLarge: 9999,
      quantityNonNumeric: 'abc',
      rapidAddClicks: 3,
    },
    checkout: {
      unicodeStreet: 'straße 42 🏠',
      emojiCity: 'Test🏙️',
      specialCharsPostal: '!!!',
      assessmentPostalValid: '1234AA',
      whitespaceOnlyStreet: '   ',
    },
    strings: {
      empty: '',
      whitespace: '   ',
      singleChar: 'A',
      longString: faker.lorem.paragraphs(3).slice(0, 500),
      unicode: '日本語テスト',
      sqlLike: '%_;--',
    },
    invoice: {
      confirmClicksRequired: 2,
      confirmClicksSingle: 1,
    },
    addresses: {
      minValid: {
        street: 'A',
        city: 'B',
        state: 'FL',
        country: 'TG',
        postalCode: '1',
      },
      maxLike: {
        street: longStreet,
        city: faker.location.city(),
        state: faker.location.state(),
        country: 'TG',
        postalCode: '1234AA',
      },
    },
  };
}

function writeJson(filename, data) {
  const filePath = path.join(OUT_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`Written ${filePath}`);
}

function main() {
  writeJson('users-valid.json', generateUsersValid());
  writeJson('addresses.json', generateAddresses());
  writeJson('products.json', generateProducts());
  writeJson('users-invalid.json', generateInvalidUsers());
  writeJson('negative-data.json', generateNegativeData());
  writeJson('boundary-values.json', generateBoundaryValues());

  writeJson('test-data-manifest.json', {
    generatedAt: new Date().toISOString(),
    generator: 'test-data/generate-test-data.js',
    files: [
      'users-valid.json',
      'addresses.json',
      'products.json',
      'users-invalid.json',
      'negative-data.json',
      'boundary-values.json',
      'users.json',
      'billing.json',
      'invoice-payload.example.json',
    ],
  });
}

main();
