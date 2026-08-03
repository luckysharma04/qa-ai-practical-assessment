const { test } = require('../../../Fixtures/testFixtures');
const { registrationUser } = require('../../../Utils/dataGenerator');
const { expectAccountPage } = require('../../../Utils/assertions');

test.describe('Registration Smoke @Smoke @UI', () => {
  test('TC-UI-SM-REG — register new user and access account', async ({
    registrationPage,
    loginPage,
    page,
  }) => {
    const user = registrationUser();

    await registrationPage.open();
    await registrationPage.register(user);

    if (page.url().includes('/auth/login')) {
      await loginPage.login(user.email, user.password);
    }

    await expectAccountPage(page);
  });
});
