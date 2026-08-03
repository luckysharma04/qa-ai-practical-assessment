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

  await page.goto('https://practicesoftwaretesting.com/', { waitUntil: 'networkidle' });
  await sel('product-name').first().click();
  await page.waitForLoadState('networkidle');
  await sel('add-to-cart').click();
  await page.waitForTimeout(1500);

  await page.goto('https://practicesoftwaretesting.com/cart', { waitUntil: 'networkidle' });
  let ids = await page.locator('[data-test]').evaluateAll((els) =>
    [...new Set(els.map((e) => e.getAttribute('data-test')))]
  );
  console.log('CART', ids.filter((t) => !t.match(/^(nav-|lang-|category|brand)/)));

  await page.goto('https://practicesoftwaretesting.com/checkout', { waitUntil: 'networkidle' });
  ids = await page.locator('[data-test]').evaluateAll((els) =>
    [...new Set(els.map((e) => e.getAttribute('data-test')))]
  );
  console.log('CHECKOUT', ids.filter((t) => !t.match(/^(nav-|lang-)/)));

  // fill billing if fields exist
  if (await sel('street').count()) {
    await sel('street').fill('Zoey Shore');
    await sel('city').fill('Hesselbury');
    await sel('state').fill('Florida');
    await sel('country').fill('TG');
    await sel('postal_code').fill('1234AA');
  }
  const proceed = page.locator('[data-test^="proceed"]');
  if (await proceed.count()) await proceed.first().click();
  await page.waitForTimeout(1000);
  ids = await page.locator('[data-test]').evaluateAll((els) =>
    [...new Set(els.map((e) => e.getAttribute('data-test')))]
  );
  console.log('CHECKOUT STEP2', ids.filter((t) => /proceed|confirm|finish|payment/i.test(t)));

  await browser.close();
})();
