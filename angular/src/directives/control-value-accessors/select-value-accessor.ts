import { Directive, ElementRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ɵb as ValueAccessor } from '@ionic/angular';

@Directive({
  /* tslint:disable-next-line:directive-selector */
  selector: 'gic-select',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: SelectValueAccessor,
      multi: true
    }
  ]
})
export class SelectValueAccessor extends ValueAccessor {

  constructor(el: ElementRef) {
    super(el);
  }

  @HostListener('ionChange', ['$event.target.value'])
  _handleChangeEvent(value: any) {
    this.handleChangeEvent(value);
  }
}
