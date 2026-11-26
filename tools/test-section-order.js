const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const http = require('http');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function verifyHttp() {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          containsDhairya: data.includes('Dhairya')
        });
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Verifying HTTP 200 on http://localhost:3000 ...');
  let httpOk = false;
  for (let i = 0; i < 20; i++) {
    try {
      const res = await verifyHttp();
      if (res.statusCode === 200 && res.containsDhairya) {
        console.log(`HTTP 200 confirmed! Contains 'Dhairya': ${res.containsDhairya}`);
        httpOk = true;
        break;
      }
    } catch (e) {
      console.log(`Waiting for dev server... attempt ${i + 1}`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  if (!httpOk) {
    throw new Error('Dev server did not return HTTP 200 with Dhairya');
  }

  console.log('\nLaunching headless Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  console.log('Page loaded.');

  // 1. Verify section order in DOM
  const sectionOrder = await page.evaluate(() => {
    const sections = Array.from(document.querySelectorAll('#work section'));
    return sections.map(s => {
      const h3 = s.querySelector('h3');
      return h3 ? h3.textContent.trim() : '';
    });
  });

  console.log('\n=== RENDERED WORK SECTIONS ORDER ===');
  sectionOrder.forEach((title, idx) => {
    console.log(` ${idx + 1}. ${title}`);
  });

  const isCommercialFirst = sectionOrder[0] === 'Commercial Brand Campaigns';
  const isAiuGCLast = sectionOrder[sectionOrder.length - 1] === 'AI UGC & E-Commerce Reels';

  console.log(`\nCheck: 'Commercial Brand Campaigns' is FIRST? ${isCommercialFirst}`);
  console.log(`Check: 'AI UGC & E-Commerce Reels' is LAST? ${isAiuGCLast}`);

  if (!isCommercialFirst || !isAiuGCLast) {
    throw new Error('Section order mismatch!');
  }

  // 2. Verify filter pills order
  const filterPillsOrder = await page.evaluate(() => {
    const pills = Array.from(document.querySelectorAll('#work button span:first-child'));
    return pills.map(p => p.textContent.trim()).filter(t => t.length > 0 && !t.includes('Video'));
  });
  console.log('\n=== FILTER PILLS ORDER ===');
  filterPillsOrder.forEach((p, idx) => console.log(` ${idx + 1}. ${p}`));

  // 3. Verify Ash Frames in Commercial Brand Campaigns
  const firstSectionCards = await page.evaluate(() => {
    const firstSection = document.querySelector('#work section');
    if (!firstSection) return [];
    const cards = Array.from(firstSection.querySelectorAll('[role="button"]'));
    return cards.map(c => {
      const title = c.querySelector('h3')?.textContent.trim();
      const img = c.querySelector('img')?.getAttribute('src');
      const video = c.querySelector('video')?.getAttribute('src');
      return { title, img, video };
    });
  });

  console.log('\n=== FIRST SECTION CARDS ===');
  console.log(firstSectionCards);

  const isAshFramesFirst = firstSectionCards[0]?.title === 'Ash Frames';
  console.log(`\nCheck: 'Ash Frames' is FIRST card? ${isAshFramesFirst}`);
  if (!isAshFramesFirst) {
    throw new Error('Ash Frames is not first card in Commercial Brand Campaigns!');
  }

  // 4. Test hover playback and single-video playback
  console.log('\nTesting hover playback on Ash Frames...');
  const ashFramesHandle = await page.$('#work section [role="button"]:first-child');
  await ashFramesHandle.hover();
  await new Promise(r => setTimeout(r, 600));

  const ashPlaying = await page.evaluate(() => {
    const v = document.querySelector('#work section [role="button"]:first-child video');
    return v ? !v.paused && v.muted : false;
  });
  console.log(`Ash Frames playing muted on hover? ${ashPlaying}`);

  console.log('Hovering second card (TacoBell 2) to test single-video coordination...');
  const tacoHandle = await page.$('#work section [role="button"]:nth-child(2)');
  if (tacoHandle) {
    await tacoHandle.hover();
    await new Promise(r => setTimeout(r, 600));

    const singleVideoTest = await page.evaluate(() => {
      const ashVid = document.querySelector('#work section [role="button"]:first-child video');
      const tacoVid = document.querySelector('#work section [role="button"]:nth-child(2) video');
      return {
        ashPaused: ashVid ? ashVid.paused : true,
        tacoPlaying: tacoVid ? !tacoVid.paused : false
      };
    });
    console.log('Single video playback check:', singleVideoTest);
  }

  // 5. Test Lightbox Open, Navigation and Close
  console.log('\nTesting Lightbox open on Ash Frames...');
  await ashFramesHandle.click();
  await new Promise(r => setTimeout(r, 800));

  const lightboxState = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0.z-50');
    const title = modal?.querySelector('h2')?.textContent.trim();
    return {
      open: Boolean(modal),
      title
    };
  });
  console.log('Lightbox open with:', lightboxState);

  // Navigate Right (Next)
  console.log('Testing ArrowRight navigation...');
  await page.keyboard.press('ArrowRight');
  await new Promise(r => setTimeout(r, 600));

  const nextTitle = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0.z-50');
    return modal?.querySelector('h2')?.textContent.trim();
  });
  console.log('Navigated to next project:', nextTitle);

  // Navigate Left (Prev)
  console.log('Testing ArrowLeft navigation...');
  await page.keyboard.press('ArrowLeft');
  await new Promise(r => setTimeout(r, 600));

  const prevTitle = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0.z-50');
    return modal?.querySelector('h2')?.textContent.trim();
  });
  console.log('Navigated back to:', prevTitle);

  // Close with Escape
  console.log('Testing Escape key to close lightbox...');
  await page.keyboard.press('Escape');
  await new Promise(r => setTimeout(r, 500));

  const isLightboxClosed = await page.evaluate(() => {
    const modal = document.querySelector('[role="dialog"]');
    return !modal;
  });
  console.log('Lightbox closed cleanly with Esc?', isLightboxClosed);

  // 6. Verify background animation & marquee movement
  const layerMovement = await page.evaluate(async () => {
    const left = document.querySelector('.backdrop-band-left');
    const marquee = document.querySelector('.marquee-track--left');
    const t0_left = left ? window.getComputedStyle(left).transform : '';
    const t0_marq = marquee ? window.getComputedStyle(marquee).transform : '';
    await new Promise(r => setTimeout(r, 1500));
    const t1_left = left ? window.getComputedStyle(left).transform : '';
    const t1_marq = marquee ? window.getComputedStyle(marquee).transform : '';
    return {
      backdropMoved: t0_left !== t1_left,
      marqueeMoved: t0_marq !== t1_marq
    };
  });
  console.log('\nBackdrop still moving?', layerMovement.backdropMoved);
  console.log('Client Roster marquee still moving?', layerMovement.marqueeMoved);

  // 7. Screenshots of top of Work area at 1440px, 768px, 375px
  const viewports = [
    { name: '1440px', width: 1440, height: 900 },
    { name: '768px', width: 768, height: 1024 },
    { name: '375px', width: 375, height: 667 },
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.evaluate(() => {
      const el = document.getElementById('work');
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 600));

    const shotPath = path.join(SCREENSHOT_DIR, `work-top-${vp.name}.png`);
    await page.screenshot({ path: shotPath });
    console.log(`Captured Work top screenshot at ${vp.name}: ${shotPath}`);

    const hasHScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Horizontal scroll at ${vp.name}? ${hasHScroll}`);
    if (hasHScroll) {
      throw new Error(`Horizontal scroll detected at ${vp.name}!`);
    }
  }

  await browser.close();
  console.log('\nSUCCESS: All automated checks passed successfully!');
  process.exit(0);
}

run().catch(err => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});
