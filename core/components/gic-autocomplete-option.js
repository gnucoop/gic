import { attachShadow, createEvent, h, Host, proxyCustomElement } from '@stencil/core/internal/client';

const autocompleteOptionCss = "";

const SelectOption = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
    this.ionAutocompleteOptionDidLoad = createEvent(this, "ionAutocompleteOptionDidLoad", 7);
    this.ionAutocompleteOptionDidUnload = createEvent(this, "ionAutocompleteOptionDidUnload", 7);
    this.optId = `gic-acopt-${autocompleteOptionIds++}`;
  }
  componentWillLoad() {
    if (this.value === undefined) {
      this.value = this.el.textContent || '';
    }
  }
  componentDidLoad() {
    this.ionAutocompleteOptionDidLoad.emit();
  }
  disconnectedCallback() {
    this.ionAutocompleteOptionDidUnload.emit();
  }
  hostData() {
    return {
      'role': 'option',
      'id': this.optId
    };
  }
  get el() { return this; }
  static get style() { return autocompleteOptionCss; }
  render() { return h(Host, this.hostData()); }
};
let autocompleteOptionIds = 0;

const GicAutocompleteOption = /*@__PURE__*/proxyCustomElement(SelectOption, [1,"gic-autocomplete-option",{"value":[1032]}]);

export { GicAutocompleteOption };
