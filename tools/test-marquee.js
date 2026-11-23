const puppeteer = require('puppeteer-core');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function checkMarquee() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // 1. Check OS/Browser prefers-reduced-motion value
  const reducedMotion = await page.evaluate(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });
  console.log('Browser window.matchMedia("(prefers-reduced-motion: reduce)").matches:', reducedMotion);

  // 2. Scroll to the Client Roster section
  await page.evaluate(() => {
    const el = document.getElementById('clients');
    if (el) el.scrollIntoView();
  });

  // Small delay to ensure render
  await new Promise(r => setTimeout(r, 500));

  // 3. Inspect track 1 (.marquee-track--left) and track 2 (.marquee-track--right)
  const track1_T0 = await page.evaluate(() => {
    const track = document.querySelector('.marquee-track--left');
    if (!track) return null;
    const computed = window.getComputedStyle(track);
    return {
      className: track.className,
      animationName: computed.animationName,
      animationDuration: computed.animationDuration,
      animationPlayState: computed.animationPlayState,
      transform: computed.transform,
      width: computed.width
    };
  });

  console.log('\n--- TRACK 1 (.marquee-track--left) at T0 ---');
  console.log(track1_T0);

  const track2_T0 = await page.evaluate(() => {
    const track = document.querySelector('.marquee-track--right');
    if (!track) return null;
    const computed = window.getComputedStyle(track);
    return {
      className: track.className,
      animationName: computed.animationName,
      animationDuration: computed.animationDuration,
      animationPlayState: computed.animationPlayState,
      transform: computed.transform,
      width: computed.width
    };
  });

  console.log('\n--- TRACK 2 (.marquee-track--right) at T0 ---');
  console.log(track2_T0);

  // Wait 2000ms
  console.log('\nWaiting 2000ms to observe transform progression...');
  await new Promise(r => setTimeout(r, 2000));

  const track1_T2 = await page.evaluate(() => {
    const track = document.querySelector('.marquee-track--left');
    if (!track) return null;
    const computed = window.getComputedStyle(track);
    return {
      animationPlayState: computed.animationPlayState,
      transform: computed.transform
    };
  });

  console.log('\n--- TRACK 1 (.marquee-track--left) at T0 + 2s ---');
  console.log(track1_T2);

  const track2_T2 = await page.evaluate(() => {
    const track = document.querySelector('.marquee-track--right');
    if (!track) return null;
    const computed = window.getComputedStyle(track);
    return {
      animationPlayState: computed.animationPlayState,
      transform: computed.transform
    };
  });

  console.log('\n--- TRACK 2 (.marquee-track--right) at T0 + 2s ---');
  console.log(track2_T2);

  const t1Changed = track1_T0.transform !== track1_T2.transform;
  const t2Changed = track2_T0.transform !== track2_T2.transform;
  console.log(`\nResult verification:`);
  console.log(`Track 1 moving? ${t1Changed} (T0: "${track1_T0.transform}" vs T2: "${track1_T2.transform}")`);
  console.log(`Track 2 moving? ${t2Changed} (T0: "${track2_T0.transform}" vs T2: "${track2_T2.transform}")`);

  // Now test under simulated prefers-reduced-motion: reduce
  console.log('\nTesting under prefers-reduced-motion: reduce emulation...');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await new Promise(r => setTimeout(r, 200));

  const reducedTrackInfo = await page.evaluate(() => {
    const track = document.querySelector('.marquee-track--left');
    const computed = window.getComputedStyle(track);
    return {
      animationDuration: computed.animationDuration,
      animationPlayState: computed.animationPlayState,
      transform: computed.transform
    };
  });
  console.log('Track 1 under prefers-reduced-motion:', reducedTrackInfo);

  await new Promise(r => setTimeout(r, 2000));
  const reducedTrackInfo_T2 = await page.evaluate(() => {
    const track = document.querySelector('.marquee-track--left');
    const computed = window.getComputedStyle(track);
    return {
      transform: computed.transform
    };
  });
  console.log('Track 1 under prefers-reduced-motion at +2s:', reducedTrackInfo_T2);
  const reducedMoving = reducedTrackInfo.transform !== reducedTrackInfo_T2.transform;
  console.log(`Reduced motion moving gently at 90s? ${reducedMoving} (${reducedTrackInfo.animationDuration})`);

  await browser.close();

  if (!t1Changed || !t2Changed) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

checkMarquee().catch(err => {
  console.error(err);
  process.exit(1);
});
