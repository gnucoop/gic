/* tslint:disable */
/* auto-generated angular directive proxies */
import { Component, ElementRef, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { proxyInputs, proxyMethods, proxyOutputs } from './proxies-utils';

type StencilComponents<T extends keyof StencilElementInterfaces> = StencilElementInterfaces[T];

export declare interface GicAutocomplete extends StencilComponents<'GicAutocomplete'> {}
@Component({ selector: 'gic-autocomplete', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'value', 'placeholder', 'interfaceOptions'] })
export class GicAutocomplete {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(GicAutocomplete, ['mode', 'value', 'placeholder', 'interfaceOptions']);

export declare interface GicAutocompleteOption extends StencilComponents<'GicAutocompleteOption'> {}
@Component({ selector: 'gic-autocomplete-option', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['value'] })
export class GicAutocompleteOption {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(GicAutocompleteOption, ['value']);

export declare interface GicSelect extends StencilComponents<'GicSelect'> {}
@Component({ selector: 'gic-select', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['mode', 'disabled', 'cancelText', 'okText', 'placeholder', 'name', 'selectedText', 'multiple', 'interface', 'interfaceOptions', 'compareWith', 'value'] })
export class GicSelect {
  ionChange!: EventEmitter<CustomEvent>;
  ionCancel!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ['ionChange', 'ionCancel', 'ionFocus', 'ionBlur']);
  }
}
proxyMethods(GicSelect, ['open']);
proxyInputs(GicSelect, ['mode', 'disabled', 'cancelText', 'okText', 'placeholder', 'name', 'selectedText', 'multiple', 'interface', 'interfaceOptions', 'compareWith', 'value']);

export declare interface GicSelectOption extends StencilComponents<'GicSelectOption'> {}
@Component({ selector: 'gic-select-option', changeDetection: 0, template: '<ng-content></ng-content>', inputs: ['disabled', 'selected', 'value'] })
export class GicSelectOption {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef) {
    c.detach();
    this.el = r.nativeElement;
  }
}
proxyInputs(GicSelectOption, ['disabled', 'selected', 'value']);
