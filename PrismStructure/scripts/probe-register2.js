const { chromium } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const t = (id) => page.locator(`[data-test="${id}"]`);
  const stamp = Date.now();

  const user = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dob: '1983-04-10',
    postalCode: '42954',
    houseNumber: '609',
    street: '9109 The Mews',
    city: 'Fort Kariane',
    state: 'Kansas',
    phone: faker.string.numeric(10),
    email: `testuser_${stamp}@example.com`,
    password: `RegPass_${stamp}!xY9`,
  };

  await page.goto('https://practicesoftwaretesting.com/auth/register');
  await t('first-name').fill(user.firstName);
  await t('last-name').fill(user.lastName);
  await t('dob').fill(user.dob);
  const countryValue = await t('country').locator('option').nth(1).getAttribute('value');
  await t('country').selectOption(countryValue);
  await t('postal_code').fill(user.postalCode);
  await t('house_number').fill(user.houseNumber);
  await t('street').fill(user.street);
  await t('city').fill(user.city);
  await t('state').fill(user.state);
  await t('phone').fill(user.phone);
  await t('email').fill(user.email);
  await t('password').fill(user.password);
  await t('register-submit').click();
  await page.waitForTimeout(3000);
  console.log('URL:', page.url());
  const alerts = await page.locator('.alert-danger, [role="alert"]').allTextContents();
  console.log('Alerts:', alerts);

  await browser.close();
})();
