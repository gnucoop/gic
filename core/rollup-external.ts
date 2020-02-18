import { InputOptions, Plugin } from 'rollup';

export class RollupExternalPlugin implements Plugin {
  name = 'rollup-external';

  options(options: InputOptions): InputOptions {
    const external = Array.isArray(options.external) ? options.external : [];
    return {
      ...options,
      external: [...external, '@ionic/core', '@ionic/angular'],
    };
  }
}
