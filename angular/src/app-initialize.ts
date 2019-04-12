import { defineCustomElements } from '@gic/core/loader';
import { Config } from '@ionic/angular';

import { GicWindow } from './types/interfaces';

export function appInitialize(config: Config, doc: Document) {
  return (): any => {
    const win: GicWindow | undefined = doc.defaultView as any;
    if (win) {
      const Gic = win.Gic = win.Gic || {};

      Gic.config = config;
      Gic.asyncQueue = false;

      Gic.ael = (elm, eventName, cb, opts) => {
        if (elm.__zone_symbol__addEventListener && skipZone(eventName)) {
          elm.__zone_symbol__addEventListener(eventName, cb, opts);
        } else {
          elm.addEventListener(eventName, cb, opts);
        }
      };

      Gic.rel = (elm, eventName, cb, opts) => {
        if (elm.__zone_symbol__removeEventListener && skipZone(eventName)) {
          elm.__zone_symbol__removeEventListener(eventName, cb, opts);
        } else {
          elm.removeEventListener(eventName, cb, opts);
        }
      };

      return defineCustomElements(win, {
        exclude: ['ion-tabs', 'ion-tab']
      });
    }
  };
}

const SKIP_ZONE = [
  'scroll',
  'resize',

  'touchstart',
  'touchmove',
  'touchend',

  'mousedown',
  'mousemove',
  'mouseup',

  'ionStyle',
];

function skipZone(eventName: string) {
  return SKIP_ZONE.indexOf(eventName) >= 0;
}
