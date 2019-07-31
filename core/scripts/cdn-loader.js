module.exports.applyPolyfills = function() { return Promise.resolve() };
module.exports.defineCustomElements = function(_, opts = {}) {
  return new Promise((resolve, reject) => {
    const doc = document;
    const mod = doc.createElement('script');
    mod.setAttribute('type', 'module');
    mod['data-opts'] = opts;
    mod.src = '__CDN_LOADER_URL__/dist/gic/gic.esm.js';

    const legacy = doc.createElement('script');
    legacy.setAttribute('nomodule', '');
    legacy['data-opts'] = opts;
    legacy.src = '__CDN_LOADER_URL__/gic/gic/ionic.js';

    mod.onload = resolve;
    mod.onerror = reject;

    legacy.onload = resolve;
    legacy.onerror = reject;

    doc.head.appendChild(mod);
    doc.head.appendChild(legacy);
  });
}
