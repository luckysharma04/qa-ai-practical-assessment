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

  await page.goto('https://practicesoftwaretesting.com/account/profile', { waitUntil: 'networkidle' });
  let ids = await page.locator('[data-test]').evaluateAll((els) =>
    [...new Set(els.map((e) => e.getAttribute('data-test')))].sort()
  );
  console.log('PROFILE', ids.filter((t) => !t.match(/^(nav-|lang-|category|brand|product-)/)));

  await page.goto('https://practicesoftwaretesting.com/account/invoices', { waitUntil: 'networkidle' });
  ids = await page.locator('[data-test]').evaluateAll((els) =>
    [...new Set(els.map((e) => e.getAttribute('data-test')))].sort()
  );
  console.log('INVOICES', ids.filter((t) => !t.match(/^(nav-|lang-)/)));

  await browser.close();
})();
