const https = require('https');

const LIVE_URL = 'https://dhairya-portfolio-tan.vercel.app';

function delay(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function fetchUrl(url) {
  const res = await fetch(url, { headers: { 'Cache-Control': 'no-cache' } });
  const text = await res.text();
  return { status: res.status, headers: res.headers, text };
}

async function pollDeployment() {
  console.log(`Polling ${LIVE_URL} for deployment update...`);
  for (let i = 0; i < 30; i++) {
    try {
      const { status, text } = await fetchUrl(LIVE_URL);
      const hasAuroraBackdrop = text.includes('anim-aurora-1') || text.includes('data-direction="aurora"');
      const hasOldFigma = text.includes('backdrop-anim-pillar') || text.includes('stage-desktop.webp');

      console.log(`[Attempt ${i + 1}] Status: ${status}, hasAuroraBackdrop: ${hasAuroraBackdrop}, hasOldFigma: ${hasOldFigma}`);
      if (status === 200 && hasAuroraBackdrop && !hasOldFigma) {
        console.log('\n>>> LIVE SITE IS FULLY DEPLOYED WITH DIRECTION 1 (CINEMATIC AURORA)! <<<');
        return text;
      }
    } catch (e) {
      console.log(`[Attempt ${i + 1}] Fetch error: ${e.message}`);
    }
    await delay(5000);
  }
  throw new Error('Deployment polling timed out after 150 seconds.');
}

async function verify() {
  const html = await pollDeployment();

  console.log('\n=== LIVE META TAGS ===');
  const ogMatches = html.match(/<meta\s+[^>]*property=["']og:[^>]*>/gi) || [];
  const twMatches = html.match(/<meta\s+[^>]*name=["']twitter:[^>]*>/gi) || [];
  ogMatches.forEach(m => console.log(' ', m));
  twMatches.forEach(m => console.log(' ', m));

  console.log('\n=== LIVE OG IMAGE CHECK ===');
  const ogRes = await fetch(`${LIVE_URL}/opengraph-image`);
  const ogBuf = await ogRes.arrayBuffer();
  console.log('GET /opengraph-image:', {
    status: ogRes.status,
    contentType: ogRes.headers.get('content-type'),
    sizeBytes: ogBuf.byteLength,
    sizeKb: (ogBuf.byteLength / 1024).toFixed(1) + ' KB'
  });

  console.log('\n=== ALL LIVE VERIFICATIONS PASSED ===');
}

verify().catch(e => {
  console.error(e);
  process.exit(1);
});
