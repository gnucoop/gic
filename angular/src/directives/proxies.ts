/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './angular-component-lib/utils';

import { Components } from '@gic/core';


export declare interface GicAutocomplete extends Components.GicAutocomplete {}
@ProxyCmp({
  inputs: ['interfaceOptions', 'placeholder', 'value']
})
@Component({
  selector: 'gic-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['interfaceOptions', 'placeholder', 'value']
})
export class GicAutocomplete {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}


export declare interface GicAutocompleteOption extends Components.GicAutocompleteOption {}
@ProxyCmp({
  inputs: ['value']
})
@Component({
  selector: 'gic-autocomplete-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['value']
})
export class GicAutocompleteOption {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

import { SelectChangeEventDetail as ISelectSelectChangeEventDetail } from '@gic/core';
export declare interface GicSelect extends Components.GicSelect {}
@ProxyCmp({
  inputs: ['cancelText', 'compareWith', 'disabled', 'interface', 'interfaceOptions', 'multiple', 'name', 'okText', 'placeholder', 'searchBar', 'selectedText', 'useVirtualScroll', 'value'],
  methods: ['open']
})
@Component({
  selector: 'gic-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['cancelText', 'compareWith', 'disabled', 'interface', 'interfaceOptions', 'multiple', 'name', 'okText', 'placeholder', 'searchBar', 'selectedText', 'useVirtualScroll', 'value'],
  outputs: ['ionChange', 'ionCancel', 'ionFocus', 'ionBlur']
})
export class GicSelect {
  /** Emitted when the value has changed. */
  ionChange!: EventEmitter<CustomEvent<ISelectSelectChangeEventDetail>>;
  /** Emitted when the selection is cancelled. */
  ionCancel!: EventEmitter<CustomEvent<void>>;
  /** Emitted when the select has focus. */
  ionFocus!: EventEmitter<CustomEvent<void>>;
  /** Emitted when the select loses focus. */
  ionBlur!: EventEmitter<CustomEvent<void>>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionCancel', 'ionFocus', 'ionBlur']);
  }
}


export declare interface GicSelectOption extends Components.GicSelectOption {}
@ProxyCmp({
  inputs: ['disabled', 'value']
})
@Component({
  selector: 'gic-select-option',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>',
  inputs: ['disabled', 'value']
})
export class GicSelectOption {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
