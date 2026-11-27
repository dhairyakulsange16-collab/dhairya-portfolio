const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_PATH = path.join(__dirname, 'screenshots', 'magenta-test.png');

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function run() {
  console.log('--- RUNNING MAGENTA PIPELINE PROOF TEST ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  let connected = false;
  for (let i = 0; i < 20; i++) {
    try {
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 15000 });
      connected = true;
      break;
    } catch (e) {
      console.log(`Waiting for dev server... attempt ${i + 1}`);
      await delay(1000);
    }
  }

  if (!connected) {
    console.error('Could not connect to http://localhost:3000');
    await browser.close();
    process.exit(1);
  }

  // Check if magenta div exists and its computed styles
  const magentaInfo = await page.evaluate(() => {
    const el = document.getElementById('magenta-test-div');
    if (!el) return { found: false };
    const cs = window.getComputedStyle(el);
    return {
      found: true,
      display: cs.display,
      position: cs.position,
      zIndex: cs.zIndex,
      opacity: cs.opacity,
      backgroundColor: cs.backgroundColor
    };
  });
  console.log('Magenta Div Computed Style:', magentaInfo);

  // Check elementsFromPoint at an open area
  const elementsAtCorner = await page.evaluate(() => {
    const list = document.elementsFromPoint(50, 50) || [];
    return list.map(e => `${e.tagName.toLowerCase()}${e.id ? '#' + e.id : ''}.${e.className.split(' ')[0]}`);
  });
  console.log('Elements at point (50, 50):', elementsAtCorner);

  await page.screenshot({ path: SCREENSHOT_PATH, fullPage: false });
  console.log(`Screenshot saved to: ${SCREENSHOT_PATH}`);

  await browser.close();
  console.log('--- MAGENTA PROOF TEST FINISHED ---');
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
