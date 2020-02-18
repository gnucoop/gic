import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

// @ts-ignore
import { RollupExternalPlugin } from './rollup-external';
import { apiSpecGenerator } from './scripts/api-spec-generator';

export const config: Config = {
  namespace: 'Gic',
  bundles: [
    { components: ['gic-action-sheet', 'gic-action-sheet-controller'] },
    { components: ['gic-alert', 'gic-alert-controller'] },
    { components: ['gic-autocomplete', 'gic-autocomplete-option', 'gic-autocomplete-popover'] },
    { components: ['gic-select', 'gic-select-option', 'gic-select-popover'] },
    { components: ['gic-popover', 'gic-popover-controller'] },
  ],
  plugins: [
    sass(),
    new RollupExternalPlugin(),
  ],
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        { src: '**/*.scss' }
      ]
    },
    // {
    //   type: 'experimental-dist-module',
    //   externalRuntime: true,
    // },
    {
      type: 'docs-readme',
      strict: true
    },
    {
      type: 'docs-json',
      file: '../docs/core.json'
    },
    {
      type: 'dist-hydrate-script'
    },
    apiSpecGenerator({
      file: 'api.txt'
    }),
    // {
    //   type: 'stats',
    //   file: 'stats.json'
    // },
    {
      type: 'angular',
      componentCorePackage: '@gic/core',
      directivesProxyFile: '../angular/src/directives/proxies.ts',
      directivesUtilsFile: '../angular/src/directives/proxies-utils.ts',
      directivesArrayFile: '../angular/src/directives/proxies-list.txt',
      excludeComponents: [
        // overlays
        'gic-action-sheet',
        'gic-action-sheet-controller',
        'gic-alert',
        'gic-alert-controller',
        'gic-popover',
        'gic-popover-controller',
      ]
    }
  ],
  rollupConfig: {
    outputOptions: {
      globals: {
        '@ionic/core': 'ion.core',
        '@ionic/angular': 'ion.angular',
      }
    }
  },
  testing: {
    allowableMismatchedPixels: 200,
    pixelmatchThreshold: 0.05,
    waitBeforeScreenshot: 20,
    emulate: [
      {
        userAgent: 'iPhone',
        viewport: {
          width: 400,
          height: 800,
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          isLandscape: false
        }
      },
      {
        userAgent: 'Android',
        viewport: {
          width: 400,
          height: 800,
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          isLandscape: false
        }
      }
    ]
  },
  preamble: '(C) Gnucoop https://gnucoop.com - AGPLv3 license',
  globalScript: 'src/global/gic-global.ts',
  enableCache: true,
};
