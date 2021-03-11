import { h, Host, proxyCustomElement } from '@stencil/core/internal/client';
import { k as safeCall } from './overlays.js';
import { g as getGicMode } from './gic-global.js';

const selectPopoverCss = ".sc-gic-select-popover-h ion-list.sc-gic-select-popover{margin-left:0;margin-right:0;margin-top:-1px;margin-bottom:-1px}.sc-gic-select-popover-h ion-list-header.sc-gic-select-popover,.sc-gic-select-popover-h ion-label.sc-gic-select-popover{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0}.select-popover-vs.sc-gic-select-popover,.select-popover-vs.sc-gic-select-popover ion-virtual-scroll.sc-gic-select-popover{min-height:240px}";

const SelectPopover = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    /** Array of options for the popover */
    this.options = [];
    /**
     * If `true`, the select popover will show a searchbar for radios and checkboxes
     */
    this.searchBar = false;
    /**
     * If `true`, the select popover will use a virtual scroll to render radios and checkboxes
     */
    this.useVirtualScroll = false;
    /**
     * The current search string
     */
    this.searchString = '';
    this.processedOptions = [];
    this.onSearchChange = (ev) => {
      const input = ev.target;
      if (input) {
        this.searchString = typeof input.value === 'string' ? input.value : '';
      }
    };
    this.resetSearch = () => {
      this.searchString = '';
    };
  }
  onSelect(ev) {
    const option = this.options.find(o => o.value === ev.target.value);
    if (option) {
      safeCall(option.handler);
    }
  }
  searchStringChanged() {
    const options = this.options;
    const search = (this.searchString || '').trim();
    const regex = new RegExp(search, 'i');
    this.processedOptions = search.length === 0
      ? options
      : options.filter(o => regex.test(o.text || ''));
  }
  componentWillLoad() {
    this.searchStringChanged();
  }
  renderSearchBar() {
    if (!this.searchBar || this.options.length === 0) {
      return null;
    }
    const searchString = this.searchString || '';
    return (h("ion-item", null, h("ion-icon", { slot: "start", icon: "search" }), h("ion-input", { value: searchString, onIonChange: this.onSearchChange }), h("ion-button", { slot: "end", fill: "clear", onClick: this.resetSearch }, h("ion-icon", { slot: "icon-only", icon: "close" }))));
  }
  renderRadioNode(el, cell) {
    const option = cell.value;
    if (el) {
      const label = el.querySelector('ion-label');
      label.textContent = `${option.text}`;
      const radio = el.querySelector('ion-radio');
      radio.setAttribute('value', `${option.value}`);
      if (option.checked) {
        radio.setAttribute('checked', 'checked');
      }
      else {
        radio.removeAttribute('checked');
      }
      if (option.disabled) {
        radio.setAttribute('disabled', 'disabled');
      }
      else {
        radio.removeAttribute('disabled');
      }
    }
    return el;
  }
  render() {
    const mode = getGicMode(this);
    const hydClass = 'sc-gic-alert-' + mode;
    const radioTemplate = ``
      + `<ion-item class="${hydClass}">`
      + `<ion-label class="${hydClass}"></ion-label>`
      + `<ion-radio class="${hydClass}"></ion-radio>`
      + `</ion-item>`;
    const checkedOption = this.options.find(o => o.checked);
    const checkedValue = checkedOption ? checkedOption.value : undefined;
    return (h(Host, { class: mode }, h("ion-list", null, this.header !== undefined && h("ion-list-header", null, this.header), (this.subHeader !== undefined || this.message !== undefined) &&
      h("ion-item", null, h("ion-label", { class: "ion-text-wrap" }, this.subHeader !== undefined && h("h3", null, this.subHeader), this.message !== undefined && h("p", null, this.message))), this.searchBar && this.renderSearchBar(), h("ion-radio-group", { value: checkedValue }, this.useVirtualScroll
      ?
        h("ion-content", { class: "select-popover-vs" }, h("ion-virtual-scroll", { items: this.processedOptions, nodeRender: (el, cell) => this.renderRadioNode(el, cell) }, h("template", { innerHTML: radioTemplate })))
      : this.processedOptions.map(option => h("ion-item", null, h("ion-label", null, option.text), h("ion-radio", { value: option.value, disabled: option.disabled })))))));
  }
  static get watchers() { return {
    "searchString": ["searchStringChanged"]
  }; }
  static get style() { return selectPopoverCss; }
};

const GicSelectPopover = /*@__PURE__*/proxyCustomElement(SelectPopover, [2,"gic-select-popover",{"header":[1],"subHeader":[1,"sub-header"],"message":[1],"options":[16],"searchBar":[4,"search-bar"],"useVirtualScroll":[4,"use-virtual-scroll"],"searchString":[1025,"search-string"]},[[0,"ionSelect","onSelect"]]]);

export { GicSelectPopover };
