/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { proxyInputs, proxyMethods, proxyOutputs } from './proxies-utils';

import { Components } from '@gic/core';

export declare interface GicAutocomplete extends Components.GicAutocomplete {}
@Component({ selector: 'gic-autocomplete', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>', inputs: ['interfaceOptions', 'mode', 'placeholder', 'value'] })
export class GicAutocomplete {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(GicAutocomplete, ['interfaceOptions', 'mode', 'placeholder', 'value']);

export declare interface GicAutocompleteOption extends Components.GicAutocompleteOption {}
@Component({ selector: 'gic-autocomplete-option', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>', inputs: ['value'] })
export class GicAutocompleteOption {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(GicAutocompleteOption, ['value']);

export declare interface GicSelect extends Components.GicSelect {}
@Component({ selector: 'gic-select', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>', inputs: ['cancelText', 'compareWith', 'disabled', 'interface', 'interfaceOptions', 'mode', 'multiple', 'name', 'okText', 'placeholder', 'searchBar', 'selectedText', 'useVirtualScroll', 'value'] })
export class GicSelect {
  ionChange!: EventEmitter<CustomEvent>;
  ionCancel!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionCancel', 'ionFocus', 'ionBlur']);
  }
}
proxyMethods(GicSelect, ['open']);
proxyInputs(GicSelect, ['cancelText', 'compareWith', 'disabled', 'interface', 'interfaceOptions', 'mode', 'multiple', 'name', 'okText', 'placeholder', 'searchBar', 'selectedText', 'useVirtualScroll', 'value']);

export declare interface GicSelectOption extends Components.GicSelectOption {}
@Component({ selector: 'gic-select-option', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>', inputs: ['disabled', 'selected', 'value'] })
export class GicSelectOption {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(GicSelectOption, ['disabled', 'selected', 'value']);
