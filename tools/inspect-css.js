const http = require('http');

async function get(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function run() {
  const html = await get('http://localhost:3000');
  console.log('HTML loaded, length:', html.length);
  const cssMatches = html.match(/\/_next\/static\/css\/[^"']+\.css/g) || [];
  console.log('CSS matches:', cssMatches);
  for (const cssPath of cssMatches) {
    const css = await get('http://localhost:3000' + cssPath);
    console.log('Checking', cssPath, 'length:', css.length);
    console.log('Has @keyframes marqueeTrain:', css.includes('@keyframes marqueeTrain'));
    console.log('Has @keyframes marquee-train:', css.includes('@keyframes marquee-train'));
    console.log('Has animate-train-left:', css.includes('animate-train-left'));
    console.log('Has prefers-reduced-motion:', css.includes('prefers-reduced-motion'));
  }
}

run().catch(console.error);
