import { CommonModule, DOCUMENT } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { appInitialize } from './app-initialize';
import { AutocompleteValueAccessor } from './directives/control-value-accessors/autocomplete-value-accessor';
import { SelectValueAccessor } from './directives/control-value-accessors/select-value-accessor';
import { GicAutocomplete, GicAutocompleteOption, GicSelect, GicSelectOption } from './directives/proxies';

const DECLARATIONS = [
  // proxies
  GicAutocomplete,
  GicAutocompleteOption,
  GicSelect,
  GicSelectOption,

  // ngModel accessors
  AutocompleteValueAccessor,
  SelectValueAccessor,
];

@NgModule({
  declarations: DECLARATIONS,
  exports: DECLARATIONS,
  imports: [CommonModule, IonicModule],
})
export class GicModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: GicModule,
      providers: [
        {
          provide: APP_INITIALIZER,
          useFactory: appInitialize,
          multi: true,
          deps: [
            DOCUMENT
          ]
        }
      ]
    };
  }
}
