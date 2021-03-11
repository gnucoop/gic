import { Mode } from '@ionic/core';
import { getMode, setMode } from '@stencil/core';

import { GicConfig } from '../interface';
import { isPlatform, setupPlatforms } from '../utils/platforms';

import { config, configFromSession, configFromURL, saveConfig } from './config';

declare const Context: any;

let defaultMode: Mode;

export const getGicMode = (ref?: any): Mode => {
  return (ref && getMode(ref)) || defaultMode;
};

export const initialize = (userConfig: GicConfig) => {
  if (typeof (window as any) === 'undefined') {
    return;
  }

  const doc = document;
  const win = window;
  Context.config = config;
  const Gic = (win as any).Gic = (win as any).Gic || {};

  // Setup platforms
  setupPlatforms(win);

  // create the Gic.config from raw config object (if it exists)
  // and convert Gic.config into a ConfigApi that has a get() fn
  const configObj = {
    ...configFromSession(win),
    persistConfig: false,
    ...Gic.config,
    ...configFromURL(win),
    ...userConfig
  };

  config.reset(configObj);
  if (config.getBoolean('persistConfig')) {
    saveConfig(win, configObj);
  }

  // first see if the mode was set as an attribute on <html>
  // which could have been set by the user, or by prerendering
  // otherwise get the mode via config settings, and fallback to md
  Gic.config = config;
  Gic.mode = defaultMode = config.get(
      'mode',
      (doc.documentElement.getAttribute('mode')) ||
          (isPlatform(win, 'ios') ? 'ios' : 'md'));
  config.set('mode', defaultMode);
  doc.documentElement.setAttribute('mode', defaultMode);
  doc.documentElement.classList.add(defaultMode);

  if (config.getBoolean('_testing')) {
    config.set('animated', false);
  }

  const isGicElement = (elm: any) =>
      elm.tagName && elm.tagName.startsWith('GIC-');

  const isAllowedIonicModeValue =
      (elmMode: string) => ['ios', 'md'].includes(elmMode);

  setMode((elm: any) => {
    while (elm) {
      const elmMode = (elm as any).mode || elm.getAttribute('mode');
      if (elmMode) {
        if (isAllowedIonicModeValue(elmMode)) {
          return elmMode;
        } else if (isGicElement(elm)) {
          console.warn(
              'Invalid gic mode: "' + elmMode + '", expected: "ios" or "md"');
        }
      }
      elm = elm.parentElement;
    }
    return defaultMode;
  });
};

export default initialize;
