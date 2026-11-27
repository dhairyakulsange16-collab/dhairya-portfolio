const fs = require('fs');
const file = 'node_modules/next/dist/compiled/@vercel/og/index.node.js';

if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(
    /fileURLToPath\(new URL\("\.\.\/noto-sans-v27-latin-regular\.ttf", import\.meta\.url\)\)/g,
    'fileURLToPath(new URL("./noto-sans-v27-latin-regular.ttf", import.meta.url))'
  );
  content = content.replace(
    /fileURLToPath\(new URL\("\.\.\/yoga\.wasm", import\.meta\.url\)\)/g,
    'fileURLToPath(new URL("./yoga.wasm", import.meta.url))'
  );
  content = content.replace(
    /fileURLToPath\(new URL\("\.\.\/resvg\.wasm", import\.meta\.url\)\)/g,
    'fileURLToPath(new URL("./resvg.wasm", import.meta.url))'
  );
  content = content.replace(
    'fileURLToPath(join(import.meta.url, "../noto-sans-v27-latin-regular.ttf"))',
    'fileURLToPath(new URL("./noto-sans-v27-latin-regular.ttf", import.meta.url))'
  );
  content = content.replace(
    'fileURLToPath(join(import.meta.url, "../yoga.wasm"))',
    'fileURLToPath(new URL("./yoga.wasm", import.meta.url))'
  );
  content = content.replace(
    'fileURLToPath(join(import.meta.url, "../resvg.wasm"))',
    'fileURLToPath(new URL("./resvg.wasm", import.meta.url))'
  );
  fs.writeFileSync(file, content, 'utf8');
  console.log('Successfully updated index.node.js with correct relative paths.');
}
