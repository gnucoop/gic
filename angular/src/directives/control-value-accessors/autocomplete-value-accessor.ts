import { Directive, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ValueAccessorDirective } from './value-accessor';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'gic-autocomplete',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AutocompleteValueAccessorDirective,
      multi: true,
    },
  ],
})
export class AutocompleteValueAccessorDirective extends ValueAccessorDirective {
  constructor(el: ElementRef) {
    super(el);
  }

  @HostListener('ionChange', ['$event.target.value'])
  _handleChangeEvent(el: any): void {
    this.handleChangeEvent(el, el.value);
  }
}
