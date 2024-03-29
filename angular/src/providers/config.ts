import { Injectable, InjectionToken } from '@angular/core';
import { Config as CoreConfig, GicConfig } from '@gic/core';

import { GicWindow } from '../types/interfaces';

@Injectable({
  providedIn: 'root',
})
export class Config {
  get(key: keyof GicConfig, fallback?: any): any {
    const c = getConfig();
    if (c) {
      return c.get(key, fallback);
    }
    return null;
  }

  getBoolean(key: keyof GicConfig, fallback?: boolean): boolean {
    const c = getConfig();
    if (c) {
      return c.getBoolean(key, fallback);
    }
    return false;
  }

  getNumber(key: keyof GicConfig, fallback?: number): number {
    const c = getConfig();
    if (c) {
      return c.getNumber(key, fallback);
    }
    return 0;
  }

  set(key: keyof GicConfig, value?: any): void {
    const c = getConfig();
    if (c) {
      c.set(key, value);
    }
  }
}

export const ConfigToken = new InjectionToken<any>('USERCONFIG');

const getConfig = (): CoreConfig | null => {
  if (typeof (window as any) !== 'undefined') {
    const Gic = (window as any as GicWindow).Gic;
    if (Gic?.config) {
      return Gic.config;
    }
  }
  return null;
};
