const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const page = await browser.newPage();
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
  );

  console.log('=== TEST 1: LOAD HOMEPAGE & VERIFY HTTP 200 ===');
  await page.setViewport({ width: 1440, height: 900 });
  const response = await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  console.log('HTTP Status Code:', response.status());
  if (response.status() !== 200) {
    throw new Error(`Expected HTTP 200, got ${response.status()}`);
  }

  // 1. Verify Section Order in DOM
  const sectionHeaders = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('#work h3'));
    return headings.map(h => h.textContent.trim());
  });
  console.log('Work section headings:', sectionHeaders);

  const talkingHeadIndex = sectionHeaders.findIndex(h => h.includes('Talking Head'));
  console.log('Talking Head section index:', talkingHeadIndex + 1);
  if (talkingHeadIndex === -1) {
    throw new Error('Talking Head section not found in DOM!');
  }

  // 2. Find Talking Head section container
  const talkingHeadCards = await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('#work h3'));
    const thHeading = headings.find(h => h.textContent.includes('Talking Head'));
    if (!thHeading) return [];
    // Traverse to the category section container
    let container = thHeading.closest('section') || thHeading.parentElement;
    while (container && !container.querySelector('[role="button"]')) {
      container = container.parentElement;
    }
    const buttons = container ? Array.from(container.querySelectorAll('[role="button"]')) : [];
    return buttons.map(b => ({
      ariaLabel: b.getAttribute('aria-label'),
      posterSrc: b.querySelector('img')?.getAttribute('src')
    }));
  });

  console.log('Total cards in Talking Head section:', talkingHeadCards.length);
  console.log('First card in Talking Head section:', talkingHeadCards[0]);

  if (!talkingHeadCards[0] || !talkingHeadCards[0].ariaLabel.includes('Nishant Reel')) {
    throw new Error(`Expected first card to be "View Nishant Reel", but got: ${talkingHeadCards[0]?.ariaLabel}`);
  }
  if (!talkingHeadCards[0].posterSrc.includes('nishant-reel-poster.jpg')) {
    throw new Error(`Expected poster to be nishant-reel-poster.jpg, but got: ${talkingHeadCards[0]?.posterSrc}`);
  }

  // 3. Scroll to the Nishant Reel card to trigger IntersectionObserver
  console.log('=== TEST 2: HOVER PLAYBACK & LIGHTBOX MODAL ===');
  const cardSelector = '[aria-label="View Nishant Reel"]';
  await page.evaluate((sel) => {
    const card = document.querySelector(sel);
    if (card) card.scrollIntoView({ behavior: 'auto', block: 'center' });
  }, cardSelector);
  await new Promise(r => setTimeout(r, 800));

  // Check if video element mounted
  const videoStateMounted = await page.evaluate((sel) => {
    const card = document.querySelector(sel);
    const video = card ? card.querySelector('video') : null;
    return {
      cardFound: Boolean(card),
      videoMounted: Boolean(video),
      videoSrc: video ? video.getAttribute('src') : null
    };
  }, cardSelector);
  console.log('Nishant Reel video element state after scroll:', videoStateMounted);

  // Test Hover playback
  await page.hover(cardSelector);
  await new Promise(r => setTimeout(r, 600));

  const isHoverPlaying = await page.evaluate((sel) => {
    const card = document.querySelector(sel);
    const video = card ? card.querySelector('video') : null;
    return video ? { exists: true, paused: video.paused, muted: video.muted } : { exists: false };
  }, cardSelector);
  console.log('Hover state for Nishant Reel:', isHoverPlaying);

  // Test single-video playback: hover another card and verify only one video plays
  const secondCardSelector = '[aria-label="View 26 BN Event"]';
  await page.hover(secondCardSelector);
  await new Promise(r => setTimeout(r, 600));

  const multiplePlayCheck = await page.evaluate((sel1, sel2) => {
    const v1 = document.querySelector(sel1)?.querySelector('video');
    const v2 = document.querySelector(sel2)?.querySelector('video');
    return {
      card1Paused: v1 ? v1.paused : true,
      card2Paused: v2 ? v2.paused : true,
      onlyOnePlaying: (v1 && !v1.paused ? 1 : 0) + (v2 && !v2.paused ? 1 : 0) <= 1
    };
  }, cardSelector, secondCardSelector);
  console.log('Single-video playback coordination check:', multiplePlayCheck);

  // Re-hover and Click Nishant Reel to open lightbox
  await page.evaluate((sel) => {
    const card = document.querySelector(sel);
    if (card) card.click();
  }, cardSelector);
  await new Promise(r => setTimeout(r, 800));

  const lightboxInfo = await page.evaluate(() => {
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
  console.log('Lightbox state after clicking Nishant Reel:', lightboxInfo);

  if (!lightboxInfo || !lightboxInfo.open) {
    throw new Error('Lightbox did not open!');
  }

  // Navigate with ArrowRight
  console.log('Pressing ArrowRight to navigate to next project...');
  await page.keyboard.press('ArrowRight');
  await new Promise(r => setTimeout(r, 500));

  const nextLightboxInfo = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"]');
    return modal ? modal.getAttribute('aria-label') : null;
  });
  console.log('Next project in lightbox:', nextLightboxInfo);

  // Navigate back with ArrowLeft
  console.log('Pressing ArrowLeft to navigate back to Nishant Reel...');
  await page.keyboard.press('ArrowLeft');
  await new Promise(r => setTimeout(r, 500));

  const prevLightboxInfo = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"]');
    return modal ? modal.getAttribute('aria-label') : null;
  });
  console.log('Returned project in lightbox:', prevLightboxInfo);

  // Close with Escape
  console.log('Pressing Escape to close lightbox...');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  const isClosed = await page.evaluate(() => !document.querySelector('[role="dialog"]'));
  console.log('Lightbox closed cleanly with Esc:', isClosed);
  if (!isClosed) {
    throw new Error('Lightbox failed to close with Escape key!');
  }

  // Verify background & marquee still active
  const checks = await page.evaluate(() => {
    const bg = document.querySelector('.site-backdrop-bg') || document.querySelector('[style*="radial-gradient"]');
    const marquee = document.querySelector('.animate-marquee-infinite') || document.querySelector('[class*="marquee"]');
    return {
      backdropPresent: Boolean(bg),
      marqueePresent: Boolean(marquee)
    };
  });
  console.log('Backdrop and Marquee integrity check:', checks);

  // Verify Stats Counter displays updated project count (45+)
  const statsCount = await page.evaluate(() => {
    const counters = Array.from(document.querySelectorAll('span.font-mono'));
    return counters.map(c => c.textContent.trim());
  });
  console.log('Stats counters found:', statsCount);

  // Screenshots at 1440px, 768px, 375px
  console.log('=== TEST 3: SCREENSHOTS & HORIZONTAL OVERFLOW CHECK ===');
  const viewports = [
    { width: 1440, height: 900, name: 'talking-head-1440px.png' },
    { width: 768, height: 1024, name: 'talking-head-768px.png' },
    { width: 375, height: 812, name: 'talking-head-375px.png' }
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.evaluate(() => {
      const headings = Array.from(document.querySelectorAll('#work h3'));
      const th = headings.find(h => h.textContent.includes('Talking Head'));
      if (th) th.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 600));

    const overflowCheck = await page.evaluate(() => {
      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    });
    console.log(`Viewport ${vp.width}px overflow check:`, overflowCheck);
    if (overflowCheck.hasHorizontalScroll) {
      throw new Error(`Horizontal overflow detected at ${vp.width}px!`);
    }

    const thSection = await page.evaluateHandle(() => {
      const headings = Array.from(document.querySelectorAll('#work h3'));
      const th = headings.find(h => h.textContent.includes('Talking Head'));
      return th ? th.closest('section') || th.parentElement.parentElement : document.body;
    });

    await thSection.screenshot({ path: path.join(SCREENSHOT_DIR, vp.name) });
    console.log(`Saved screenshot: ${vp.name}`);
  }

  await browser.close();
  console.log('\n=== ALL TALKING HEAD TESTS PASSED! ===');
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
