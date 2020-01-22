const fs = require('fs-extra');
const path = require('path');

function copyIonicons() {
  const src = path.join(__dirname, '..', '..', 'core', 'node_modules', 'ionicons');
  const dst = path.join(__dirname, '..', 'node_modules', 'ionicons');

  fs.removeSync(dst);
  fs.copySync(src, dst);
}

function copyCSS() {
  const src = path.join(__dirname, '..', '..', 'core', 'css');
  const dst = path.join(__dirname, '..','dist', 'css');

  fs.removeSync(dst);
  fs.copySync(src, dst);
}

copyIonicons();
copyCSS();
