const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('--- STARTING RESTORE VERIFICATION TEST ---');
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
      await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 10000 });
      connected = true;
      break;
    } catch (e) {
      console.log(`Waiting for server... attempt ${i + 1}`);
      await delay(1000);
    }
  }

  if (!connected) {
    console.error('Failed to connect to http://localhost:3000');
    await browser.close();
    process.exit(1);
  }

  console.log('Connected to http://localhost:3000 successfully.');

  // 1. Verify Background Animation
  console.log('\n[TEST 1] Background Layer Animation:');
  const bgTransform1 = await page.evaluate(() => {
    const el = document.querySelector('.backdrop-band-left, .backdrop-sheen');
    return el ? window.getComputedStyle(el).transform : null;
  });

  await delay(3000);

  const bgTransform2 = await page.evaluate(() => {
    const el = document.querySelector('.backdrop-band-left, .backdrop-sheen');
    return el ? window.getComputedStyle(el).transform : null;
  });

  console.log(`- Background layer transform at t=0s: ${bgTransform1}`);
  console.log(`- Background layer transform at t=3s: ${bgTransform2}`);
  const bgAnimated = bgTransform1 !== bgTransform2;
  console.log(`- Background animation active: ${bgAnimated ? 'YES (PASS)' : 'STATIC OR MATCH (FAIL)'}`);

  // 2. Verify Marquee Train Animation
  console.log('\n[TEST 2] Client Roster Marquee Animation:');
  const marqueeTransform1 = await page.evaluate(() => {
    const el = document.querySelector('.marquee-track--left, .marquee-track');
    return el ? window.getComputedStyle(el).transform : null;
  });

  await delay(3000);

  const marqueeTransform2 = await page.evaluate(() => {
    const el = document.querySelector('.marquee-track--left, .marquee-track');
    return el ? window.getComputedStyle(el).transform : null;
  });

  console.log(`- Marquee transform at t=0s: ${marqueeTransform1}`);
  console.log(`- Marquee transform at t=3s: ${marqueeTransform2}`);
  const marqueeAnimated = marqueeTransform1 !== marqueeTransform2;
  console.log(`- Marquee train moving: ${marqueeAnimated ? 'YES (PASS)' : 'NO (FAIL)'}`);

  // 3. Verify Section Order and Total Project Cards
  console.log('\n[TEST 3] Section Order & Project Counts:');
  const sectionData = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('#work section, .glass-card'));
    return sections.map(sec => {
      const titleEl = sec.querySelector('h3');
      const badgeEl = sec.querySelector('span');
      const cards = sec.querySelectorAll('.group.relative.rounded-2xl');
      return {
        title: titleEl ? titleEl.textContent.trim() : 'Unknown',
        cardsCount: cards.length
      };
    }).filter(s => s.cardsCount > 0);
  });

  console.log('Sections found:', JSON.stringify(sectionData, null, 2));
  const totalCards = sectionData.reduce((sum, s) => sum + s.cardsCount, 0);
  console.log(`Total project cards rendered: ${totalCards} (Expected: 45)`);

  const expectedFirst = 'COMMERCIAL BRAND CAMPAIGNS';
  const expectedLast = 'AI UGC & E-COMMERCE REELS';
  const actualFirst = sectionData[0]?.title.toUpperCase();
  const actualLast = sectionData[sectionData.length - 1]?.title.toUpperCase();

  console.log(`- First section: "${actualFirst}" (Expected: "${expectedFirst}") -> ${actualFirst === expectedFirst ? 'PASS' : 'FAIL'}`);
  console.log(`- Last section: "${actualLast}" (Expected: "${expectedLast}") -> ${actualLast === expectedLast ? 'PASS' : 'FAIL'}`);

  // 4. Verify Ash Frames and Nishant Reel positions
  console.log('\n[TEST 4] Ash Frames & Nishant Reel Positions:');
  const leadVideos = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('#work section'));
    let ashCard = null;
    let nishantCard = null;

    sections.forEach(sec => {
      const title = sec.querySelector('h3')?.textContent.trim() || '';
      const firstCard = sec.querySelector('.group.relative.rounded-2xl h3');
      const firstTitle = firstCard?.textContent.trim() || '';
      if (title.toUpperCase().includes('COMMERCIAL')) {
        ashCard = firstTitle;
      }
      if (title.toUpperCase().includes('TALKING HEAD')) {
        nishantCard = firstTitle;
      }
    });
    return { ashCard, nishantCard };
  });

  console.log(`- First video in Commercial: "${leadVideos.ashCard}" (Matches Ash Frames: ${leadVideos.ashCard?.toLowerCase().includes('ash') ? 'PASS' : 'FAIL'})`);
  console.log(`- First video in Talking Head: "${leadVideos.nishantCard}" (Matches Nishant Reel: ${leadVideos.nishantCard?.toLowerCase().includes('nishant') ? 'PASS' : 'FAIL'})`);

  // 5. Test Lightbox Open/Close
  console.log('\n[TEST 5] Lightbox Modal Interaction:');
  const firstVideoCard = await page.$('.group.relative.rounded-2xl');
  if (firstVideoCard) {
    await firstVideoCard.click();
    await delay(1000);
    const lightboxVisible = await page.evaluate(() => {
      const modal = document.querySelector('.fixed.inset-0.z-50');
      return Boolean(modal);
    });
    console.log(`- Lightbox opened on card click: ${lightboxVisible ? 'PASS' : 'FAIL'}`);

    // Press Escape to close
    await page.keyboard.press('Escape');
    await delay(500);
    const lightboxClosed = await page.evaluate(() => {
      return !document.querySelector('.fixed.inset-0.z-50');
    });
    console.log(`- Lightbox closed on Escape: ${lightboxClosed ? 'PASS' : 'FAIL'}`);
  }

  // 6. Responsive Screenshots and Horizontal Overflow Check
  console.log('\n[TEST 6] Responsive Viewports & Screenshots:');
  const viewports = [
    { name: '1440px', width: 1440, height: 900, file: 'restore-1440px.png' },
    { name: '768px', width: 768, height: 1024, file: 'restore-768px.png' },
    { name: '375px', width: 375, height: 812, file: 'restore-375px.png' }
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await delay(1000);

    const overflow = await page.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    });

    console.log(`- Viewport ${vp.name}: scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}, overflow=${overflow.hasOverflow ? 'DETECTED (FAIL)' : 'NONE (PASS)'}`);

    const filePath = path.join(SCREENSHOT_DIR, vp.file);
    await page.screenshot({ path: filePath, fullPage: true });
    console.log(`  Screenshot saved: ${filePath}`);
  }

  await browser.close();
  console.log('\n--- VERIFICATION TEST COMPLETE ---');
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
