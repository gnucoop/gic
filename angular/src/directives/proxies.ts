/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from '@angular/core';
import { ProxyCmp, proxyOutputs } from './proxies-utils';

import { Components } from '@gic/core';

export declare interface GicAutocomplete extends Components.GicAutocomplete {}
@ProxyCmp({inputs: ['interfaceOptions', 'mode', 'placeholder', 'value']})
@Component({ selector: 'gic-autocomplete', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>', inputs: ['interfaceOptions', 'mode', 'placeholder', 'value'] })
export class GicAutocomplete {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

export declare interface GicAutocompleteOption extends Components.GicAutocompleteOption {}
@ProxyCmp({inputs: ['value']})
@Component({ selector: 'gic-autocomplete-option', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>', inputs: ['value'] })
export class GicAutocompleteOption {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}

export declare interface GicSelect extends Components.GicSelect {}
@ProxyCmp({inputs: ['cancelText', 'compareWith', 'disabled', 'interface', 'interfaceOptions', 'mode', 'multiple', 'name', 'okText', 'placeholder', 'searchBar', 'selectedText', 'useVirtualScroll', 'value'], 'methods': ['open']})
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

export declare interface GicSelectOption extends Components.GicSelectOption {}
@ProxyCmp({inputs: ['disabled', 'selected', 'value']})
@Component({ selector: 'gic-select-option', changeDetection: ChangeDetectionStrategy.OnPush, template: '<ng-content></ng-content>', inputs: ['disabled', 'selected', 'value'] })
export class GicSelectOption {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
