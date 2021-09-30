
// the unpkg link cannot use "latest" in the url
// so this script is to keep the link updated
// with the latest

const fs = require('fs');
const path = require('path');

const version = process.argv[2];

if (!version) {
  throw new Error('version arg missing');
}

const readmePath = path.join(__dirname, '..', 'README.md');
let readmeContent = fs.readFileSync(readmePath, 'utf-8');

// https://unpkg.com/@gic/core@latest/dist/gic.js

readmeContent = readmeContent.replace(
  /https\:\/\/unpkg.com\/@gic\/core@(.+?)\//g,
  'https://unpkg.com/@gic/core@' + version + '/'
);

fs.writeFileSync(readmePath, readmeContent);
