const fs = require('fs-extra');
const path = require('path');

const sourceDir = path.join(__dirname, '../apps/interface/dist-interface');
const destDir = path.join(__dirname, '../apps/server-web/web');

// Ensure destination directory exists
fs.ensureDirSync(destDir);

// Copy directory
fs.copySync(sourceDir, destDir, { overwrite: true });
console.log(`Copied ${sourceDir} to ${destDir}`);
