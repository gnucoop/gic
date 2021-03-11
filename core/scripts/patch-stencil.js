const fs = require('fs');
const path = require('path');

const srcPath = path.normalize(path.join(__dirname, '..', 'node_modules', '@stencil', 'core', 'compiler', 'stencil.js'));
let scriptContent = fs.readFileSync(srcPath, 'utf-8');

scriptContent = scriptContent.replace(
  'if (!isString(parsedPkgJson.data.collection) || !parsedPkgJson.data.collection.endsWith(\'.json\')) {',
  'if (!isString(parsedPkgJson.data.collection) || !parsedPkgJson.data.collection.endsWith(\'.json\') || parsedPkgJson.data.name === \'@ionic/core\' || parsedPkgJson.data.name === \'ionicons\') {'
);

fs.writeFileSync(srcPath, scriptContent);
