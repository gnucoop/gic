import { Mode } from '@ionic/core';
import { setMode } from '@stencil/core';

declare const Context: any;

let mode: Mode;

export default () => {
  const win = typeof (window as any) !== 'undefined' ? window : {} as Window;

  const Ionic = (win as any)['Ionic'] = (win as any)['Ionic'] || {};
  const Gic = (win as any)['Gic'] = (win as any)['Gic'] || {};

  const config = Gic['config'] = Context['config'] = Ionic['config'];

  mode = Gic.mode = Context.mode = Ionic.mode;
  if (config.getBoolean('_testing')) {
    config.set('animated', false);
  }

  setMode(
    (elm: any) => (elm as any).mode = (elm as any).mode || elm.getAttribute('mode') || mode
  );
};
