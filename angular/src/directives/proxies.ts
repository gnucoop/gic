/* eslint-disable */
/* tslint:disable */
/* auto-generated angular directive proxies */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, NgZone } from "@angular/core";
import { ProxyCmp, proxyOutputs } from "./proxies-utils";
import { Components } from "@gic/core";
export declare interface GicAutocomplete extends Components.GicAutocomplete {
}
@Component({ selector: "gic-autocomplete", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["interfaceOptions", "placeholder", "value"] })
export class GicAutocomplete {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
export declare interface GicAutocompleteOption extends Components.GicAutocompleteOption {
}
ProxyCmp({ inputs: ["interfaceOptions", "placeholder", "value"] })(GicAutocomplete);
@Component({ selector: "gic-autocomplete-option", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["value"] })
export class GicAutocompleteOption {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
ProxyCmp({ inputs: ["value"] })(GicAutocompleteOption);
export declare interface GicSelect extends Components.GicSelect {
}
@Component({ selector: "gic-select", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["cancelText", "compareWith", "disabled", "interface", "interfaceOptions", "multiple", "name", "okText", "placeholder", "searchBar", "selectedText", "useVirtualScroll", "value"] })
export class GicSelect {
  ionChange!: EventEmitter<CustomEvent>;
  ionCancel!: EventEmitter<CustomEvent>;
  ionFocus!: EventEmitter<CustomEvent>;
  ionBlur!: EventEmitter<CustomEvent>;
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
    proxyOutputs(this, this.el, ["ionChange", "ionCancel", "ionFocus", "ionBlur"]);
  }
}
ProxyCmp({ inputs: ["cancelText", "compareWith", "disabled", "interface", "interfaceOptions", "multiple", "name", "okText", "placeholder", "searchBar", "selectedText", "useVirtualScroll", "value"], "methods": ["open"] })(GicSelect);
export declare interface GicSelectOption extends Components.GicSelectOption {
}
@Component({ selector: "gic-select-option", changeDetection: ChangeDetectionStrategy.OnPush, template: "<ng-content></ng-content>", inputs: ["disabled", "value"] })
export class GicSelectOption {
  protected el: HTMLElement;
  constructor(c: ChangeDetectorRef, r: ElementRef, protected z: NgZone) {
    c.detach();
    this.el = r.nativeElement;
  }
}
ProxyCmp({ inputs: ["disabled", "value"] })(GicSelectOption);
