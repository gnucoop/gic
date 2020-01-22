import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

// @ts-ignore
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
    sass()
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
        'ion-action-sheet',
        'ion-action-sheet-controller',
        'ion-alert',
        'ion-app',
        'ion-avatar',
        'ion-back-button',
        'ion-backdrop',
        'ion-badge',
        'ion-button',
        'ion-buttons',
        'ion-card',
        'ion-card-content',
        'ion-card-header',
        'ion-card-subtitle',
        'ion-card-title',
        'ion-checkbox',
        'ion-chip',
        'ion-col',
        'ion-content',
        'ion-datetime',
        'ion-fab',
        'ion-fab-button',
        'ion-fab-list',
        'ion-footer',
        'ion-grid',
        'ion-header',
        'ion-icon',
        'ion-img',
        'ion-infinite-scroll',
        'ion-infinite-scroll-content',
        'ion-input',
        'ion-item',
        'ion-item-divider',
        'ion-item-group',
        'ion-item-option',
        'ion-item-options',
        'ion-item-sliding',
        'ion-label',
        'ion-list',
        'ion-list-header',
        'ion-loading',
        'ion-menu',
        'ion-menu-button',
        'ion-menu-toggle',
        'ion-modal',
        'ion-nav',
        'ion-nav-link',
        'ion-note',
        'ion-picker',
        'ion-popover',
        'ion-progress-bar',
        'ion-radio',
        'ion-radio-group',
        'ion-range',
        'ion-refresher',
        'ion-refresher-content',
        'ion-reorder',
        'ion-reorder-group',
        'ion-ripple-effect',
        'ion-route',
        'ion-route-redirect',
        'ion-router',
        'ion-router-link',
        'ion-router-outlet',
        'ion-row',
        'ion-searchbar',
        'ion-segment',
        'ion-segment-button',
        'ion-select',
        'ion-select-option',
        'ion-skeleton-text',
        'ion-slide',
        'ion-slides',
        'ion-spinner',
        'ion-split-pane',
        'ion-tab',
        'ion-tab-bar',
        'ion-tab-button',
        'ion-tabs',
        'ion-text',
        'ion-textarea',
        'ion-thumbnail',
        'ion-title',
        'ion-toast',
        'ion-toolbar',
        'ion-toggle',
        'ion-virtual-scroll',
      ]
    }
  ],
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
