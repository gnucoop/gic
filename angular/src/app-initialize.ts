import { NgZone } from '@angular/core';
import { applyPolyfills, defineCustomElements } from '@gic/core/loader';

import { Config } from './providers/config';
import { GicWindow } from './types/interfaces';
import { raf } from './util/util';

export function appInitialize(config: Config, doc: Document, zone: NgZone) {
  return (): any => {
    const win: GicWindow | undefined = doc.defaultView as any;
    if (win) {
      const Gic = win.Gic = win.Gic || {};

      Gic.config = {
        ...config,
        _zoneGate: (h: any) => zone.run(h)
      };

      const aelFn = '__zone_symbol__addEventListener' in (doc.body as any)
        ? '__zone_symbol__addEventListener'
        : 'addEventListener';

      return applyPolyfills().then(() => {
        return defineCustomElements(win, {
          exclude: ['ion-tabs', 'ion-tab'],
          syncQueue: true,
          raf,
          jmp: (h: any) => zone.runOutsideAngular(h),
          ael(elm, eventName, cb, opts) {
            (elm as any)[aelFn](eventName, cb, opts);
          },
          rel(elm, eventName, cb, opts) {
            elm.removeEventListener(eventName, cb, opts);
          }
        });
      });
    }
  };
}
