const path = require('path');
const { faker } = require('@faker-js/faker');

const DATA_ROOT = path.join(__dirname, '../../test-data');

function loadJson(filename) {
  return require(path.join(DATA_ROOT, filename));
}

/**
 * Dynamic test data to avoid shared-DB collisions on public SUT.
 */
function uniqueEmail() {
  const stamp = Date.now();
  return `testuser_${stamp}@example.com`;
}

function registrationUser() {
  const stamp = Date.now();
  const valid = loadJson('users-valid.json').validUsers[0];
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dob: valid.dob,
    country: valid.address.country,
    postalCode: valid.address.postalCode,
    houseNumber: valid.address.houseNumber || '42',
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    phone: faker.string.numeric(10),
    email: `testuser_${stamp}@example.com`,
    password: `RegPass_${stamp}!xY9`,
  };
}

function getStaticCustomer() {
  return loadJson('users-valid.json').staticSutAccounts.defaultCustomer;
}

function getAssessmentBilling() {
  return loadJson('addresses.json').assessmentReference;
}

function getInvalidLoginCase(id) {
  return loadJson('users-invalid.json').login.find((c) => c.id === id);
}

function getInvalidRegistrationCase(id) {
  return loadJson('users-invalid.json').registration.find((c) => c.id === id);
}

function getSearchTerm(index = 1) {
  return loadJson('products.json').searchTerms.valid[index];
}

function getNegativeApiCase(id) {
  return loadJson('negative-data.json').api.find((c) => c.id === id);
}

function getBoundaryCart() {
  return loadJson('boundary-values.json').cart;
}

function getApiInvoiceBilling() {
  const ref = loadJson('addresses.json').assessmentReference;
  return {
    billing_street: ref.billing_street,
    billing_city: ref.billing_city,
    billing_state: ref.billing_state,
    billing_country: ref.billing_country,
    billing_postal_code: ref.billing_postal_code,
  };
}

function apiRegistrationPayload() {
  const user = registrationUser();
  return {
    first_name: user.firstName,
    last_name: user.lastName,
    email: user.email,
    password: user.password,
    dob: user.dob,
    phone: user.phone,
    address: {
      street: user.street,
      city: user.city,
      state: user.state,
      country: 'US',
      postal_code: user.postalCode,
    },
  };
}

module.exports = {
  uniqueEmail,
  registrationUser,
  getStaticCustomer,
  getAssessmentBilling,
  getApiInvoiceBilling,
  apiRegistrationPayload,
  getInvalidLoginCase,
  getInvalidRegistrationCase,
  getNegativeApiCase,
  getBoundaryCart,
  getSearchTerm,
  loadJson,
};
