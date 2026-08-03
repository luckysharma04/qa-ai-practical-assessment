const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const sel = (id) => page.locator(`[data-test="${id}"]`);

  await page.goto('https://practicesoftwaretesting.com/auth/login', { waitUntil: 'networkidle' });
  await sel('email').fill('customer@practicesoftwaretesting.com');
  await sel('password').fill('welcome01');
  await sel('login-submit').click();
  await page.waitForURL('**/account**');

  const ids = await page.locator('[data-test]').evaluateAll((els) =>
    [...new Set(els.map((e) => e.getAttribute('data-test')))]
  );
  console.log(ids.filter((t) => /nav|sign|invoice|profile|cart|account/i.test(t)));
  await browser.close();
})();
