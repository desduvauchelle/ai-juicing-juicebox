const fs = require('fs-extra');

const source = process.argv[2];
const destination = process.argv[3];

fs.copySync(source, destination, { overwrite: true });
console.log(`Copied ${source} to ${destination}`);
