(async () => {
  const res = await fetch('http://localhost:3000');
  const html = await res.text();
  const ogMatches = html.match(/<meta\s+[^>]*property=["']og:[^>]*>/gi) || [];
  const twMatches = html.match(/<meta\s+[^>]*name=["']twitter:[^>]*>/gi) || [];
  
  console.log('=== RENDERED OPEN GRAPH META TAGS ===');
  ogMatches.forEach(m => console.log(m));
  
  console.log('\n=== RENDERED TWITTER META TAGS ===');
  twMatches.forEach(m => console.log(m));

  console.log('\n=== TESTING IMAGE ENDPOINTS ===');
  const ogRes = await fetch('http://localhost:3000/opengraph-image');
  const ogBuf = await ogRes.arrayBuffer();
  console.log('GET /opengraph-image:', {
    status: ogRes.status,
    contentType: ogRes.headers.get('content-type'),
    sizeBytes: ogBuf.byteLength,
    sizeKb: (ogBuf.byteLength / 1024).toFixed(1) + ' KB'
  });

  const twRes = await fetch('http://localhost:3000/twitter-image');
  const twBuf = await twRes.arrayBuffer();
  console.log('GET /twitter-image:', {
    status: twRes.status,
    contentType: twRes.headers.get('content-type'),
    sizeBytes: twBuf.byteLength,
    sizeKb: (twBuf.byteLength / 1024).toFixed(1) + ' KB'
  });

  console.log('\n=== TESTING ROBOTS & SITEMAP ===');
  const robotsRes = await fetch('http://localhost:3000/robots.txt');
  console.log('GET /robots.txt status:', robotsRes.status);
  console.log('robots.txt content:\n' + (await robotsRes.text()).trim());

  const sitemapRes = await fetch('http://localhost:3000/sitemap.xml');
  console.log('\nGET /sitemap.xml status:', sitemapRes.status);
  console.log('sitemap.xml preview:\n' + (await sitemapRes.text()).slice(0, 300) + '...');
})();
