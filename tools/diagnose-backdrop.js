const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  console.log('=== STARTING BROWSER DIAGNOSIS ===');
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

  console.log('Connected to http://localhost:3000 successfully.\n');

  // 1. elementsFromPoint at center and 4 corners
  const points = [
    { name: 'Center', x: 720, y: 450 },
    { name: 'Top-Left (10, 10)', x: 10, y: 10 },
    { name: 'Top-Right (1430, 10)', x: 1430, y: 10 },
    { name: 'Bottom-Left (10, 890)', x: 10, y: 890 },
    { name: 'Bottom-Right (1430, 890)', x: 1430, y: 890 }
  ];

  console.log('--- 1. ELEMENTS FROM POINT ---');
  for (const pt of points) {
    const list = await page.evaluate((x, y) => {
      const els = document.elementsFromPoint(x, y) || [];
      return els.map(el => ({
        tag: el.tagName.toLowerCase(),
        id: el.id,
        className: el.className ? (typeof el.className === 'string' ? el.className.slice(0, 80) : '') : ''
      }));
    }, pt.x, pt.y);

    console.log(`\nAt ${pt.name} [${pt.x}, ${pt.y}]: (${list.length} elements)`);
    list.forEach((item, idx) => {
      console.log(`  [${idx}] <${item.tag}${item.id ? '#' + item.id : ''}> class: "${item.className}"`);
    });
  }

  // 2. Ancestor background walk
  console.log('\n--- 2. ANCESTOR BACKGROUND COLOR & STACKING WALK ---');
  const tree = await page.evaluate(() => {
    const results = [];
    function checkEl(el, depth = 0) {
      if (!el || el.nodeType !== 1) return;
      const cs = window.getComputedStyle(el);
      const bg = cs.backgroundColor;
      const bgImg = cs.backgroundImage;
      const pos = cs.position;
      const zIndex = cs.zIndex;
      const opacity = cs.opacity;

      // Extract alpha
      let alpha = 1;
      const rgbaMatch = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
      if (rgbaMatch) {
        alpha = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;
      } else if (bg === 'transparent') {
        alpha = 0;
      }

      const isOpaque = alpha > 0.3 && bg !== 'rgba(0, 0, 0, 0)';

      results.push({
        tag: el.tagName.toLowerCase(),
        id: el.id,
        className: (el.className && typeof el.className === 'string') ? el.className.slice(0, 60) : '',
        depth,
        bgColor: bg,
        bgImage: bgImg !== 'none' ? bgImg.slice(0, 40) + '...' : 'none',
        pos,
        zIndex,
        opacity,
        alpha,
        isOpaque
      });

      // Recurse on children up to 3 levels
      if (depth < 3) {
        for (const child of el.children) {
          checkEl(child, depth + 1);
        }
      }
    }

    checkEl(document.documentElement, 0);
    return results;
  });

  tree.forEach(item => {
    const indent = '  '.repeat(item.depth);
    const flag = item.isOpaque ? ' [OPAQUE!]' : '';
    console.log(`${indent}<${item.tag}${item.id ? '#' + item.id : ''}> z-index:${item.zIndex} pos:${item.pos} bg:${item.bgColor} opacity:${item.opacity}${flag}`);
  });

  // 3. Computed styles of backdrop wrapper
  console.log('\n--- 3. BACKDROP WRAPPER COMPUTED STYLES ---');
  const backdropStyles = await page.evaluate(() => {
    const el = document.querySelector('[data-backdrop-mode], .backdrop-stage, [class*="Backdrop"], div[class*="-z-10"]');
    if (!el) return { found: false };
    const cs = window.getComputedStyle(el);
    return {
      found: true,
      tagName: el.tagName,
      className: el.className,
      dataMode: el.getAttribute('data-backdrop-mode'),
      display: cs.display,
      position: cs.position,
      zIndex: cs.zIndex,
      width: cs.width,
      height: cs.height,
      opacity: cs.opacity,
      visibility: cs.visibility,
      clip: cs.clip,
      overflow: cs.overflow,
      rect: {
        width: el.getBoundingClientRect().width,
        height: el.getBoundingClientRect().height,
        top: el.getBoundingClientRect().top,
        left: el.getBoundingClientRect().left
      }
    };
  });
  console.log(JSON.stringify(backdropStyles, null, 2));

  // Check children inside backdrop
  console.log('\n--- 4. CHILDREN INSIDE BACKDROP WRAPPER ---');
  const backdropChildren = await page.evaluate(() => {
    const el = document.querySelector('[data-backdrop-mode]');
    if (!el) return 'No element with [data-backdrop-mode]';
    return Array.from(el.querySelectorAll('*')).map(c => ({
      tag: c.tagName,
      className: c.className,
      rect: {
        width: c.getBoundingClientRect().width,
        height: c.getBoundingClientRect().height,
        top: c.getBoundingClientRect().top,
        left: c.getBoundingClientRect().left
      },
      opacity: window.getComputedStyle(c).opacity,
      display: window.getComputedStyle(c).display,
      visibility: window.getComputedStyle(c).visibility
    })).slice(0, 15);
  });
  console.log(JSON.stringify(backdropChildren, null, 2));

  await browser.close();
  console.log('\n=== DIAGNOSIS COMPLETE ===');
}

run().catch((err) => {
  console.error('Diagnosis failed:', err);
  process.exit(1);
});
