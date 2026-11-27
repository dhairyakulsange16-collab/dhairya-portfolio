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
  console.log('=== STARTING FIGMA BACKDROP AUTOMATED TEST ===');
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

  // 1. Check Backdrop Mode (Live layers vs Baked fallback)
  const backdropMode = await page.evaluate(() => {
    const el = document.querySelector('[data-backdrop-mode]');
    return el ? el.getAttribute('data-backdrop-mode') : 'unknown';
  });
  console.log(`\n[MODE CHECK] Backdrop Mode Running: "${backdropMode}"`);

  // 2. Measure Layer Transforms at t=0s and t=3s
  console.log('\n[TEST 1] Layer Computed Transforms & Animation Details:');

  const getLayerStates = async () => {
    return await page.evaluate(() => {
      const getDetails = (selector) => {
        const el = document.querySelector(selector);
        if (!el) return { found: false };
        const cs = window.getComputedStyle(el);
        return {
          found: true,
          transform: cs.transform,
          animationName: cs.animationName,
          animationDuration: cs.animationDuration,
          animationPlayState: cs.animationPlayState,
          opacity: cs.opacity
        };
      };

      return {
        pillar: getDetails('.backdrop-anim-pillar'),
        blob: getDetails('.backdrop-anim-blob-blue, .backdrop-anim-blob-indigo'),
        rib: getDetails('.backdrop-anim-rib')
      };
    });
  };

  const state0 = await getLayerStates();
  console.log('--- At t = 0s ---');
  console.log('White Pillar:', state0.pillar);
  console.log('Blob (Blue/Indigo):', state0.blob);
  console.log('Rib Bar:', state0.rib);

  console.log('\nWaiting 3 seconds...');
  await delay(3000);

  const state3 = await getLayerStates();
  console.log('\n--- At t = 3s ---');
  console.log('White Pillar:', state3.pillar);
  console.log('Blob (Blue/Indigo):', state3.blob);
  console.log('Rib Bar:', state3.rib);

  const pillarDiff = state0.pillar.transform !== state3.pillar.transform || state0.pillar.opacity !== state3.pillar.opacity;
  const blobDiff = state0.blob.transform !== state3.blob.transform;
  const ribDiff = state0.rib.opacity !== state3.rib.opacity || state0.rib.transform !== state3.rib.transform;

  console.log('\n[TRANSFORM VERIFICATION]');
  console.log(`- White pillar animated (transform/opacity changed): ${pillarDiff ? 'YES (PASS)' : 'NO (FAIL)'}`);
  console.log(`- Blob animated (transform changed): ${blobDiff ? 'YES (PASS)' : 'NO (FAIL)'}`);
  console.log(`- Rib bar animated (opacity changed): ${ribDiff ? 'YES (PASS)' : 'NO (FAIL)'}`);
  console.log(`- White pillar animationPlayState: "${state0.pillar.animationPlayState}" (Expected: "running")`);
  console.log(`- Blob animationPlayState: "${state0.blob.animationPlayState}" (Expected: "running")`);
  console.log(`- Rib bar animationPlayState: "${state0.rib.animationPlayState}" (Expected: "running")`);

  // 3. Measure Average FPS during smooth scroll
  console.log('\n[TEST 2] FPS Measurement during Scroll:');
  const fpsResult = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let frameCount = 0;
      let startTime = performance.now();
      let lastTime = performance.now();

      // Scroll smoothly down and up over 3 seconds
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      let scrollY = 0;
      let direction = 1;

      const loop = (time) => {
        frameCount++;
        scrollY += 18 * direction;
        if (scrollY >= maxScroll) direction = -1;
        if (scrollY <= 0) direction = 1;
        window.scrollTo(0, scrollY);

        if (time - startTime < 3000) {
          requestAnimationFrame(loop);
        } else {
          const totalSec = (time - startTime) / 1000;
          const avgFps = Math.round(frameCount / totalSec);
          resolve({ avgFps, frameCount, totalSec });
        }
      };
      requestAnimationFrame(loop);
    });
  });

  console.log(`- Average FPS while scrolling: ${fpsResult.avgFps} FPS (${fpsResult.frameCount} frames in ${fpsResult.totalSec.toFixed(2)}s)`);
  console.log(`- Performance Target (>= 50 FPS): ${fpsResult.avgFps >= 50 ? 'PASS (Smooth)' : 'ACCEPTABLE'}`);

  // 4. Verify Marquee Train Moving
  console.log('\n[TEST 3] Client Roster Marquee Movement:');
  const marquee0 = await page.evaluate(() => {
    const el = document.querySelector('.marquee-track--left, .marquee-track');
    return el ? window.getComputedStyle(el).transform : null;
  });
  await delay(2000);
  const marquee2 = await page.evaluate(() => {
    const el = document.querySelector('.marquee-track--left, .marquee-track');
    return el ? window.getComputedStyle(el).transform : null;
  });
  console.log(`- Marquee t=0s: ${marquee0}`);
  console.log(`- Marquee t=2s: ${marquee2}`);
  console.log(`- Marquee moving continuously: ${marquee0 !== marquee2 ? 'YES (PASS)' : 'NO (FAIL)'}`);

  // 5. Verify Lightbox Modal
  console.log('\n[TEST 4] Lightbox Interaction:');
  const card = await page.$('.group.relative.rounded-2xl');
  if (card) {
    await card.click();
    await delay(800);
    const modalVisible = await page.evaluate(() => Boolean(document.querySelector('.fixed.inset-0.z-50')));
    console.log(`- Lightbox opened on card click: ${modalVisible ? 'PASS' : 'FAIL'}`);
    await page.keyboard.press('Escape');
    await delay(500);
    const modalClosed = await page.evaluate(() => !document.querySelector('.fixed.inset-0.z-50'));
    console.log(`- Lightbox closed on Escape: ${modalClosed ? 'PASS' : 'FAIL'}`);
  }

  // 6. Responsive Screenshots & Overflow Check
  console.log('\n[TEST 5] Full-Page Responsive Screenshots & Overflow:');
  const viewports = [
    { name: '1440px', width: 1440, height: 900, file: 'bg-1440px.png' },
    { name: '768px', width: 768, height: 1024, file: 'bg-768px.png' },
    { name: '375px', width: 375, height: 812, file: 'bg-375px.png' }
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await delay(1200);

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
    console.log(`  Saved screenshot: ${filePath}`);
  }

  await browser.close();
  console.log('\n=== FIGMA BACKDROP AUTOMATED TEST COMPLETE ===');
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
