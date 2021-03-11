import { attachShadow, createEvent, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
import { p as popoverController, b as actionSheetController, a as alertController, l as findItemLabel, m as getAriaLabel, n as renderHiddenInput } from './overlays.js';
import { g as getGicMode } from './gic-global.js';
import { h as hostContext } from './theme.js';

const watchForOptions = (containerEl, tagName, onChange) => {
  /* tslint:disable-next-line */
  if (typeof MutationObserver === 'undefined') {
    return;
  }
  const mutation = new MutationObserver(mutationList => {
    onChange(getSelectedOption(mutationList, tagName));
  });
  mutation.observe(containerEl, { childList: true, subtree: true });
  return mutation;
};
const getSelectedOption = (mutationList, tagName) => {
  let newOption;
  mutationList.forEach(mut => {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < mut.addedNodes.length; i++) {
      newOption = findCheckedOption(mut.addedNodes[i], tagName) || newOption;
    }
  });
  return newOption;
};
const findCheckedOption = (el, tagName) => {
  if (el.nodeType !== 1) {
    return undefined;
  }
  const options = (el.tagName === tagName.toUpperCase()) ?
    [el] :
    Array.from(el.querySelectorAll(tagName));
  return options.find((o) => o.value === el.value);
};

const selectIosCss = ":host{padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);display:-ms-flexbox;display:flex;position:relative;font-family:var(--ion-font-family, inherit);overflow:hidden;z-index:2}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}:host(.in-item){position:static;max-width:45%}:host(.select-disabled){opacity:0.4;pointer-events:none}:host(.ion-focused) button{border:2px solid #5e9ed6}.select-placeholder{color:currentColor;opacity:0.33}button{left:0;top:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;position:absolute;width:100%;height:100%;border:0;background:transparent;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none}[dir=rtl] button,:host-context([dir=rtl]) button{left:unset;right:unset;right:0}button::-moz-focus-inner{border:0}.select-icon{position:relative}.select-text{-ms-flex:1;flex:1;min-width:16px;font-size:inherit;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.select-icon-inner{left:5px;top:50%;margin-top:-3px;position:absolute;width:0;height:0;border-top:5px solid;border-right:5px solid transparent;border-left:5px solid transparent;color:currentColor;opacity:0.33;pointer-events:none}[dir=rtl] .select-icon-inner,:host-context([dir=rtl]) .select-icon-inner{left:unset;right:unset;right:5px}:host{--padding-top:10px;--padding-end:10px;--padding-bottom:10px;--padding-start:20px}.select-icon{width:12px;height:18px}";

const selectMdCss = ":host{padding-left:var(--padding-start);padding-right:var(--padding-end);padding-top:var(--padding-top);padding-bottom:var(--padding-bottom);display:-ms-flexbox;display:flex;position:relative;font-family:var(--ion-font-family, inherit);overflow:hidden;z-index:2}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){:host{padding-left:unset;padding-right:unset;-webkit-padding-start:var(--padding-start);padding-inline-start:var(--padding-start);-webkit-padding-end:var(--padding-end);padding-inline-end:var(--padding-end)}}:host(.in-item){position:static;max-width:45%}:host(.select-disabled){opacity:0.4;pointer-events:none}:host(.ion-focused) button{border:2px solid #5e9ed6}.select-placeholder{color:currentColor;opacity:0.33}button{left:0;top:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;position:absolute;width:100%;height:100%;border:0;background:transparent;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none;outline:none}[dir=rtl] button,:host-context([dir=rtl]) button{left:unset;right:unset;right:0}button::-moz-focus-inner{border:0}.select-icon{position:relative}.select-text{-ms-flex:1;flex:1;min-width:16px;font-size:inherit;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.select-icon-inner{left:5px;top:50%;margin-top:-3px;position:absolute;width:0;height:0;border-top:5px solid;border-right:5px solid transparent;border-left:5px solid transparent;color:currentColor;opacity:0.33;pointer-events:none}[dir=rtl] .select-icon-inner,:host-context([dir=rtl]) .select-icon-inner{left:unset;right:unset;right:5px}:host{--padding-top:10px;--padding-end:0;--padding-bottom:11px;--padding-start:16px}.select-icon{width:19px;height:19px}";

const Select = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
    this.ionChange = createEvent(this, "ionChange", 7);
    this.ionCancel = createEvent(this, "ionCancel", 7);
    this.ionFocus = createEvent(this, "ionFocus", 7);
    this.ionBlur = createEvent(this, "ionBlur", 7);
    this.ionStyle = createEvent(this, "ionStyle", 7);
    this.inputId = `ion-sel-${selectIds++}`;
    this.didInit = false;
    this.isExpanded = false;
    /**
     * If `true`, the user cannot interact with the select.
     */
    this.disabled = false;
    /**
     * The text to display on the cancel button.
     */
    this.cancelText = 'Cancel';
    /**
     * The text to display on the ok button.
     */
    this.okText = 'OK';
    /**
     * The name of the control, which is submitted with the form data.
     */
    this.name = this.inputId;
    /**
     * If `true`, the select can accept multiple values.
     */
    this.multiple = false;
    /**
     * The interface the select should use: `action-sheet`, `popover` or `alert`.
     */
    this.interface = 'alert';
    /**
     * Any additional options that the `alert`, `action-sheet` or `popover` interface
     * can take. See the [AlertController API docs](../../alert/AlertController/#create), the
     * [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) and the
     * [PopoverController API docs](../../popover/PopoverController/#create) for the
     * create options for each interface.
     */
    this.interfaceOptions = {};
    /**
     * If `true`, the select will show a searchbar for radios and checkboxes
     */
    this.searchBar = true;
    /**
     * If `true`, the buttons list will be rendered in a virtual scroll
     */
    this.useVirtualScroll = true;
    this.onClick = (ev) => {
      this.setFocus();
      this.open(ev);
    };
    this.onFocus = () => {
      this.ionFocus.emit();
    };
    this.onBlur = () => {
      this.ionBlur.emit();
    };
  }
  disabledChanged() {
    this.emitStyle();
  }
  valueChanged() {
    this.emitStyle();
    if (this.didInit) {
      this.ionChange.emit({
        value: this.value,
      });
    }
  }
  async connectedCallback() {
    this.updateOverlayOptions();
    this.emitStyle();
    this.mutationO = watchForOptions(this.el, 'gic-select-option', async () => {
      this.updateOverlayOptions();
    });
  }
  disconnectedCallback() {
    if (this.mutationO) {
      this.mutationO.disconnect();
      this.mutationO = undefined;
    }
  }
  componentDidLoad() {
    this.didInit = true;
  }
  /**
   * Opens the select overlay, it could be an alert, action-sheet or popover,
   * based in `gic-select` settings.
   */
  async open(ev) {
    if (this.disabled || this.isExpanded) {
      return undefined;
    }
    const overlay = this.overlay = await this.createOverlay(ev);
    this.isExpanded = true;
    overlay.onDidDismiss().then(() => {
      this.overlay = undefined;
      this.isExpanded = false;
      this.setFocus();
    });
    await overlay.present();
    return overlay;
  }
  createOverlay(ev) {
    let selectInterface = this.interface;
    if ((selectInterface === 'action-sheet' || selectInterface === 'popover') && this.multiple) {
      console.warn(`Select interface cannot be "${selectInterface}" with a multi-value select. Using the "alert" interface instead.`);
      selectInterface = 'alert';
    }
    if (selectInterface === 'popover' && !ev) {
      console.warn('Select interface cannot be a "popover" without passing an event. Using the "alert" interface instead.');
      selectInterface = 'alert';
    }
    if (selectInterface === 'popover') {
      return this.openPopover(ev);
    }
    if (selectInterface === 'action-sheet') {
      return this.openActionSheet();
    }
    return this.openAlert();
  }
  updateOverlayOptions() {
    if (!this.overlay) {
      return;
    }
    const overlay = this.overlay;
    if (!overlay) {
      return;
    }
    const childOpts = this.childOpts;
    const value = this.value;
    switch (this.interface) {
      case 'action-sheet':
        overlay.buttons = this.createActionSheetButtons(childOpts, value);
        break;
      case 'popover':
        const popover = overlay.querySelector('gic-select-popover');
        if (popover) {
          popover.options = this.createPopoverOptions(childOpts, value);
        }
        break;
      default:
        const inputType = (this.multiple ? 'checkbox' : 'radio');
        overlay.inputs = this.createAlertInputs(this.childOpts, inputType, value);
        break;
    }
  }
  createActionSheetButtons(data, selectValue) {
    const actionSheetButtons = data.map(option => {
      const value = getOptionValue(option);
      // Remove hydrated before copying over classes
      const copyClasses = Array.from(option.classList).filter(cls => cls !== 'hydrated').join(' ');
      const optClass = `${OPTION_CLASS} ${copyClasses}`;
      return {
        role: (isOptionSelected(value, selectValue, this.compareWith) ? 'selected' : ''),
        text: option.textContent,
        cssClass: optClass,
        handler: () => {
          this.value = value;
        }
      };
    });
    // Add "cancel" button
    actionSheetButtons.push({
      text: this.cancelText,
      role: 'cancel',
      handler: () => {
        this.ionCancel.emit();
      }
    });
    return actionSheetButtons;
  }
  createAlertInputs(data, inputType, selectValue) {
    const alertInputs = data.map(option => {
      const value = getOptionValue(option);
      // Remove hydrated before copying over classes
      const copyClasses = Array.from(option.classList).filter(cls => cls !== 'hydrated').join(' ');
      const optClass = `${OPTION_CLASS} ${copyClasses}`;
      return {
        type: inputType,
        cssClass: optClass,
        label: option.textContent || '',
        value,
        checked: isOptionSelected(value, selectValue, this.compareWith),
        disabled: option.disabled
      };
    });
    return alertInputs;
  }
  createPopoverOptions(data, selectValue) {
    const popoverOptions = data.map(option => {
      const value = getOptionValue(option);
      // Remove hydrated before copying over classes
      const copyClasses = Array.from(option.classList).filter(cls => cls !== 'hydrated').join(' ');
      const optClass = `${OPTION_CLASS} ${copyClasses}`;
      return {
        text: option.textContent || '',
        cssClass: optClass,
        value,
        checked: isOptionSelected(value, selectValue, this.compareWith),
        disabled: option.disabled,
        handler: () => {
          this.value = value;
          this.close();
        }
      };
    });
    return popoverOptions;
  }
  async openPopover(ev) {
    const interfaceOptions = this.interfaceOptions;
    const mode = getGicMode(this);
    const value = this.value;
    const searchBar = this.searchBar;
    const useVirtualScroll = this.useVirtualScroll;
    const popoverOpts = Object.assign(Object.assign({ mode }, interfaceOptions), { component: 'gic-select-popover', cssClass: ['select-popover', interfaceOptions.cssClass], event: ev, componentProps: {
        header: interfaceOptions.header,
        subHeader: interfaceOptions.subHeader,
        message: interfaceOptions.message,
        value,
        searchBar,
        useVirtualScroll,
        options: this.createPopoverOptions(this.childOpts, value)
      } });
    return popoverController.create(popoverOpts);
  }
  async openActionSheet() {
    const mode = getGicMode(this);
    const interfaceOptions = this.interfaceOptions;
    const actionSheetOpts = Object.assign(Object.assign({ mode }, interfaceOptions), { buttons: this.createActionSheetButtons(this.childOpts, this.value), cssClass: ['select-action-sheet', interfaceOptions.cssClass] });
    return actionSheetController.create(actionSheetOpts);
  }
  async openAlert() {
    const label = this.getLabel();
    const labelText = (label) ? label.textContent : null;
    const interfaceOptions = this.interfaceOptions;
    const inputType = (this.multiple ? 'checkbox' : 'radio');
    const mode = getGicMode(this);
    const alertOpts = Object.assign(Object.assign({ mode }, interfaceOptions), { header: interfaceOptions.header ? interfaceOptions.header : labelText, inputs: this.createAlertInputs(this.childOpts, inputType, this.value), searchBar: this.searchBar, useVirtualScroll: this.useVirtualScroll, buttons: [
        {
          text: this.cancelText,
          role: 'cancel',
          handler: () => {
            this.ionCancel.emit();
          }
        },
        {
          text: this.okText,
          handler: (selectedValues) => {
            this.value = selectedValues;
          }
        }
      ], cssClass: ['select-alert', interfaceOptions.cssClass,
        (this.multiple ? 'multiple-select-alert' : 'single-select-alert')] });
    return alertController.create(alertOpts);
  }
  /**
   * Close the select interface.
   */
  close() {
    // TODO check !this.overlay || !this.isFocus()
    if (!this.overlay) {
      return Promise.resolve(false);
    }
    return this.overlay.dismiss();
  }
  getLabel() {
    return findItemLabel(this.el);
  }
  hasValue() {
    return this.getText() !== '';
  }
  get childOpts() {
    return Array.from(this.el.querySelectorAll('gic-select-option'));
  }
  getText() {
    const selectedText = this.selectedText;
    if (selectedText != null && selectedText !== '') {
      return selectedText;
    }
    return generateText(this.childOpts, this.value, this.compareWith);
  }
  setFocus() {
    if (this.focusEl) {
      this.focusEl.focus();
    }
  }
  emitStyle() {
    this.ionStyle.emit({
      'interactive': true,
      'select': true,
      'has-placeholder': this.placeholder != null,
      'has-value': this.hasValue(),
      'interactive-disabled': this.disabled,
      'select-disabled': this.disabled
    });
  }
  render() {
    const { disabled, el, inputId, isExpanded, name, placeholder, value } = this;
    const mode = getGicMode(this);
    const { labelText, labelId } = getAriaLabel(el, inputId);
    renderHiddenInput(true, this.el, name, parseValue(value), this.disabled);
    const displayValue = this.getText();
    let addPlaceholderClass = false;
    let selectText = displayValue;
    if (selectText === '' && placeholder != null) {
      selectText = placeholder;
      addPlaceholderClass = true;
    }
    const selectTextClasses = {
      'select-text': true,
      'select-placeholder': addPlaceholderClass
    };
    const textPart = addPlaceholderClass ? 'placeholder' : 'text';
    const displayLabel = labelText !== undefined
      ? (selectText !== '' ? `${selectText}, ${labelText}` : labelText)
      : selectText;
    return (h(Host, { onClick: this.onClick, role: "button", "aria-haspopup": "listbox", "aria-disabled": disabled ? 'true' : null, "aria-label": displayLabel, class: {
        [mode]: true,
        'in-item': hostContext('ion-item', el),
        'select-disabled': disabled,
        'select-expanded': isExpanded
      } }, h("div", { "aria-hidden": "true", class: selectTextClasses, part: textPart }, selectText), h("div", { class: "select-icon", role: "presentation", part: "icon" }, h("div", { class: "select-icon-inner" })), h("label", { id: labelId }, displayLabel), h("button", { type: "button", disabled: disabled, id: inputId, "aria-labelledby": labelId, "aria-haspopup": "listbox", "aria-expanded": `${isExpanded}`, onFocus: this.onFocus, onBlur: this.onBlur, ref: (focusEl => this.focusEl = focusEl) })));
  }
  get el() { return this; }
  static get watchers() { return {
    "disabled": ["disabledChanged"],
    "placeholder": ["disabledChanged"],
    "value": ["valueChanged"]
  }; }
  static get style() { return {
    ios: selectIosCss,
    md: selectMdCss
  }; }
};
const isOptionSelected = (currentValue, compareValue, compareWith) => {
  if (currentValue === undefined) {
    return false;
  }
  if (Array.isArray(currentValue)) {
    return currentValue.some(val => compareOptions(val, compareValue, compareWith));
  }
  else {
    return compareOptions(currentValue, compareValue, compareWith);
  }
};
const getOptionValue = (el) => {
  const value = el.value;
  return (value === undefined)
    ? el.textContent || ''
    : value;
};
const parseValue = (value) => {
  if (value == null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.join(',');
  }
  return value.toString();
};
const compareOptions = (currentValue, compareValue, compareWith) => {
  if (typeof compareWith === 'function') {
    return compareWith(currentValue, compareValue);
  }
  else if (typeof compareWith === 'string') {
    return currentValue[compareWith] === compareValue[compareWith];
  }
  else {
    return currentValue === compareValue;
  }
};
const generateText = (opts, value, compareWith) => {
  if (value === undefined) {
    return '';
  }
  if (Array.isArray(value)) {
    return value
      .map(v => textForValue(opts, v, compareWith))
      .filter(opt => opt !== null)
      .join(', ');
  }
  else {
    return textForValue(opts, value, compareWith) || '';
  }
};
const textForValue = (opts, value, compareWith) => {
  const selectOpt = opts.find(opt => {
    return compareOptions(opt.value, value, compareWith);
  });
  return selectOpt
    ? selectOpt.textContent
    : null;
};
let selectIds = 0;
const OPTION_CLASS = 'select-interface-option';

const GicSelect = /*@__PURE__*/proxyCustomElement(Select, [33,"gic-select",{"disabled":[4],"cancelText":[1,"cancel-text"],"okText":[1,"ok-text"],"placeholder":[1],"name":[1],"selectedText":[1,"selected-text"],"multiple":[4],"interface":[1],"interfaceOptions":[8,"interface-options"],"compareWith":[1,"compare-with"],"searchBar":[4,"search-bar"],"useVirtualScroll":[4,"use-virtual-scroll"],"value":[1032],"isExpanded":[32]}]);

export { GicSelect };
