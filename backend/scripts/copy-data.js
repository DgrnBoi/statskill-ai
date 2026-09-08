const fs = require('fs');
const path = require('path');

const srcDataDir = path.join(__dirname, '../src/data');
const distDataDir = path.join(__dirname, '../dist/src/data');

console.log('[build:copy-data] Starting data assets sync...');

if (fs.existsSync(srcDataDir)) {
  fs.mkdirSync(distDataDir, { recursive: true });
  const files = fs.readdirSync(srcDataDir);
  let copiedCount = 0;

  for (const file of files) {
    const srcFile = path.join(srcDataDir, file);
    const distFile = path.join(distDataDir, file);

    if (fs.statSync(srcFile).isFile()) {
      fs.copyFileSync(srcFile, distFile);
      copiedCount++;
    }
  }

  console.log(`[build:copy-data] Successfully copied ${copiedCount} asset files to dist/src/data/`);
} else {
  console.warn(`[build:copy-data] Warning: Source data directory not found at ${srcDataDir}`);
}
