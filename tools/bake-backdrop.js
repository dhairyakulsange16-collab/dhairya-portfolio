const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'backgrounds');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 14 Ribs data
const leftBars = [
  { left: 0, top: 473.61, stop: 71.34 },
  { left: 102.86, top: 407.16, stop: 71.34 },
  { left: 205.71, top: 374.42, stop: 71.34 },
  { left: 308.57, top: 389.83, stop: 71.34 },
  { left: 411.43, top: 427.38, stop: 71.34 },
  { left: 514.29, top: 490.94, stop: 71.34 },
  { left: 617.14, top: 607.46, stop: 61.17 },
];

const rightBars = [
  { left: 1337.14, top: 473.61, stop: 48.62, mirror: true },
  { left: 1234.29, top: 407.16, stop: 42.17, mirror: true },
  { left: 1131.43, top: 374.42, stop: 39, mirror: true },
  { left: 1028.57, top: 389.83, stop: 40.55, mirror: true },
  { left: 925.71, top: 427.38, stop: 43.86, mirror: true },
  { left: 822.86, top: 490.94, stop: 50.16, mirror: true },
  { left: 720, top: 607.46, stop: 61.17, mirror: true },
];

const allBars = [...leftBars, ...rightBars];

function getStageHtml(scale, width, height) {
  const barsHtml = allBars.map((bar, idx) => {
    const transform = bar.mirror ? 'transform: scaleX(-1);' : '';
    return `
      <div style="
        position: absolute;
        width: 102.86px;
        height: 1066.12px;
        left: ${bar.left}px;
        top: ${bar.top}px;
        ${transform}
        background-image: 
          linear-gradient(0deg, #000000 ${bar.stop}%, rgba(255,255,255,0) 100%),
          radial-gradient(298.37% 184.73% at 100% 71.16%, rgba(255,255,255,0) 16%, rgba(0,0,0,0.75) 74%, #000000 100%);
        background-blend-mode: screen;
      "></div>
    `;
  }).join('\n');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        :root {
          --bg-black: #000000;
          --bg-blue: #2388FF;
          --bg-indigo: #4A3AFF;
          --bg-white: rgba(255,255,255,1);
        }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          background: #000000;
          width: ${width}px;
          height: ${height}px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stage {
          position: absolute;
          width: 1440px;
          height: 1024px;
          background: #000000;
          overflow: hidden;
          transform: scale(${scale});
          transform-origin: center center;
        }
        .white-pillar {
          position: absolute;
          width: 947.69px;
          height: 1221.99px;
          left: 50%;
          transform: translateX(-50%);
          top: -49.42px;
          background: linear-gradient(180deg, rgba(255,255,255,0) 1.94%, rgba(255,255,255,0.72) 96.75%);
          mix-blend-mode: plus-lighter;
          filter: blur(137px);
        }
        .blue-blob {
          position: absolute;
          width: 863.13px;
          height: 561.38px;
          left: -182.84px;
          top: 473.61px;
          background: #2388FF;
          filter: blur(200px);
          transform: matrix(-0.97, -0.25, -0.38, 0.93, 0, 0);
        }
        .indigo-blob {
          position: absolute;
          width: 863.13px;
          height: 561.38px;
          left: 576.55px;
          top: 473.61px;
          background: #4A3AFF;
          filter: blur(200px);
          transform: matrix(0.97, -0.25, 0.38, 0.93, 0, 0);
        }
        .center-glow {
          position: absolute;
          width: 915.71px;
          height: 580.02px;
          left: 50%;
          transform: translateX(-50%);
          top: 413.8px;
          background: linear-gradient(180deg, #2388FF 0%, rgba(35,136,255,0) 100%);
          mix-blend-mode: plus-lighter;
          filter: blur(136px);
        }
        .ribs-container {
          position: absolute;
          width: 1440px;
          height: 1024px;
          top: 0;
          left: 0;
          opacity: 0.4;
          mask-image: linear-gradient(to top, #000 0%, transparent 56.13%);
          -webkit-mask-image: linear-gradient(to top, #000 0%, transparent 56.13%);
        }
        .grain {
          position: absolute;
          inset: 0;
          opacity: 0.25;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          background-repeat: repeat;
        }
      </style>
    </head>
    <body>
      <div class="stage">
        <!-- 1. Base #000000 -->
        <!-- 2. White pillar -->
        <div class="white-pillar"></div>
        <!-- 3. Blue blob (left) -->
        <div class="blue-blob"></div>
        <!-- 4. Indigo blob (right) -->
        <div class="indigo-blob"></div>
        <!-- 5. Center blue glow -->
        <div class="center-glow"></div>
        <!-- 6. Ribs -->
        <div class="ribs-container">
          ${barsHtml}
        </div>
        <!-- 7. Texture grain -->
        <div class="grain"></div>
      </div>
    </body>
    </html>
  `;
}

async function bake() {
  console.log('Launching headless browser to bake static stage backgrounds...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // 1. Bake Desktop (2880x2048, scale 2.0)
  console.log('Rendering 2880x2048 desktop stage...');
  await page.setViewport({ width: 2880, height: 2048, deviceScaleFactor: 1 });
  const desktopHtml = getStageHtml(2.0, 2880, 2048);
  await page.setContent(desktopHtml, { waitUntil: 'load' });
  // Wait a short moment for blurs and filters to render fully
  await new Promise(r => setTimeout(r, 1200));

  const desktopWebpPath = path.join(OUTPUT_DIR, 'stage-desktop.webp');
  await page.screenshot({
    path: desktopWebpPath,
    type: 'webp',
    quality: 85
  });

  const desktopSize = fs.statSync(desktopWebpPath).size;
  console.log(`Bake completed: stage-desktop.webp (${(desktopSize / 1024).toFixed(1)} KB)`);

  // 2. Bake Mobile Portrait (1200x1700, cover crop)
  console.log('Rendering 1200x1700 mobile portrait stage...');
  await page.setViewport({ width: 1200, height: 1700, deviceScaleFactor: 1 });
  // Scale so stage covers 1200x1700: max(1200/1440, 1700/1024) = 1.6601
  const mobileScale = Math.max(1200 / 1440, 1700 / 1024);
  const mobileHtml = getStageHtml(mobileScale, 1200, 1700);
  await page.setContent(mobileHtml, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1200));

  const mobileWebpPath = path.join(OUTPUT_DIR, 'stage-mobile.webp');
  await page.screenshot({
    path: mobileWebpPath,
    type: 'webp',
    quality: 82
  });

  const mobileSize = fs.statSync(mobileWebpPath).size;
  console.log(`Bake completed: stage-mobile.webp (${(mobileSize / 1024).toFixed(1)} KB)`);

  await browser.close();

  // Validate limits (< 350 KB desktop, < 150 KB mobile)
  if (desktopSize > 350 * 1024) {
    console.warn(`WARNING: Desktop image is ${(desktopSize / 1024).toFixed(1)} KB > 350 KB target.`);
  }
  if (mobileSize > 150 * 1024) {
    console.warn(`WARNING: Mobile image is ${(mobileSize / 1024).toFixed(1)} KB > 150 KB target.`);
  }
}

bake().catch(err => {
  console.error('Baking failed:', err);
  process.exit(1);
});
