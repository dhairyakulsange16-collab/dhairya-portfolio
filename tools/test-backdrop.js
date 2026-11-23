const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function run() {
  console.log('Connecting to headless Chrome...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Retry connecting to dev server
  let connected = false;
  for (let i = 0; i < 15; i++) {
    try {
      await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 10000 });
      connected = true;
      break;
    } catch (e) {
      console.log(`Waiting for dev server... attempt ${i + 1} (${e.message})`);
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  if (!connected) {
    throw new Error('Could not connect to http://localhost:3000');
  }

  console.log('Page loaded successfully.');

  // 1. Read computed styles & transforms of left band, right band, and arc at T0
  await page.setViewport({ width: 1440, height: 900 });

  const getLayerStates = async () => {
    return await page.evaluate(() => {
      const left = document.querySelector('.backdrop-band-left');
      const right = document.querySelector('.backdrop-band-right');
      const arc = document.querySelector('.backdrop-arc');
      const sheen = document.querySelector('.backdrop-sheen');
      const grain = document.querySelector('.backdrop-grain');

      const getInfo = (el) => {
        if (!el) return null;
        const comp = window.getComputedStyle(el);
        return {
          animationName: comp.animationName,
          animationDuration: comp.animationDuration,
          animationPlayState: comp.animationPlayState,
          transform: comp.transform
        };
      };

      return {
        left: getInfo(left),
        right: getInfo(right),
        arc: getInfo(arc),
        sheen: getInfo(sheen),
        grain: getInfo(grain)
      };
    });
  };

  const stateT0 = await getLayerStates();
  console.log('\n=== LAYER STATES AT T0 ===');
  console.log('Left Band:', stateT0.left);
  console.log('Right Band:', stateT0.right);
  console.log('Planetary Arc:', stateT0.arc);
  console.log('Glossy Sheen:', stateT0.sheen);
  console.log('Film Grain:', stateT0.grain);

  console.log('\nWaiting 3000ms to observe transform progression...');
  await new Promise(r => setTimeout(r, 3000));

  const stateT3 = await getLayerStates();
  console.log('\n=== LAYER STATES AT T0 + 3s ===');
  console.log('Left Band:', stateT3.left);
  console.log('Right Band:', stateT3.right);
  console.log('Planetary Arc:', stateT3.arc);
  console.log('Glossy Sheen:', stateT3.sheen);

  const leftMoved = stateT0.left.transform !== stateT3.left.transform;
  const rightMoved = stateT0.right.transform !== stateT3.right.transform;
  const arcMoved = stateT0.arc.transform !== stateT3.arc.transform;

  console.log('\n=== TRANSFORM PROGRESSION PROOF ===');
  console.log(`Left Band moving?  ${leftMoved} (T0: "${stateT0.left.transform}" vs T3: "${stateT3.left.transform}")`);
  console.log(`Right Band moving? ${rightMoved} (T0: "${stateT0.right.transform}" vs T3: "${stateT3.right.transform}")`);
  console.log(`Arc moving?        ${arcMoved} (T0: "${stateT0.arc.transform}" vs T3: "${stateT3.arc.transform}")`);

  // 2. Take screenshots of Hero at 1440px, 768px, 375px
  const viewports = [
    { name: '1440px', width: 1440, height: 900 },
    { name: '768px', width: 768, height: 1024 },
    { name: '375px', width: 375, height: 667 },
  ];

  for (const vp of viewports) {
    await page.setViewport({ width: vp.width, height: vp.height });
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(r => setTimeout(r, 600));

    const shotPath = path.join(SCREENSHOT_DIR, `hero-${vp.name}.png`);
    await page.screenshot({ path: shotPath });
    console.log(`Captured Hero screenshot at ${vp.name}: ${shotPath}`);

    // Check horizontal scroll
    const hasHScroll = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    console.log(`Horizontal scroll at ${vp.name}? ${hasHScroll}`);
  }

  // 3. Scroll to Work, Services, Contact sections and capture screenshots at 1440px
  await page.setViewport({ width: 1440, height: 900 });

  const sections = ['work', 'services', 'contact'];
  for (const sId of sections) {
    await page.evaluate((id) => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'start' });
    }, sId);
    await new Promise(r => setTimeout(r, 600));

    const shotPath = path.join(SCREENSHOT_DIR, `section-${sId}-1440px.png`);
    await page.screenshot({ path: shotPath });
    console.log(`Captured Section "${sId}" screenshot: ${shotPath}`);
  }

  await browser.close();

  if (!leftMoved || !rightMoved || !arcMoved) {
    console.error('FAILED: One or more layers are not moving!');
    process.exit(1);
  } else {
    console.log('\nSUCCESS: All backdrop layers are moving continuously and screenshots saved.');
    process.exit(0);
  }
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
