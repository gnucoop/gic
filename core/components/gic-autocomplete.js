import { attachShadow, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
import { p as popoverController } from './overlays.js';
import { g as getGicMode } from './gic-global.js';

const autocompleteIosCss = "";

const autocompleteMdCss = "";

const AutoComplete = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
    this.value = null;
    /**
     * Any additional options that the `popover` interface
     * can take. See the [PopoverController API docs](../../popover/PopoverController/#create)
     * for the create options for each interface.
     */
    this.interfaceOptions = {};
    this.popoverId = `gic-acpopover-${autocompleteId++}`;
    this.childOpts = [];
    this.options = [];
    this.isOpen = false;
    this.searchValue = '';
    this.onIonFocus = (ev) => {
      this.showHints(ev);
    };
    this.onInput = (ev) => {
      const input = ev.target;
      if (input) {
        this.searchValue = typeof input.value === 'string' ? input.value : '';
        if (this.options.indexOf(this.searchValue || '') === -1) {
          this.value = null;
        }
        this.updateOptionsList();
        this.showHints();
      }
    };
  }
  async componentDidLoad() {
    await this.loadOptions();
    this.updateOptionsList();
  }
  /**
   * Close the autocomplete popover.
   */
  close() {
    // TODO check !this.overlay || !this.isFocus()
    if (!this.overlay) {
      return Promise.resolve(false);
    }
    return this.overlay.dismiss();
  }
  updateOptionsList() {
    const options = (this.childOpts || []).map(o => o.value);
    const searchValue = (this.searchValue || '').trim();
    const regex = new RegExp('^' + searchValue, 'i');
    this.options = searchValue.length > 0 ? options.filter(o => regex.test(o)) : options;
  }
  createPopoverOptions(data) {
    return data.map(o => {
      return {
        text: o,
        handler: () => {
          this.value = o;
          this.searchValue = '';
          this.close();
        }
      };
    });
  }
  async loadOptions() {
    this.childOpts = await Promise.all(Array.from(this.el.querySelectorAll('gic-autocomplete-option')).map(o => o.componentOnReady()));
  }
  async showHints(ev) {
    if (ev !== undefined) {
      this.evt = ev;
    }
    if (this.options.indexOf(this.value || '') !== -1) {
      return;
    }
    if (this.overlay === undefined && !this.isOpen) {
      this.isOpen = true;
      this.overlay = await this.createOverlay(ev || this.evt);
      this.overlay.onDidDismiss().then(() => {
        this.overlay = undefined;
        this.isOpen = false;
      });
      this.overlay.present();
    }
    if (this.overlay === undefined) {
      return;
    }
    const popovers = this.overlay.getElementsByTagName('gic-autocomplete-popover');
    if (popovers.length > 0) {
      const popover = popovers.item(0);
      popover.options = this.createPopoverOptions(this.options);
    }
  }
  createOverlay(ev) {
    const mode = getGicMode(this);
    const interfaceOptions = this.interfaceOptions;
    const popoverOpts = Object.assign(Object.assign({ mode }, interfaceOptions), { showBackdrop: false, backdropDismiss: false, translucent: false, animated: false, component: 'gic-autocomplete-popover', cssClass: ['select-popover', interfaceOptions.cssClass], event: ev, id: this.popoverId, componentProps: {
        options: this.createPopoverOptions(this.options)
      } });
    return popoverController.create(popoverOpts);
  }
  render() {
    const mode = getGicMode(this);
    const value = this.value || '';
    return (h(Host, { class: {
        [mode]: true,
      } }, h("ion-input", { value: value, placeholder: this.placeholder, onIonFocus: this.onIonFocus, onIonChange: this.onInput })));
  }
  get el() { return this; }
  static get style() { return {
    ios: autocompleteIosCss,
    md: autocompleteMdCss
  }; }
};
let autocompleteId = 0;

const GicAutocomplete = /*@__PURE__*/proxyCustomElement(AutoComplete, [33,"gic-autocomplete",{"value":[1025],"placeholder":[1],"interfaceOptions":[8,"interface-options"]}]);

export { GicAutocomplete };
