import { CommonModule, DOCUMENT } from '@angular/common';
import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { IonicModule, ɵa as ConfigToken } from '@ionic/angular';

import { appInitialize } from './app-initialize';
import { SelectValueAccessor } from './directives/control-value-accessors/select-value-accessor';
import { GicSelect, GicSelectOption } from './directives/proxies';

const DECLARATIONS = [
  // proxies
  GicSelect,
  GicSelectOption,

  // ngModel accessors
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
            ConfigToken,
            DOCUMENT
          ]
        }
      ]
    };
  }
}
