const fs = require('fs');
const path = require('path');

const srcPath = path.normalize(path.join(__dirname, '..', 'node_modules', '@stencil', 'core', 'dist', 'compiler', 'index.js'));
let scriptContent = fs.readFileSync(srcPath, 'utf-8');

const def1 = 'const addExternalImport = (config, compilerCtx, buildCtx, moduleFile, resolveFromDir, moduleId) => {\n';
const def2 = '    moduleFile.externalImports = moduleFile.externalImports || [];';
scriptContent = scriptContent.replace(
  def1 + def2, def1 + '    if (moduleId === \'@ionic/core\' || moduleId === \'ionicons\') { return; }\n' + def2);

fs.writeFileSync(srcPath, scriptContent);
