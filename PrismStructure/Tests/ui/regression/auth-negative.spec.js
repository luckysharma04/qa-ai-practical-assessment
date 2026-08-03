const { test, expect } = require('../../../Fixtures/testFixtures');
const { defaultCustomer } = require('../../../Data/users');
const {
  registrationUser,
  getInvalidLoginCase,
} = require('../../../Utils/dataGenerator');
const {
  expectLoginRejected,
  expectRegistrationErrorVisible,
} = require('../../../Utils/assertions');

test.describe('Auth Negative Regression @Regression', () => {
  test('TC-UI-RG-004 — invalid login and duplicate registration are rejected', async ({
    loginPage,
    registrationPage,
    page,
  }) => {
    const invalidLogin = getInvalidLoginCase('invalid-login-wrong-password');

    await loginPage.open();
    await loginPage.attemptLogin(invalidLogin.email, invalidLogin.password);
    await expectLoginRejected(page);

    const duplicateUser = {
      ...registrationUser(),
      email: defaultCustomer.email,
    };

    await registrationPage.open();
    await registrationPage.fillRegistrationForm(duplicateUser);
    await registrationPage.submit();

    await expect(page).toHaveURL(/auth\/register/);
    await expectRegistrationErrorVisible(page);
    await expect(page.getByTestId('nav-sign-in')).toBeVisible();
  });
});
