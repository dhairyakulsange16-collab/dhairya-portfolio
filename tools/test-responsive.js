const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function testResponsive() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const viewports = [375, 768, 1440];

  for (const width of viewports) {
    await page.setViewport({ width, height: 800 });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    console.log(`Viewport ${width}px has horizontal scroll? ${hasHorizontalScroll} (scrollWidth: ${await page.evaluate(() => document.documentElement.scrollWidth)})`);
  }

  await browser.close();
}

testResponsive().catch(console.error);
