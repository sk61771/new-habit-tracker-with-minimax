const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    errors.push(err.message);
  });

  console.log('Navigating to http://localhost:5200...');
  await page.goto('http://localhost:5200', { waitUntil: 'networkidle' });

  await page.waitForTimeout(2000);

  const title = await page.title();
  console.log('Page title:', title);

  const bodyContent = await page.evaluate(() => {
    return document.body.innerText.substring(0, 500);
  });
  console.log('Body content preview:', bodyContent);

  const hasRoot = await page.evaluate(() => {
    const root = document.getElementById('root');
    return root ? root.innerHTML.length > 0 : false;
  });
  console.log('Root element has content:', hasRoot);

  if (errors.length > 0) {
    console.log('\n❌ Console errors found:');
    errors.forEach(e => console.log('  -', e));
  } else {
    console.log('\n✅ No console errors!');
  }

  await browser.close();

  if (errors.length > 0 || !hasRoot) {
    process.exit(1);
  }
  console.log('\n✅ App loaded successfully!');
})();
