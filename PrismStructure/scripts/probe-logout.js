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

  const profileBtn = page.getByRole('button', { name: /\d{3}/ });
  console.log('profile btn visible:', await profileBtn.isVisible());
  await profileBtn.click();
  await page.waitForTimeout(500);

  console.log('nav-sign-out visible:', await t('nav-sign-out').isVisible());
  console.log('nav-sign-out text:', await t('nav-sign-out').textContent().catch(() => ''));

  await t('nav-sign-out').click();
  await page.waitForTimeout(1000);
  console.log('URL after signout:', page.url());

  await page.goto('https://practicesoftwaretesting.com/account/invoices');
  await page.waitForTimeout(1000);
  console.log('URL invoices after logout:', page.url());

  await browser.close();
})();
