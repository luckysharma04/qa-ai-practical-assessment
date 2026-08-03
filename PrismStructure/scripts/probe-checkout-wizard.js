const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const t = (id) => page.locator(`[data-test="${id}"]`);
  page.setDefaultTimeout(25000);

  const billing = {
    street: 'Zoey Shore',
    city: 'Hesselbury',
    state: 'Florida',
    country: 'TG',
    postalCode: '1234AA',
    houseNumber: '1',
  };

  await page.goto('https://practicesoftwaretesting.com/auth/login');
  await t('email').fill('customer@practicesoftwaretesting.com');
  await t('password').fill('welcome01');
  await t('login-submit').click();
  await page.waitForURL('**/account**');

  await page.goto('https://practicesoftwaretesting.com/');
  await t('product-name').first().click();
  await page.waitForURL(/\/product\//);
  await t('add-to-cart').click();
  await page.waitForResponse((r) => r.url().includes('/carts') && r.request().method() === 'POST');

  await page.goto('https://practicesoftwaretesting.com/checkout');
  await page.waitForTimeout(1000);

  async function clickVisibleProceed(label) {
    for (const id of ['proceed-1', 'proceed-2', 'proceed-3']) {
      const btn = t(id);
      if (await btn.isVisible()) {
        console.log(label, 'clicking', id);
        await btn.click();
        await page.waitForTimeout(800);
        return id;
      }
    }
    console.log(label, 'no proceed visible');
    return null;
  }

  await clickVisibleProceed('step1');
  console.log('street visible:', await t('street').isVisible());
  await clickVisibleProceed('step2');
  console.log('street visible:', await t('street').isVisible());

  if (await t('street').isVisible()) {
    await t('street').fill(billing.street);
    await t('city').fill(billing.city);
    await t('state').fill(billing.state);
    await t('country').fill(billing.country);
    await t('postal_code').fill(billing.postalCode);
    if (await t('house_number').isVisible()) await t('house_number').fill(billing.houseNumber);
  }

  await clickVisibleProceed('step3');
  console.log('payment visible:', await t('payment-method').isVisible());

  if (await t('payment-method').isVisible()) {
    await t('payment-method').selectOption('cash-on-delivery');
  }

  await clickVisibleProceed('step4');
  const finish = t('finish');
  console.log('finish visible:', await finish.isVisible(), 'enabled:', !(await finish.isDisabled()));

  await browser.close();
})();
