const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const t = (id) => page.locator(`[data-test="${id}"]`);

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
  await page.waitForTimeout(2000);
  console.log('product-title count:', await t('product-title').count());
  console.log('empty text:', (await page.locator('body').innerText()).includes('empty'));

  const proceedCheckout = page.getByRole('button', { name: /proceed to checkout/i });
  console.log('step0 proceed checkout:', await proceedCheckout.isVisible());
  if (await proceedCheckout.isVisible()) {
    await proceedCheckout.click();
    await page.waitForTimeout(1000);
  }

  console.log('step1 proceed-2:', await t('proceed-2').isVisible());
  console.log('step1 street:', await t('street').isVisible());

  if (await t('proceed-2').isVisible()) {
    await t('proceed-2').click();
    await page.waitForTimeout(1000);
  }

  console.log('step2 street:', await t('street').isVisible());
  console.log('step2 proceed-3:', await t('proceed-3').isVisible());

  if (await t('street').isVisible()) {
    await t('street').fill('Zoey Shore', { force: true });
    await t('city').fill('Hesselbury', { force: true });
    await t('state').fill('Florida', { force: true });
    await t('country').fill('TG', { force: true });
    await t('postal_code').fill('1234AA', { force: true });
  }

  if (await t('proceed-3').isVisible()) {
    await t('proceed-3').click();
    await page.waitForTimeout(1000);
  }

  console.log('payment:', await t('payment-method').isVisible());
  if (await t('payment-method').isVisible()) {
    await t('payment-method').selectOption('cash-on-delivery');
  }

  const finish = t('finish');
  console.log('finish:', await finish.isVisible(), await finish.isDisabled());

  await browser.close();
})();
