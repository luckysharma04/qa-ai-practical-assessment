const { faker } = require('@faker-js/faker');

/**
 * Dynamic test data to avoid shared-DB collisions on public SUT.
 */
function uniqueEmail() {
  const stamp = Date.now();
  return `testuser_${stamp}@example.com`;
}

function registrationUser() {
  const stamp = Date.now();
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dob: '1990-06-15',
    country: 'United States of America',
    postalCode: '1234AA',
    houseNumber: '42',
    street: 'Zoey Shore',
    city: 'Hesselbury',
    state: 'Florida',
    phone: '1234567890',
    email: `testuser_${stamp}@example.com`,
    password: 'TestPass123!',
  };
}

module.exports = { uniqueEmail, registrationUser };
