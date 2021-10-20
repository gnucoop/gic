import { Config } from "@stencil/core";
import { sass } from "@stencil/sass";
import { angularOutputTarget } from "@stencil/angular-output-target";

import { RollupExternalPlugin } from "./rollup-external";

// @ts-ignore
import { apiSpecGenerator } from "./scripts/api-spec-generator";

export const config: Config = {
  autoprefixCss: true,
  namespace: "Gic",
  bundles: [
    { components: ["gic-action-sheet"] },
    { components: ["gic-alert"] },
    { components: ["gic-autocomplete", "gic-autocomplete-option"] },
    { components: ["gic-select", "gic-select-option", "gic-select-popover"] },
    { components: ["gic-popover"] },
  ],
  plugins: [new RollupExternalPlugin(), sass()],
  outputTargets: [
    {
      type: "docs-vscode",
      file: "dist/html.html-data.json",
      sourceCodeBaseUrl: "https://github.com/gnucoop/gic/tree/master/core/",
    },
    {
      type: "dist",
      esmLoaderPath: "../loader",
    },
    {
      type: "dist-custom-elements",
      dir: "components",
      copy: [
        {
          src: "../scripts/custom-elements",
          dest: "components",
          warn: true,
        },
      ],
      includeGlobalScripts: false,
    },
    {
      type: "docs-readme",
      strict: true,
    },
    {
      type: "docs-json",
      file: "../docs/core.json",
    },
    {
      type: "dist-hydrate-script",
    },
    apiSpecGenerator({
      file: "api.txt",
    }) as any,
    // {
    //   type: 'stats',
    //   file: 'stats.json'
    // },
    angularOutputTarget({
      componentCorePackage: "@gic/core",
      directivesProxyFile: "../angular/src/directives/proxies.ts",
      directivesArrayFile: "../angular/src/directives/proxies-list.txt",
      excludeComponents: [
        // overlays
        "gic-action-sheet",
        "gic-alert",
        "gic-popover",
      ],
    }),
  ],
  buildEs5: "prod",
  extras: {
    dynamicImportShim: true,
    initializeNextTick: true,
    scriptDataOpts: true,
  },
  rollupConfig: {
    outputOptions: {
      globals: {
        "@ionic/core": "ion.core",
        "@ionic/angular": "ion.angular",
      },
    },
  },
  testing: {
    allowableMismatchedPixels: 200,
    pixelmatchThreshold: 0.05,
    waitBeforeScreenshot: 20,
    emulate: [
      {
        userAgent: "iPhone",
        viewport: {
          width: 400,
          height: 800,
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          isLandscape: false,
        },
      },
      {
        userAgent: "Android",
        viewport: {
          width: 400,
          height: 800,
          deviceScaleFactor: 2,
          isMobile: true,
          hasTouch: true,
          isLandscape: false,
        },
      },
    ],
  },
  preamble: "(C) Gnucoop https://gnucoop.com - AGPLv3 license",
  globalScript: "src/global/gic-global.ts",
  enableCache: true,
};
