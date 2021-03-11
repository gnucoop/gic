import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';
import { g as getGicMode } from './gic-global.js';

const autocompletePopoverCss = ".sc-gic-autocomplete-popover-h ion-list.sc-gic-autocomplete-popover{margin-left:0;margin-right:0;margin-top:-1px;margin-bottom:-1px}.sc-gic-autocomplete-popover-h ion-list-header.sc-gic-autocomplete-popover,.sc-gic-autocomplete-popover-h ion-label.sc-gic-autocomplete-popover{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}";

const AutocompletePopover = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    /** Array of options for the popover */
    this.options = [];
    this.onClick = (ev) => {
      const option = this.options.find(o => o.text === ev.target.textContent);
      if (option && option.handler) {
        option.handler();
      }
    };
  }
  render() {
    const mode = getGicMode(this);
    return (h(Host, { class: mode }, h("ion-list", null, this.options.map(option => h("ion-item", { onClick: this.onClick }, h("ion-label", null, option.text))))));
  }
  static get style() { return autocompletePopoverCss; }
};

const GicAutocompletePopover = /*@__PURE__*/proxyCustomElement(AutocompletePopover, [2,"gic-autocomplete-popover",{"options":[1040],"searchStr":[1025,"search-str"]}]);

export { GicAutocompletePopover };
