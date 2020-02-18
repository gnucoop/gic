const fs = require('fs');
const path = require('path');

const srcPath = path.normalize(path.join(__dirname, '..', 'node_modules', '@stencil', 'core', 'dist', 'compiler', 'index.js'));
let scriptContent = fs.readFileSync(srcPath, 'utf-8');

scriptContent = scriptContent.replace(
  'if (typeof pkgData.collection !== \'string\' || !pkgData.collection.endsWith(\'.json\')) {',
  'if (typeof pkgData.collection !== \'string\' || !pkgData.collection.endsWith(\'.json\') || pkgData.name === \'@ionic/core\' || pkgData.name === \'ionicons\') {'
);

fs.writeFileSync(srcPath, scriptContent);
