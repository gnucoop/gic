import { Directive, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

import { ValueAccessorDirective } from './value-accessor';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'gic-select',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectValueAccessorDirective,
      multi: true,
    },
  ],
})
export class SelectValueAccessorDirective extends ValueAccessorDirective {
  constructor(el: ElementRef) {
    super(el);
  }

  @HostListener('ionChange', ['$event.target'])
  _handleChangeEvent(el: any): void {
    this.handleChangeEvent(el, el.value);
  }
}
