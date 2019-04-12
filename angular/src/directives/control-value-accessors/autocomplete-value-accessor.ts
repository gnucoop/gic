import { Directive, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ValueAccessor } from './value-accessor';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'gic-autocomplete',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AutocompleteValueAccessor,
      multi: true
    }
  ]
})
export class AutocompleteValueAccessor extends ValueAccessor {

  constructor(el: ElementRef) {
    super(el);
  }

  @HostListener('ionChange', ['$event.target.value'])
  _handleChangeEvent(value: any) {
    this.handleChangeEvent(value);
  }
}
