const { chromium } = require('@playwright/test');
const { faker } = require('@faker-js/faker');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(25000);
  const stamp = Date.now();
  const user = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    dob: '1983-04-10',
    postalCode: '42954',
    houseNumber: '609',
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: 'Kansas',
    phone: faker.phone.number('###-###-####'),
    email: `testuser_${stamp}@example.com`,
    password: 'TestPass123!',
  };

  await page.goto('https://practicesoftwaretesting.com/auth/register');
  await page.waitForLoadState('networkidle');

  await page.locator('[data-test="first-name"]').fill(user.firstName);
  await page.locator('[data-test="last-name"]').fill(user.lastName);
  await page.locator('[data-test="dob"]').fill(user.dob);
  const countryValue = await page.locator('[data-test="country"] option').nth(1).getAttribute('value');
  await page.locator('[data-test="country"]').selectOption(countryValue);
  await page.locator('[data-test="postal_code"]').fill(user.postalCode);
  await page.locator('[data-test="house_number"]').fill(user.houseNumber);
  await page.locator('[data-test="street"]').fill(user.street);
  await page.locator('[data-test="city"]').fill(user.city);
  await page.locator('[data-test="state"]').fill(user.state);
  await page.locator('[data-test="phone"]').fill(user.phone);
  await page.locator('[data-test="email"]').fill(user.email);
  await page.locator('[data-test="password"]').fill(user.password);
  await page.locator('[data-test="register-submit"]').click();
  await page.waitForTimeout(3000);

  console.log('After register URL:', page.url());
  const alerts = await page.locator('.alert-danger, [role="alert"]').allTextContents();
  console.log('Alerts:', alerts);
  const body = await page.locator('body').innerText();
  console.log('Body snippet:', body.slice(0, 600));

  if (page.url().includes('/auth/login')) {
    await page.locator('[data-test="email"]').fill(user.email);
    await page.locator('[data-test="password"]').fill(user.password);
    await page.locator('[data-test="login-submit"]').click();
    await page.waitForTimeout(3000);
    console.log('After login URL:', page.url());
    const loginAlerts = await page.locator('.alert-danger, [role="alert"]').allTextContents();
    console.log('Login alerts:', loginAlerts);
  }

  await browser.close();
})();
