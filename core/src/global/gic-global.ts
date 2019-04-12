const win = typeof (window as any) !== 'undefined' ? window : {} as Window;

declare const Context: any;

const Ionic = (win as any)['Ionic'] = (win as any)['Ionic'] || {};
const Gic = (win as any)['Gic'] = (win as any)['Gic'] || {};

const config = Gic['config'] = Context['config'] = Ionic['config'];

Gic.mode = Context.mode = Ionic.mode;
if (config.getBoolean('_testing')) {
  config.set('animated', false);
}
