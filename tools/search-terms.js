const fs = require('fs');
const path = require('path');

const patterns = [/whatsapp/i, /wa\.me/i, /youtube/i, /youtu\.be/i, /\byt\b/i];
const ignoreDirs = new Set(['node_modules', '.next', '.git', 'dist', 'build']);

function searchDir(dir, matches = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (ignoreDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      searchDir(fullPath, matches);
    } else if (entry.isFile()) {
      // only check text-like files
      const ext = path.extname(entry.name).toLowerCase();
      if (['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.html', '.svg'].includes(ext)) {
        try {
          const content = fs.readFileSync(fullPath, 'utf8');
          const lines = content.split('\n');
          lines.forEach((line, index) => {
            for (const p of patterns) {
              if (p.test(line)) {
                matches.push({
                  file: path.relative(process.cwd(), fullPath),
                  lineNum: index + 1,
                  line: line.trim(),
                  match: line.match(p)[0]
                });
                break;
              }
            }
          });
        } catch (e) {
          // ignore binary read errors
        }
      }
    }
  }
  return matches;
}

const results = searchDir(process.cwd());
console.log(`Found ${results.length} matches:`);
results.forEach(r => console.log(`${r.file}:${r.lineNum} [${r.match}] => ${r.line}`));
