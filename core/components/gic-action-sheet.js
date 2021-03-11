import { createEvent, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
import { B as BACKDROP, i as isCancel, f as prepareOverlay, g as present, h as dismiss, j as eventMethod, k as safeCall } from './overlays.js';
import { g as getGicMode } from './gic-global.js';
import { g as getClassMap } from './theme.js';
import { c as createAnimation } from './animation.js';

/**
 * iOS Action Sheet Enter Animation
 */
const iosEnterAnimation = (baseEl) => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');
  wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'))
    .fromTo('transform', 'translateY(100%)', 'translateY(0%)');
  return baseAnimation.addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};

/**
 * iOS Action Sheet Leave Animation
 */
const iosLeaveAnimation = (baseEl) => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 'var(--backdrop-opacity)', 0);
  wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'))
    .fromTo('transform', 'translateY(0%)', 'translateY(100%)');
  return baseAnimation.addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(450)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};

/**
 * MD Action Sheet Enter Animation
 */
const mdEnterAnimation = (baseEl) => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');
  wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'))
    .fromTo('transform', 'translateY(100%)', 'translateY(0%)');
  return baseAnimation.addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(400)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};

/**
 * MD Action Sheet Leave Animation
 */
const mdLeaveAnimation = (baseEl) => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 'var(--backdrop-opacity)', 0);
  wrapperAnimation.addElement(baseEl.querySelector('.action-sheet-wrapper'))
    .fromTo('transform', 'translateY(0%)', 'translateY(100%)');
  return baseAnimation.addElement(baseEl)
    .easing('cubic-bezier(.36,.66,.04,1)')
    .duration(450)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};

const actionSheetIosCss = ".sc-gic-action-sheet-ios-h{--color:initial;--min-width:auto;--width:100%;--max-width:500px;--min-height:auto;--height:100%;--max-height:100%;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;left:0;right:0;top:0;bottom:0;display:block;position:fixed;font-family:var(--ion-font-family, inherit);-ms-touch-action:none;touch-action:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1001}.overlay-hidden.sc-gic-action-sheet-ios-h{display:none}.action-sheet-wrapper.sc-gic-action-sheet-ios{left:0;right:0;bottom:0;margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;-webkit-transform:translate3d(0,  100%,  0);transform:translate3d(0,  100%,  0);display:block;position:absolute;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);z-index:10;pointer-events:none}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.action-sheet-wrapper.sc-gic-action-sheet-ios{margin-left:unset;margin-right:unset;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto}}.action-sheet-button.sc-gic-action-sheet-ios{width:100%;border:0;outline:none;font-family:inherit}.action-sheet-button.activated.sc-gic-action-sheet-ios{background:var(--background-activated)}.action-sheet-button-inner.sc-gic-action-sheet-ios{display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%}.action-sheet-container.sc-gic-action-sheet-ios{display:-ms-flexbox;display:flex;-ms-flex-flow:column;flex-flow:column;-ms-flex-pack:end;justify-content:flex-end;height:100%;max-height:100%}.action-sheet-group.sc-gic-action-sheet-ios{-ms-flex-negative:2;flex-shrink:2;overscroll-behavior-y:contain;overflow-y:scroll;-webkit-overflow-scrolling:touch;pointer-events:all;background:var(--background)}.action-sheet-group.sc-gic-action-sheet-ios::-webkit-scrollbar{display:none}.action-sheet-group-cancel.sc-gic-action-sheet-ios{-ms-flex-negative:0;flex-shrink:0;overflow:hidden}.action-sheet-selected.sc-gic-action-sheet-ios{background:var(--background-selected)}.action-sheet-group-vs.sc-gic-action-sheet-ios{min-height:20%}.sc-gic-action-sheet-ios-h{--background:var(--ion-overlay-background-color, var(--ion-color-step-100, #f9f9f9));--background-selected:var(--ion-background-color, #fff);--background-activated:rgba(var(--ion-text-color-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.08);text-align:center}.action-sheet-wrapper.sc-gic-action-sheet-ios{margin-left:auto;margin-right:auto;margin-top:var(--ion-safe-area-top, 0);margin-bottom:var(--ion-safe-area-bottom, 0)}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.action-sheet-wrapper.sc-gic-action-sheet-ios{margin-left:unset;margin-right:unset;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto}}.action-sheet-container.sc-gic-action-sheet-ios{padding-left:8px;padding-right:8px;padding-top:0;padding-bottom:0}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.action-sheet-container.sc-gic-action-sheet-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:8px;padding-inline-start:8px;-webkit-padding-end:8px;padding-inline-end:8px}}.action-sheet-group.sc-gic-action-sheet-ios{border-radius:13px;margin-bottom:8px;overflow:hidden}.action-sheet-group.sc-gic-action-sheet-ios:first-child{margin-top:10px}.action-sheet-group.sc-gic-action-sheet-ios:last-child{margin-bottom:10px}@supports ((-webkit-backdrop-filter: blur(0)) or (backdrop-filter: blur(0))){.action-sheet-translucent.sc-gic-action-sheet-ios-h .action-sheet-group.sc-gic-action-sheet-ios{background-color:transparent;-webkit-backdrop-filter:saturate(280%) blur(20px);backdrop-filter:saturate(280%) blur(20px)}.action-sheet-translucent.sc-gic-action-sheet-ios-h .action-sheet-title.sc-gic-action-sheet-ios,.action-sheet-translucent.sc-gic-action-sheet-ios-h .action-sheet-button.sc-gic-action-sheet-ios{background-color:transparent;background-image:-webkit-gradient(linear, left bottom, left top, from(rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8)), to(rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8))), -webkit-gradient(linear, left bottom, left top, from(rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.4)), color-stop(50%, rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.4)), color-stop(50%, rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8)));background-image:linear-gradient(0deg, rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8), rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8) 100%), linear-gradient(0deg, rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.4), rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.4) 50%, rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.8) 50%);background-repeat:no-repeat;background-position:top, bottom;background-size:100% calc(100% - 1px), 100% 1px;-webkit-backdrop-filter:saturate(120%);backdrop-filter:saturate(120%)}.action-sheet-translucent.sc-gic-action-sheet-ios-h .action-sheet-button.activated.sc-gic-action-sheet-ios{background-color:rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.7);background-image:none}.action-sheet-translucent.sc-gic-action-sheet-ios-h .action-sheet-cancel.sc-gic-action-sheet-ios{background:var(--background-selected)}}.action-sheet-title.sc-gic-action-sheet-ios,.action-sheet-button.sc-gic-action-sheet-ios{background-color:transparent;background-image:-webkit-gradient(linear, left bottom, left top, from(rgba(var(--ion-text-color-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.08)), color-stop(50%, rgba(var(--ion-text-color-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.08)), color-stop(50%, transparent));background-image:linear-gradient(0deg, rgba(var(--ion-text-color-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.08), rgba(var(--ion-text-color-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.08) 50%, transparent 50%);background-repeat:no-repeat;background-position:bottom;background-size:100% 1px}.action-sheet-title.sc-gic-action-sheet-ios{padding-left:10px;padding-right:10px;padding-top:14px;padding-bottom:13px;color:var(--color, var(--ion-color-step-400, #999999));font-size:13px;font-weight:400;text-align:center}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.action-sheet-title.sc-gic-action-sheet-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:10px;padding-inline-start:10px;-webkit-padding-end:10px;padding-inline-end:10px}}.action-sheet-sub-title.sc-gic-action-sheet-ios{padding-left:0;padding-right:0;padding-top:15px;padding-bottom:0;font-size:12px}.action-sheet-button.sc-gic-action-sheet-ios{padding-left:18px;padding-right:18px;padding-top:18px;padding-bottom:18px;height:56px;color:var(--color, ion-color(primary, base));font-size:20px;contain:strict}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.action-sheet-button.sc-gic-action-sheet-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:18px;padding-inline-start:18px;-webkit-padding-end:18px;padding-inline-end:18px}}.action-sheet-button.sc-gic-action-sheet-ios .action-sheet-icon.sc-gic-action-sheet-ios{margin-right:0.1em;font-size:28px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.action-sheet-button.sc-gic-action-sheet-ios .action-sheet-icon.sc-gic-action-sheet-ios{margin-right:unset;-webkit-margin-end:0.1em;margin-inline-end:0.1em}}.action-sheet-button.sc-gic-action-sheet-ios:last-child{background-image:none}.action-sheet-selected.sc-gic-action-sheet-ios{background:var(--background-selected);font-weight:bold}.action-sheet-destructive.sc-gic-action-sheet-ios{color:ion-color(danger, base)}.action-sheet-cancel.sc-gic-action-sheet-ios{background:var(--background-selected);font-weight:600}.action-sheet-group-vs.sc-gic-action-sheet-ios{min-height:240px}";

const actionSheetMdCss = ".sc-gic-action-sheet-md-h{--color:initial;--min-width:auto;--width:100%;--max-width:500px;--min-height:auto;--height:100%;--max-height:100%;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;left:0;right:0;top:0;bottom:0;display:block;position:fixed;font-family:var(--ion-font-family, inherit);-ms-touch-action:none;touch-action:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1001}.overlay-hidden.sc-gic-action-sheet-md-h{display:none}.action-sheet-wrapper.sc-gic-action-sheet-md{left:0;right:0;bottom:0;margin-left:auto;margin-right:auto;margin-top:auto;margin-bottom:auto;-webkit-transform:translate3d(0,  100%,  0);transform:translate3d(0,  100%,  0);display:block;position:absolute;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);z-index:10;pointer-events:none}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.action-sheet-wrapper.sc-gic-action-sheet-md{margin-left:unset;margin-right:unset;-webkit-margin-start:auto;margin-inline-start:auto;-webkit-margin-end:auto;margin-inline-end:auto}}.action-sheet-button.sc-gic-action-sheet-md{width:100%;border:0;outline:none;font-family:inherit}.action-sheet-button.activated.sc-gic-action-sheet-md{background:var(--background-activated)}.action-sheet-button-inner.sc-gic-action-sheet-md{display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%}.action-sheet-container.sc-gic-action-sheet-md{display:-ms-flexbox;display:flex;-ms-flex-flow:column;flex-flow:column;-ms-flex-pack:end;justify-content:flex-end;height:100%;max-height:100%}.action-sheet-group.sc-gic-action-sheet-md{-ms-flex-negative:2;flex-shrink:2;overscroll-behavior-y:contain;overflow-y:scroll;-webkit-overflow-scrolling:touch;pointer-events:all;background:var(--background)}.action-sheet-group.sc-gic-action-sheet-md::-webkit-scrollbar{display:none}.action-sheet-group-cancel.sc-gic-action-sheet-md{-ms-flex-negative:0;flex-shrink:0;overflow:hidden}.action-sheet-selected.sc-gic-action-sheet-md{background:var(--background-selected)}.action-sheet-group-vs.sc-gic-action-sheet-md{min-height:20%}.sc-gic-action-sheet-md-h{--background:var(--ion-overlay-background-color, var(--ion-background-color, #fff));--background-selected:var(--background, );--background-activated:var(--background)}.action-sheet-title.sc-gic-action-sheet-md{padding-left:16px;padding-right:16px;padding-top:20px;padding-bottom:17px;min-height:60px;color:var(--color, rgba(var(--ion-text-color-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.54));font-size:16px;text-align:start}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.action-sheet-title.sc-gic-action-sheet-md{padding-left:unset;padding-right:unset;-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px}}.action-sheet-sub-title.sc-gic-action-sheet-md{padding-left:0;padding-right:0;padding-top:16px;padding-bottom:0;font-size:14px}.action-sheet-group.sc-gic-action-sheet-md:first-child{padding-top:0}.action-sheet-group.sc-gic-action-sheet-md:last-child{padding-bottom:0}.action-sheet-button.sc-gic-action-sheet-md{padding-left:16px;padding-right:16px;padding-top:0;padding-bottom:0;position:relative;height:52px;background:transparent;color:var(--color, var(--ion-color-step-850, #262626));font-size:16px;text-align:start;contain:strict;overflow:hidden}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.action-sheet-button.sc-gic-action-sheet-md{padding-left:unset;padding-right:unset;-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px}}.action-sheet-icon.sc-gic-action-sheet-md{padding-bottom:4px;margin-left:0;margin-right:32px;margin-top:0;margin-bottom:0;color:var(--color, rgba(var(--ion-text-color-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.54));font-size:24px}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.action-sheet-icon.sc-gic-action-sheet-md{margin-left:unset;margin-right:unset;-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:32px;margin-inline-end:32px}}.action-sheet-button-inner.sc-gic-action-sheet-md{-ms-flex-pack:start;justify-content:flex-start}.action-sheet-selected.sc-gic-action-sheet-md{font-weight:bold}.action-sheet-group-vs.sc-gic-action-sheet-md{min-height:240px}";

const ActionSheet = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.didPresent = createEvent(this, "ionActionSheetDidPresent", 7);
    this.willPresent = createEvent(this, "ionActionSheetWillPresent", 7);
    this.willDismiss = createEvent(this, "ionActionSheetWillDismiss", 7);
    this.didDismiss = createEvent(this, "ionActionSheetDidDismiss", 7);
    this.presented = false;
    this.mode = getGicMode(this);
    /**
     * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
     */
    this.keyboardClose = true;
    /**
     * An array of buttons for the action sheet.
     */
    this.buttons = [];
    /**
     * If `true`, the action sheet will be dismissed when the backdrop is clicked.
     */
    this.backdropDismiss = true;
    /**
     * If `true`, the action sheet will be translucent.
     * Only applies when the mode is `"ios"` and the device supports
     * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
     */
    this.translucent = false;
    /**
     * If `true`, the action sheet will animate.
     */
    this.animated = true;
    /**
     * If `true`, the action sheet will show a searchbar for radios and checkboxes
     */
    this.searchBar = false;
    /**
     * If `true`, the action sheet will use a virtual scroll to render radios and checkboxes
     */
    this.useVirtualScroll = false;
    /**
     * The current search string
     */
    this.searchString = '';
    this.processedButtons = [];
    this.onSearchChange = (ev) => {
      const input = ev.target;
      if (input) {
        this.searchString = typeof input.value === 'string' ? input.value : '';
      }
    };
    this.resetSearch = () => {
      this.searchString = '';
    };
    this.onBackdropTap = () => {
      this.dismiss(undefined, BACKDROP);
    };
    this.dispatchCancelHandler = (ev) => {
      const role = ev.detail.role;
      if (isCancel(role)) {
        const cancelButton = this.getButtons().find(b => b.role === 'cancel');
        this.callButtonHandler(cancelButton);
      }
    };
    prepareOverlay(this.el);
  }
  /**
   * Present the action sheet overlay after it has been created.
   */
  present() {
    return present(this, 'actionSheetEnter', iosEnterAnimation, mdEnterAnimation);
  }
  /**
   * Dismiss the action sheet overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the action sheet.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the action sheet.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   */
  dismiss(data, role) {
    return dismiss(this, data, role, 'actionSheetLeave', iosLeaveAnimation, mdLeaveAnimation);
  }
  /**
   * Returns a promise that resolves when the action sheet did dismiss.
   */
  onDidDismiss() {
    return eventMethod(this.el, 'ionActionSheetDidDismiss');
  }
  /**
   * Returns a promise that resolves when the action sheet will dismiss.
   *
   */
  onWillDismiss() {
    return eventMethod(this.el, 'ionActionSheetWillDismiss');
  }
  buttonsChanged() {
    const buttons = this.buttons;
    const search = (this.searchString || '').trim();
    const regex = new RegExp(search, 'i');
    this.processedButtons = search.length === 0 ? buttons : buttons
      .filter(b => {
      if (typeof b !== 'string' && b.role === 'cancel') {
        return true;
      }
      const buttonText = typeof b === 'string' ? b : b.text;
      return regex.test(buttonText || '');
    });
  }
  componentWillLoad() {
    this.buttonsChanged();
  }
  renderSearchBar() {
    if (!this.searchBar || this.buttons.length === 0) {
      return null;
    }
    const searchString = this.searchString || '';
    return (h("ion-item", null, h("ion-icon", { slot: "start", icon: "search" }), h("ion-input", { value: searchString, onIonChange: this.onSearchChange }), h("ion-button", { slot: "end", fill: "clear", onClick: this.resetSearch }, h("ion-icon", { slot: "icon-only", icon: "close" }))));
  }
  async buttonClick(button) {
    const role = button.role;
    if (isCancel(role)) {
      return this.dismiss(undefined, role);
    }
    const shouldDismiss = await this.callButtonHandler(button);
    if (shouldDismiss) {
      return this.dismiss(undefined, button.role);
    }
    return Promise.resolve();
  }
  async callButtonHandler(button) {
    if (button) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      const rtn = await safeCall(button.handler);
      if (rtn === false) {
        // if the return value of the handler is false then do not dismiss
        return false;
      }
    }
    return true;
  }
  getButtons() {
    return this.processedButtons.map(b => {
      return (typeof b === 'string')
        ? { text: b }
        : b;
    });
  }
  renderButtonNode(el, cell) {
    const mode = getGicMode(this);
    const hydClass = 'sc-gic-action-sheet-' + mode;
    const b = cell.value;
    if (el) {
      const cls = [...Object.keys(buttonClass(b)), hydClass].join(' ');
      el.setAttribute('class', cls);
      const inner = el.querySelector('.action-sheet-button-inner');
      inner.textContent = '';
      if (b.icon !== undefined) {
        inner.textContent += `<ion-icon icon="${b.icon}" lazy="false" class="action-sheet-icon ${hydClass}"></ion-icon>`;
      }
      inner.textContent += `${b.text}`;
      el.onclick = () => this.buttonClick(b);
    }
    return el;
  }
  render() {
    const mode = getGicMode(this);
    const allButtons = this.getButtons();
    const cancelButton = allButtons.find(b => b.role === 'cancel');
    const buttons = allButtons.filter(b => b.role !== 'cancel');
    const hydClass = 'sc-gic-action-sheet-' + mode;
    const buttonTemplate = ``
      + `<button type="button">`
      + `<span class="action-sheet-button-inner ${hydClass}"></span>`
      + (mode === 'md' ? `<ion-ripple-effect class="${hydClass}"></ion-ripple-effect>` : '')
      + `</button>`;
    return (h(Host, { role: "dialog", "aria-modal": "true", style: {
        zIndex: `${20000 + this.overlayIndex}`,
      }, class: Object.assign(Object.assign({ [mode]: true }, getClassMap(this.cssClass)), { 'action-sheet-translucent': this.translucent }), onIonActionSheetWillDismiss: this.dispatchCancelHandler, onIonBackdropTap: this.onBackdropTap }, h("ion-backdrop", { tappable: this.backdropDismiss }), h("div", { class: "action-sheet-wrapper", role: "dialog" }, h("div", { class: "action-sheet-container" }, h("div", { class: "action-sheet-group" }, this.header !== undefined &&
      h("div", { class: "action-sheet-title" }, this.header, this.subHeader && h("div", { class: "action-sheet-sub-title" }, this.subHeader)), this.searchBar && this.renderSearchBar(), this.useVirtualScroll
      ?
        h("ion-content", { class: "action-sheet-group-vs" }, h("ion-virtual-scroll", { items: buttons, nodeRender: (el, cell) => this.renderButtonNode(el, cell) }, h("template", { innerHTML: buttonTemplate })))
      : buttons.map(b => h("button", { type: "button", "ion-activatable": true, class: buttonClass(b), onClick: () => this.buttonClick(b) }, h("span", { class: "action-sheet-button-inner" }, b.icon && h("ion-icon", { icon: b.icon, lazy: false, class: "action-sheet-icon" }), b.text), mode === 'md' && h("ion-ripple-effect", null)))), cancelButton &&
      h("div", { class: "action-sheet-group action-sheet-group-cancel" }, h("button", { type: "button", class: buttonClass(cancelButton), onClick: () => this.buttonClick(cancelButton) }, h("span", { class: "action-sheet-button-inner" }, cancelButton.icon &&
        h("ion-icon", { icon: cancelButton.icon, lazy: false, class: "action-sheet-icon" }), cancelButton.text)))))));
  }
  get el() { return this; }
  static get watchers() { return {
    "buttons": ["buttonsChanged"],
    "searchString": ["buttonsChanged"]
  }; }
  static get style() { return {
    ios: actionSheetIosCss,
    md: actionSheetMdCss
  }; }
};
const buttonClass = (button) => {
  return Object.assign({ 'action-sheet-button': true, 'ion-activatable': true, [`action-sheet-${button.role}`]: button.role !== undefined }, getClassMap(button.cssClass));
};

const GicActionSheet = /*@__PURE__*/proxyCustomElement(ActionSheet, [34,"gic-action-sheet",{"overlayIndex":[2,"overlay-index"],"keyboardClose":[4,"keyboard-close"],"enterAnimation":[16],"leaveAnimation":[16],"buttons":[16],"cssClass":[1,"css-class"],"backdropDismiss":[4,"backdrop-dismiss"],"header":[1],"subHeader":[1,"sub-header"],"translucent":[4],"animated":[4],"searchBar":[4,"search-bar"],"useVirtualScroll":[4,"use-virtual-scroll"],"searchString":[1025,"search-string"]}]);

export { GicActionSheet };
