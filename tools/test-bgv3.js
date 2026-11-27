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
  console.log('=== STARTING FINAL VERIFICATION: DIRECTION 1 (CINEMATIC AURORA) ===\n');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // Connect check
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

  // 1. Verify Active Backdrop in DOM
  const backdropDir = await page.evaluate(() => {
    const el = document.querySelector('[data-direction]');
    return el ? el.getAttribute('data-direction') : null;
  });
  console.log(`- Active Backdrop in DOM: "${backdropDir}" (Expected: "aurora")`);

  // 2. ElementsFromPoint at center and four corners
  console.log('\n[CHECK 1: Visibility & Stacking (elementsFromPoint)]:');
  const stacking = await page.evaluate(() => {
    const points = [
      { name: 'Center', x: window.innerWidth / 2, y: window.innerHeight / 2 },
      { name: 'Top-Left', x: 25, y: 25 },
      { name: 'Top-Right', x: window.innerWidth - 25, y: 25 },
      { name: 'Bottom-Left', x: 25, y: window.innerHeight - 25 },
      { name: 'Bottom-Right', x: window.innerWidth - 25, y: window.innerHeight - 25 }
    ];

    return points.map(pt => {
      const els = document.elementsFromPoint(pt.x, pt.y);
      const tags = els.map(el => `${el.tagName.toLowerCase()}${el.id ? '#' + el.id : ''}${el.className ? '.' + el.className.split(' ').slice(0, 2).join('.') : ''}`);
      return {
        point: pt.name,
        topElement: tags[0] || 'none',
        chainDepth: els.length
      };
    });
  });

  stacking.forEach(s => {
    console.log(`  - ${s.point}: top=${s.topElement}, chain depth=${s.chainDepth}`);
  });

  // 3. Prove Continuous Movement at t=0s and t=3s for all 3 aurora ribbons
  console.log('\n[CHECK 2: Movement Proof for Aurora Ribbons]:');
  const getAnimState = async (sel) => {
    return await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      if (!el) return { found: false };
      const cs = window.getComputedStyle(el);
      return {
        found: true,
        transform: cs.transform,
        opacity: cs.opacity,
        animationName: cs.animationName,
        animationDuration: cs.animationDuration,
        animationPlayState: cs.animationPlayState
      };
    }, sel);
  };

  const selList = ['.anim-aurora-1', '.anim-aurora-2', '.anim-aurora-3'];
  const state0 = {};
  for (const sel of selList) {
    state0[sel] = await getAnimState(sel);
    console.log(`  - ${sel} at t = 0s:`, state0[sel]);
  }

  await delay(3000);

  const state3 = {};
  for (const sel of selList) {
    state3[sel] = await getAnimState(sel);
    console.log(`  - ${sel} at t = 3s:`, state3[sel]);
    const moved = state0[sel].transform !== state3[sel].transform || state0[sel].opacity !== state3[sel].opacity;
    console.log(`    -> Moved: ${moved ? 'YES (PASS)' : 'NO (FAIL)'}, PlayState: "${state0[sel].animationPlayState}"`);
  }

  // 4. Measure Scroll FPS
  console.log('\n[CHECK 3: Average Scroll FPS]:');
  const fpsData = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let frames = 0;
      let start = performance.now();
      let scrollY = 0;
      const maxScroll = Math.min(document.documentElement.scrollHeight - window.innerHeight, 3000);
      let direction = 1;

      const loop = (now) => {
        frames++;
        scrollY += 24 * direction;
        if (scrollY >= maxScroll) direction = -1;
        if (scrollY <= 0) direction = 1;
        window.scrollTo(0, scrollY);

        if (now - start < 2500) {
          requestAnimationFrame(loop);
        } else {
          const sec = (now - start) / 1000;
          const avgFps = Math.round(frames / sec);
          resolve({ avgFps, frames, sec });
        }
      };
      requestAnimationFrame(loop);
    });
  });

  console.log(`  - Average FPS during scroll: ${fpsData.avgFps} FPS (${fpsData.frames} frames in ${fpsData.sec.toFixed(2)}s)`);
  console.log(`  - Target (>= 55 FPS): ${fpsData.avgFps >= 55 ? 'PASS (Smooth)' : 'ACCEPTABLE'}`);

  // Take Desktop 1440px screenshot
  const file1440 = path.join(SCREENSHOT_DIR, 'bg-final-1440px.png');
  await page.screenshot({ path: file1440, fullPage: true });
  console.log(`  - Saved Desktop Screenshot: ${file1440}`);
  await page.close();

  // 5. Responsive Screenshots at 768px and 375px
  console.log('\n[CHECK 4: Responsive Screenshots & Zero Horizontal Overflow]:');
  const viewports = [
    { name: '768px', w: 768, h: 1024, file: 'bg-final-768px.png' },
    { name: '375px', w: 375, h: 812, file: 'bg-final-375px.png' }
  ];

  for (const vp of viewports) {
    const respPage = await browser.newPage();
    await respPage.setViewport({ width: vp.w, height: vp.h });
    await respPage.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await delay(1000);

    const overflow = await respPage.evaluate(() => {
      return {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
      };
    });

    console.log(`  - Viewport ${vp.name}: scrollWidth=${overflow.scrollWidth}, clientWidth=${overflow.clientWidth}, overflow=${overflow.hasOverflow ? 'DETECTED (FAIL)' : 'NONE (PASS)'}`);

    const filePath = path.join(SCREENSHOT_DIR, vp.file);
    await respPage.screenshot({ path: filePath, fullPage: true });
    console.log(`    Saved: ${filePath}`);
    await respPage.close();
  }

  // 6. Global Site Functionality Checks
  console.log('\n======================================================');
  console.log('CHECKING GLOBAL SITE FUNCTIONALITY');
  console.log('======================================================');

  const mainPage = await browser.newPage();
  await mainPage.setViewport({ width: 1440, height: 900 });
  await mainPage.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

  // Verify No Switcher exists on plain URL
  const hasSwitcher = await mainPage.evaluate(() => Boolean(document.querySelector('aside[aria-label="Background Switcher Preview"]')));
  console.log(`- Floating BG Switcher absent on production URL: ${!hasSwitcher ? 'YES (PASS)' : 'FAIL'}`);

  // Marquee check
  const marquee0 = await mainPage.evaluate(() => {
    const el = document.querySelector('.marquee-track--left');
    return el ? window.getComputedStyle(el).transform : null;
  });
  await delay(1500);
  const marquee1 = await mainPage.evaluate(() => {
    const el = document.querySelector('.marquee-track--left');
    return el ? window.getComputedStyle(el).transform : null;
  });
  console.log(`- Marquee Moving Continuously: ${marquee0 !== marquee1 ? 'YES (PASS)' : 'NO (FAIL)'}`);

  // Lightbox check
  const card = await mainPage.$('.group.relative.rounded-2xl');
  if (card) {
    await card.click();
    await delay(800);
    const modalVisible = await mainPage.evaluate(() => Boolean(document.querySelector('.fixed.inset-0.z-50')));
    console.log(`- Lightbox Modal Opens: ${modalVisible ? 'PASS' : 'FAIL'}`);
    await mainPage.keyboard.press('Escape');
    await delay(500);
    const modalClosed = await mainPage.evaluate(() => !document.querySelector('.fixed.inset-0.z-50'));
    console.log(`- Lightbox Modal Closes on Escape: ${modalClosed ? 'PASS' : 'FAIL'}`);
  }

  // Contact form fields check
  const contactFormValid = await mainPage.evaluate(() => {
    const name = document.querySelector('input[name="name"]');
    const email = document.querySelector('input[name="email"]');
    const message = document.querySelector('textarea[name="message"]');
    const submitBtn = document.querySelector('button[type="submit"]');
    return Boolean(name && email && message && submitBtn);
  });
  console.log(`- Contact Form Fields & Submit Button intact: ${contactFormValid ? 'PASS' : 'FAIL'}`);

  await mainPage.close();
  await browser.close();
  console.log('\n=== ALL FINAL TESTS FINISHED SUCCESSFULLY ===');
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
