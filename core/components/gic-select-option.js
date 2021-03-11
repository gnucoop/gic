import { attachShadow, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
import { g as getGicMode } from './gic-global.js';

const selectOptionCss = ":host{display:none}";

const SelectOption = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
    this.inputId = `gic-selopt-${selectOptionIds++}`;
    /**
     * If `true`, the user cannot interact with the select option.
     */
    this.disabled = false;
  }
  render() {
    return (h(Host, { role: "option", id: this.inputId, class: getGicMode(this) }));
  }
  get el() { return this; }
  static get style() { return selectOptionCss; }
};
let selectOptionIds = 0;

const GicSelectOption = /*@__PURE__*/proxyCustomElement(SelectOption, [1,"gic-select-option",{"disabled":[4],"value":[8]}]);

export { GicSelectOption };
