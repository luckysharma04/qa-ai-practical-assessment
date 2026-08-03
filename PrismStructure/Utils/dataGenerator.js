const { faker } = require('@faker-js/faker');

/**
 * Dynamic test data to avoid shared-DB collisions on public SUT.
 */
function uniqueEmail() {
  const stamp = Date.now();
  return `testuser_${stamp}@example.com`;
}

function registrationUser() {
  return {
    email: uniqueEmail(),
    password: 'TestPass123!',
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };
}

module.exports = { uniqueEmail, registrationUser };
