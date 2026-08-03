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

function getNegativeApiCase(id) {
  return loadJson('negative-data.json').api.find((c) => c.id === id);
}

function getBoundaryCart() {
  return loadJson('boundary-values.json').cart;
}

module.exports = {
  uniqueEmail,
  registrationUser,
  getStaticCustomer,
  getAssessmentBilling,
  getInvalidLoginCase,
  getNegativeApiCase,
  getBoundaryCart,
  loadJson,
};
