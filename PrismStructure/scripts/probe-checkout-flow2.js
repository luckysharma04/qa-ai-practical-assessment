const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const t = (id) => page.locator(`[data-test="${id}"]`);
  const billing = {
    street: 'Zoey Shore',
    city: 'Hesselbury',
    state: 'Florida',
    country: 'TG',
    postalCode: '1234AA',
  };

  await page.goto('https://practicesoftwaretesting.com/auth/login');
  await t('email').fill('customer@practicesoftwaretesting.com');
  await t('password').fill('welcome01');
  await t('login-submit').click();
  await page.waitForURL('**/account**');

  await page.goto('https://practicesoftwaretesting.com/');
  await t('product-name').first().click();
  await Promise.all([
    page.waitForResponse((r) => r.url().includes('/carts') && r.request().method() === 'POST'),
    t('add-to-cart').click(),
  ]);

  await page.goto('https://practicesoftwaretesting.com/checkout');
  await page.waitForTimeout(3000);
  console.log('body:', (await page.locator('body').innerText()).slice(0, 400));

  const btn = page.getByRole('button', { name: /proceed to checkout/i });
  console.log('proceed checkout visible:', await btn.isVisible());
  if (await btn.isVisible()) await btn.click();
  await page.waitForTimeout(1000);

  console.log('street visible:', await t('street').isVisible());
  console.log('proceed-2 visible:', await t('proceed-2').isVisible());

  if (await t('proceed-2').isVisible()) {
    await t('proceed-2').click();
    await page.waitForTimeout(1000);
  }

  console.log('street after proceed-2:', await t('street').isVisible());

  if (await t('street').isVisible()) {
    await t('street').fill(billing.street);
    await t('city').fill(billing.city);
    await t('state').fill(billing.state);
    await t('country').fill(billing.country);
    await t('postal_code').fill(billing.postalCode);
  }

  if (await t('proceed-3').isVisible()) {
    await t('proceed-3').click();
    await page.waitForTimeout(1000);
  }

  console.log('payment visible:', await t('payment-method').isVisible());
  if (await t('payment-method').isVisible()) {
    await t('payment-method').selectOption('cash-on-delivery');
  }

  const finish = t('finish');
  console.log('finish visible:', await finish.isVisible(), 'disabled:', await finish.isDisabled());

  await browser.close();
})();
