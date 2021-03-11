export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
export { C as Config, b as actionSheetController, a as alertController, c as config, d as configFromSession, e as configFromURL, p as popoverController, s as saveConfig } from './overlays.js';

const setupConfig = (config) => {
  const win = window;
  const Gic = win.Gic;
  if (Gic && Gic.config && Gic.config.constructor.name !== 'Object') {
    console.error('gic config was already initialized');
    return;
  }
  win.Gic = win.Gic || {};
  win.Gic.config = Object.assign(Object.assign({}, win.Gic.config), config);
  return win.Gic.config;
};

export { setupConfig };
