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
  await page.waitForTimeout(1000);

  const profileBtn = page.getByRole('button', { name: /\d{3}/ });
  console.log('home profile btn:', await profileBtn.isVisible());
  await profileBtn.click();
  await page.waitForTimeout(500);
  console.log('nav-sign-out visible after menu:', await t('nav-sign-out').isVisible());

  await Promise.all([
    page.waitForURL(/\/(auth\/login)?$/),
    t('nav-sign-out').click(),
  ]).catch((e) => console.log('nav error', e.message));

  await page.waitForTimeout(1000);
  console.log('URL after signout from home:', page.url());

  await page.goto('https://practicesoftwaretesting.com/account/invoices');
  await page.waitForTimeout(1000);
  console.log('invoices URL:', page.url());

  await browser.close();
})();
