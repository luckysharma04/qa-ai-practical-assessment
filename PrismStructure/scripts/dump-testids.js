const { chromium } = require('@playwright/test');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://practicesoftwaretesting.com/', { waitUntil: 'networkidle' });
  const tests = await page.locator('[data-test]').evaluateAll((els) =>
    els.map((el) => el.getAttribute('data-test')).filter(Boolean)
  );
  console.log('HOME', [...new Set(tests)].sort().join('\n'));
  await page.locator('[data-test="nav-sign-in"]').click();
  await page.waitForLoadState('networkidle');
  const loginTests = await page.locator('[data-test]').evaluateAll((els) =>
    els.map((el) => el.getAttribute('data-test')).filter(Boolean)
  );
  console.log('LOGIN', [...new Set(loginTests)].sort().join('\n'));
  await browser.close();
})();
