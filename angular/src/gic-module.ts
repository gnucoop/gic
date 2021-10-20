import { CommonModule, DOCUMENT } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule, NgZone } from '@angular/core';
import { GicConfig } from '@gic/core';
import { IonicModule } from '@ionic/angular';

import { appInitialize } from './app-initialize';
import { AutocompleteValueAccessorDirective } from './directives/control-value-accessors/autocomplete-value-accessor';
import { SelectValueAccessorDirective } from './directives/control-value-accessors/select-value-accessor';
import { GicAutocomplete, GicAutocompleteOption, GicSelect, GicSelectOption } from './directives/proxies';
import { ConfigToken } from './providers/config';
import { PopoverController } from './providers/popover-controller';

const DECLARATIONS = [
  // proxies
  GicAutocomplete,
  GicAutocompleteOption,
  GicSelect,
  GicSelectOption,

  // ngModel accessors
  AutocompleteValueAccessorDirective,
  SelectValueAccessorDirective,
];

@NgModule({
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
  imports: [CommonModule, IonicModule],
  providers: [PopoverController],
})
export class GicModule {
  static forRoot(config?: GicConfig): ModuleWithProviders<GicModule> {
    return {
      ngModule: GicModule,
      providers: [
        {
          provide: ConfigToken,
          useValue: config,
        },
        {
          provide: APP_INITIALIZER,
          useFactory: appInitialize,
          multi: true,
          deps: [ConfigToken, DOCUMENT, NgZone],
        },
      ],
    };
  }
}
