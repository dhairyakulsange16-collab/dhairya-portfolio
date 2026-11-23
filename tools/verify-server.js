const http = require('http');

function check() {
  http.get('http://localhost:3000', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      console.log('HTTP Status:', res.statusCode);
      console.log('Contains "Dhairya":', data.includes('Dhairya'));
      console.log('Contains "whatsapp":', data.toLowerCase().includes('whatsapp'));
      console.log('Contains "youtube":', data.toLowerCase().includes('youtube'));
      console.log('HTML Length:', data.length);
      process.exit(res.statusCode === 200 && data.includes('Dhairya') ? 0 : 1);
    });
  }).on('error', (err) => {
    console.error('Error connecting:', err.message);
    process.exit(1);
  });
}

setTimeout(check, 3000);
