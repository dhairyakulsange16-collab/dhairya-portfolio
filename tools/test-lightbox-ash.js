const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });

  const cardSelector = '[aria-label="View Ash Frames"]';

  // Scroll to work section first so intersection observer sees the cards
  await page.evaluate(() => {
    document.getElementById('work').scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 600));

  // Scroll the Ash Frames card directly into view
  await page.evaluate((sel) => {
    const card = document.querySelector(sel);
    if (card) {
      card.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  }, cardSelector);
  await new Promise(r => setTimeout(r, 1000));

  // Check if video element is now rendered by IntersectionObserver
  const isInViewCheck = await page.evaluate((sel) => {
    const card = document.querySelector(sel);
    const video = card ? card.querySelector('video') : null;
    return {
      cardFound: Boolean(card),
      videoMounted: Boolean(video),
      videoSrc: video ? video.getAttribute('src') : null
    };
  }, cardSelector);
  console.log('Ash Frames element state after scrollIntoView:', isInViewCheck);

  // Test hover
  await page.hover(cardSelector);
  await new Promise(r => setTimeout(r, 800));

  const isVideoPlaying = await page.evaluate((sel) => {
    const card = document.querySelector(sel);
    const video = card ? card.querySelector('video') : null;
    return video ? { exists: true, paused: video.paused, muted: video.muted } : { exists: false };
  }, cardSelector);
  console.log('Hover video state for Ash Frames:', isVideoPlaying);

  // Click card to open lightbox directly via DOM click
  console.log('Clicking Ash Frames card...');
  await page.evaluate((sel) => {
    const card = document.querySelector(sel);
    if (card) card.click();
  }, cardSelector);
  await new Promise(r => setTimeout(r, 1000));

  const modalInfo = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"]');
    if (!modal) return null;
    const title = modal.querySelector('h3, span.text-sm')?.textContent;
    const vid = modal.querySelector('video');
    return {
      open: true,
      title: title || modal.getAttribute('aria-label'),
      videoSrc: vid ? vid.src : null,
      videoPlaying: vid ? !vid.paused : false
    };
  });
  console.log('Lightbox state after click:', modalInfo);

  // Press ArrowRight to navigate to next
  console.log('Navigating with ArrowRight...');
  await page.keyboard.press('ArrowRight');
  await new Promise(r => setTimeout(r, 600));

  const nextInfo = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"]');
    return modal ? modal.getAttribute('aria-label') : null;
  });
  console.log('Next project in lightbox:', nextInfo);

  // Press ArrowLeft to navigate back
  console.log('Navigating back with ArrowLeft...');
  await page.keyboard.press('ArrowLeft');
  await new Promise(r => setTimeout(r, 600));

  const prevInfo = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"]');
    return modal ? modal.getAttribute('aria-label') : null;
  });
  console.log('Back to project in lightbox:', prevInfo);

  // Press Escape to close
  console.log('Pressing Escape...');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  const closed = await page.evaluate(() => !document.querySelector('[role="dialog"]'));
  console.log('Lightbox closed cleanly with Esc?', closed);

  await browser.close();
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
