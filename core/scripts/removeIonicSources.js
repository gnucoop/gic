const fs = require('fs');
const path = require('path');

const ionicPath = 'node_modules/@ionic/core/dist';
const content = fs.readdirSync(ionicPath);

content.forEach(c => {
  if (c !== 'types') {
    const fullPath = path.join(ionicPath, c);
    const stat = fs.lstatSync(fullPath);
    if (stat.isFile()) {
      fs.unlinkSync(fullPath);
    } else if (stat.isDirectory()) {
      fs.rmdirSync(fullPath, {recursive: true});
    }
  }
});
