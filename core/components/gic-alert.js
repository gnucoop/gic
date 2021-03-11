import { createEvent, forceUpdate, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
import { B as BACKDROP, i as isCancel, f as prepareOverlay, g as present, h as dismiss, j as eventMethod, k as safeCall } from './overlays.js';
import { g as getGicMode } from './gic-global.js';
import { g as getClassMap } from './theme.js';
import { c as createAnimation } from './animation.js';

/**
 * Does a simple sanitization of all elements
 * in an untrusted string
 */
const sanitizeDOMString = (untrustedString) => {
  try {
    if (typeof untrustedString !== 'string' || untrustedString === '') {
      return untrustedString;
    }
    /**
     * Create a document fragment
     * separate from the main DOM,
     * create a div to do our work in
     */
    const documentFragment = document.createDocumentFragment();
    const workingDiv = document.createElement('div');
    documentFragment.appendChild(workingDiv);
    workingDiv.innerHTML = untrustedString;
    /**
     * Remove any elements
     * that are blocked
     */
    blockedTags.forEach(blockedTag => {
      const getElementsToRemove = documentFragment.querySelectorAll(blockedTag);
      for (let elementIndex = getElementsToRemove.length - 1; elementIndex >= 0; elementIndex--) {
        const element = getElementsToRemove[elementIndex];
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
        else {
          documentFragment.removeChild(element);
        }
        /**
         * We still need to sanitize
         * the children of this element
         * as they are left behind
         */
        const childElements = getElementChildren(element);
        /* tslint:disable-next-line */
        for (let childIndex = 0; childIndex < childElements.length; childIndex++) {
          sanitizeElement(childElements[childIndex]);
        }
      }
    });
    /**
     * Go through remaining elements and remove
     * non-allowed attribs
     */
    // IE does not support .children on document fragments, only .childNodes
    const dfChildren = getElementChildren(documentFragment);
    /* tslint:disable-next-line */
    for (let childIndex = 0; childIndex < dfChildren.length; childIndex++) {
      sanitizeElement(dfChildren[childIndex]);
    }
    // Append document fragment to div
    const fragmentDiv = document.createElement('div');
    fragmentDiv.appendChild(documentFragment);
    // First child is always the div we did our work in
    const getInnerDiv = fragmentDiv.querySelector('div');
    return (getInnerDiv !== null) ? getInnerDiv.innerHTML : fragmentDiv.innerHTML;
  }
  catch (err) {
    console.error(err);
    return '';
  }
};
/**
 * Clean up current element based on allowed attributes
 * and then recursively dig down into any child elements to
 * clean those up as well
 */
const sanitizeElement = (element) => {
  // IE uses childNodes, so ignore nodes that are not elements
  if (element.nodeType && element.nodeType !== 1) {
    return;
  }
  for (let i = element.attributes.length - 1; i >= 0; i--) {
    const attribute = element.attributes.item(i);
    const attributeName = attribute.name;
    // remove non-allowed attribs
    if (!allowedAttributes.includes(attributeName.toLowerCase())) {
      element.removeAttribute(attributeName);
      continue;
    }
    // clean up any allowed attribs
    // that attempt to do any JS funny-business
    const attributeValue = attribute.value;
    /* tslint:disable-next-line */
    if (attributeValue != null && attributeValue.toLowerCase().includes('javascript:')) {
      element.removeAttribute(attributeName);
    }
  }
  /**
   * Sanitize any nested children
   */
  const childElements = getElementChildren(element);
  /* tslint:disable-next-line */
  for (let i = 0; i < childElements.length; i++) {
    sanitizeElement(childElements[i]);
  }
};
/**
 * IE doesn't always support .children
 * so we revert to .childNodes instead
 */
const getElementChildren = (el) => {
  return (el.children != null) ? el.children : el.childNodes;
};
const allowedAttributes = ['class', 'id', 'href', 'src', 'name', 'slot'];
const blockedTags = ['script', 'style', 'iframe', 'meta', 'link', 'object', 'embed'];

/**
 * iOS Alert Enter Animation
 */
const iosEnterAnimation = (baseEl) => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');
  wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'))
    .keyframes([
    { offset: 0, opacity: '0.01', transform: 'scale(1.1)' },
    { offset: 1, opacity: '1', transform: 'scale(1)' }
  ]);
  return baseAnimation.addElement(baseEl)
    .easing('ease-in-out')
    .duration(200)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};

/**
 * iOS Alert Leave Animation
 */
const iosLeaveAnimation = (baseEl) => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 'var(--backdrop-opacity)', 0);
  wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'))
    .keyframes([
    { offset: 0, opacity: 0.99, transform: 'scale(1)' },
    { offset: 1, opacity: 0, transform: 'scale(0.9)' }
  ]);
  return baseAnimation.addElement(baseEl)
    .easing('ease-in-out')
    .duration(200)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};

/**
 * Md Alert Enter Animation
 */
const mdEnterAnimation = (baseEl) => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 0.01, 'var(--backdrop-opacity)');
  wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'))
    .keyframes([
    { offset: 0, opacity: '0.01', transform: 'scale(0.9)' },
    { offset: 1, opacity: '1', transform: 'scale(1)' }
  ]);
  return baseAnimation.addElement(baseEl)
    .easing('ease-in-out')
    .duration(150)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};

/**
 * Md Alert Leave Animation
 */
const mdLeaveAnimation = (baseEl) => {
  const baseAnimation = createAnimation();
  const backdropAnimation = createAnimation();
  const wrapperAnimation = createAnimation();
  backdropAnimation.addElement(baseEl.querySelector('ion-backdrop'))
    .fromTo('opacity', 'var(--backdrop-opacity)', 0);
  wrapperAnimation.addElement(baseEl.querySelector('.alert-wrapper'))
    .fromTo('opacity', 0.99, 0);
  return baseAnimation.addElement(baseEl)
    .easing('ease-in-out')
    .duration(150)
    .addAnimation([backdropAnimation, wrapperAnimation]);
};

const alertIosCss = ".sc-gic-alert-ios-h{--min-width:250px;--width:auto;--min-height:auto;--height:auto;--max-height:90%;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:fixed;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;font-family:var(--ion-font-family, inherit);contain:strict;-ms-touch-action:none;touch-action:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1001}.overlay-hidden.sc-gic-alert-ios-h{display:none}.alert-top.sc-gic-alert-ios-h{padding-top:50px;-ms-flex-align:start;align-items:flex-start}.alert-wrapper.sc-gic-alert-ios{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);contain:content;opacity:0;z-index:10}.alert-title.sc-gic-alert-ios{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0}.alert-sub-title.sc-gic-alert-ios{margin-left:0;margin-right:0;margin-top:5px;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;font-weight:normal}.alert-message.sc-gic-alert-ios{-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-overflow-scrolling:touch;overflow-y:scroll;overscroll-behavior-y:contain}.alert-checkbox-group.sc-gic-alert-ios::-webkit-scrollbar,.alert-radio-group.sc-gic-alert-ios::-webkit-scrollbar,.alert-message.sc-gic-alert-ios::-webkit-scrollbar{display:none}.alert-input.sc-gic-alert-ios{padding-left:0;padding-right:0;padding-top:10px;padding-bottom:10px;width:100%;border:0;background:inherit;font:inherit;-webkit-box-sizing:border-box;box-sizing:border-box}.alert-button-group.sc-gic-alert-ios{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;width:100%}.alert-button-group-vertical.sc-gic-alert-ios{-ms-flex-direction:column;flex-direction:column;-ms-flex-wrap:nowrap;flex-wrap:nowrap}.alert-button.sc-gic-alert-ios{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;display:block;border:0;font-size:14px;line-height:20px;z-index:0}.alert-button.ion-focused.sc-gic-alert-ios,.alert-tappable.ion-focused.sc-gic-alert-ios{background:var(--ion-color-step-100, #e6e6e6)}.alert-button-inner.sc-gic-alert-ios{display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%}.alert-tappable.sc-gic-alert-ios{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;display:-ms-flexbox;display:flex;width:100%;border:0;background:transparent;font-size:inherit;line-height:initial;text-align:start;-webkit-appearance:none;-moz-appearance:none;appearance:none;contain:strict}.alert-button.sc-gic-alert-ios,.alert-checkbox.sc-gic-alert-ios,.alert-input.sc-gic-alert-ios,.alert-radio.sc-gic-alert-ios{outline:none}.alert-radio-icon.sc-gic-alert-ios,.alert-checkbox-icon.sc-gic-alert-ios,.alert-checkbox-inner.sc-gic-alert-ios{-webkit-box-sizing:border-box;box-sizing:border-box}.alert-checkbox-group-vs.sc-gic-alert-ios{min-height:90%}.sc-gic-alert-ios-h{--background:var(--ion-overlay-background-color, var(--ion-color-step-100, #f9f9f9));--max-width:270px;font-size:14px}.alert-wrapper.sc-gic-alert-ios{border-radius:13px;-webkit-box-shadow:none;box-shadow:none;overflow:hidden}.alert-translucent.sc-gic-alert-ios-h .alert-wrapper.sc-gic-alert-ios{background:rgba(var(--ion-background-color-rgb, 255, 255, 255), 0.9);-webkit-backdrop-filter:saturate(180%) blur(20px);backdrop-filter:saturate(180%) blur(20px)}.alert-head.sc-gic-alert-ios{padding-left:16px;padding-right:16px;padding-top:12px;padding-bottom:7px;text-align:center}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.alert-head.sc-gic-alert-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px}}.alert-title.sc-gic-alert-ios{margin-top:8px;color:var(--ion-text-color, #000);font-size:17px;font-weight:600}.alert-sub-title.sc-gic-alert-ios{color:var(--ion-color-step-600, #666666);font-size:14px}.alert-message.sc-gic-alert-ios,.alert-input-group.sc-gic-alert-ios{padding-left:16px;padding-right:16px;padding-top:0;padding-bottom:21px;color:var(--ion-text-color, #000);font-size:13px;text-align:center}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.alert-message.sc-gic-alert-ios,.alert-input-group.sc-gic-alert-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:16px;padding-inline-start:16px;-webkit-padding-end:16px;padding-inline-end:16px}}.alert-message.sc-gic-alert-ios{max-height:240px}.alert-message.sc-gic-alert-ios:empty{padding-left:0;padding-right:0;padding-top:0;padding-bottom:12px}.alert-input.sc-gic-alert-ios{border-radius:4px;margin-top:10px;padding-left:6px;padding-right:6px;padding-top:6px;padding-bottom:6px;border:0.55px solid var(--ion-color-step-250, #bfbfbf);background-color:var(--ion-background-color, #fff);-webkit-appearance:none;-moz-appearance:none;appearance:none}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.alert-input.sc-gic-alert-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:6px;padding-inline-start:6px;-webkit-padding-end:6px;padding-inline-end:6px}}.alert-input.sc-gic-alert-ios::-webkit-input-placeholder{color:var(--ion-placeholder-color, var(--ion-color-step-400, #999999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-ios::-moz-placeholder{color:var(--ion-placeholder-color, var(--ion-color-step-400, #999999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-ios:-ms-input-placeholder{color:var(--ion-placeholder-color, var(--ion-color-step-400, #999999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-ios::-ms-input-placeholder{color:var(--ion-placeholder-color, var(--ion-color-step-400, #999999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-ios::placeholder{color:var(--ion-placeholder-color, var(--ion-color-step-400, #999999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-ios::-ms-clear{display:none}.alert-checkbox-group-vs.sc-gic-alert-ios,.alert-checkbox-group-vs.sc-gic-alert-ios ion-virtual-scroll.sc-gic-alert-ios{min-height:240px}.alert-radio-group.sc-gic-alert-ios,.alert-checkbox-group.sc-gic-alert-ios{-ms-scroll-chaining:none;overscroll-behavior:contain;max-height:240px;border-top:0.55px solid rgba(var(--ion-text-color-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.2);overflow-y:scroll;-webkit-overflow-scrolling:touch}.alert-tappable.sc-gic-alert-ios{height:44px}.alert-radio-label.sc-gic-alert-ios{padding-left:13px;padding-right:13px;padding-top:13px;padding-bottom:13px;-ms-flex:1;flex:1;-ms-flex-order:0;order:0;color:var(--ion-text-color, #000);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.alert-radio-label.sc-gic-alert-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:13px;padding-inline-start:13px;-webkit-padding-end:13px;padding-inline-end:13px}}[aria-checked=true].sc-gic-alert-ios .alert-radio-label.sc-gic-alert-ios{color:ion-color(primary, base)}.alert-radio-icon.sc-gic-alert-ios{position:relative;-ms-flex-order:1;order:1;min-width:30px}[aria-checked=true].sc-gic-alert-ios .alert-radio-inner.sc-gic-alert-ios{left:7px;top:-7px;position:absolute;width:6px;height:12px;-webkit-transform:rotate(45deg);transform:rotate(45deg);border-width:2px;border-top-width:0;border-left-width:0;border-style:solid;border-color:ion-color(primary, base)}[dir=rtl].sc-gic-alert-ios [aria-checked=true].sc-gic-alert-ios .alert-radio-inner.sc-gic-alert-ios,[dir=rtl].sc-gic-alert-ios-h [aria-checked=true].sc-gic-alert-ios .alert-radio-inner.sc-gic-alert-ios,[dir=rtl] .sc-gic-alert-ios-h [aria-checked=true].sc-gic-alert-ios .alert-radio-inner.sc-gic-alert-ios{left:unset;right:unset;right:7px}.alert-checkbox-label.sc-gic-alert-ios{padding-left:13px;padding-right:13px;padding-top:13px;padding-bottom:13px;-ms-flex:1;flex:1;color:var(--ion-text-color, #000);text-overflow:ellipsis;white-space:nowrap;overflow:hidden}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.alert-checkbox-label.sc-gic-alert-ios{padding-left:unset;padding-right:unset;-webkit-padding-start:13px;padding-inline-start:13px;-webkit-padding-end:13px;padding-inline-end:13px}}.alert-checkbox-icon.sc-gic-alert-ios{border-radius:50%;margin-left:16px;margin-right:6px;margin-top:10px;margin-bottom:10px;position:relative;width:24px;height:24px;border-width:1px;border-style:solid;border-color:var(--ion-item-border-color, var(--ion-border-color, var(--ion-color-step-250, #c8c7cc)));background-color:var(--ion-item-background, var(--ion-background-color, #fff));contain:strict}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.alert-checkbox-icon.sc-gic-alert-ios{margin-left:unset;margin-right:unset;-webkit-margin-start:16px;margin-inline-start:16px;-webkit-margin-end:6px;margin-inline-end:6px}}[aria-checked=true].sc-gic-alert-ios .alert-checkbox-icon.sc-gic-alert-ios{border-color:ion-color(primary, base);background-color:ion-color(primary, base)}[aria-checked=true].sc-gic-alert-ios .alert-checkbox-inner.sc-gic-alert-ios{left:9px;top:4px;position:absolute;width:5px;height:12px;-webkit-transform:rotate(45deg);transform:rotate(45deg);border-width:1px;border-top-width:0;border-left-width:0;border-style:solid;border-color:var(--ion-background-color, #fff)}[dir=rtl].sc-gic-alert-ios [aria-checked=true].sc-gic-alert-ios .alert-checkbox-inner.sc-gic-alert-ios,[dir=rtl].sc-gic-alert-ios-h [aria-checked=true].sc-gic-alert-ios .alert-checkbox-inner.sc-gic-alert-ios,[dir=rtl] .sc-gic-alert-ios-h [aria-checked=true].sc-gic-alert-ios .alert-checkbox-inner.sc-gic-alert-ios{left:unset;right:unset;right:9px}.alert-button-group.sc-gic-alert-ios{margin-right:-0.55px;-ms-flex-wrap:wrap;flex-wrap:wrap}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.alert-button-group.sc-gic-alert-ios{margin-right:unset;-webkit-margin-end:-0.55px;margin-inline-end:-0.55px}}.alert-button.sc-gic-alert-ios{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;border-radius:0;-ms-flex:1 1 auto;flex:1 1 auto;min-width:50%;height:44px;border-top:0.55px solid rgba(var(--ion-text-color-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.2);border-right:0.55px solid rgba(var(--ion-text-color-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.2);background-color:transparent;color:ion-color(primary, base);font-size:17px;overflow:hidden}[dir=rtl].sc-gic-alert-ios .alert-button.sc-gic-alert-ios:first-child,[dir=rtl].sc-gic-alert-ios-h .alert-button.sc-gic-alert-ios:first-child,[dir=rtl] .sc-gic-alert-ios-h .alert-button.sc-gic-alert-ios:first-child{border-right:0}.alert-button.sc-gic-alert-ios:last-child{border-right:0;font-weight:bold}[dir=rtl].sc-gic-alert-ios .alert-button.sc-gic-alert-ios:last-child,[dir=rtl].sc-gic-alert-ios-h .alert-button.sc-gic-alert-ios:last-child,[dir=rtl] .sc-gic-alert-ios-h .alert-button.sc-gic-alert-ios:last-child{border-right:0.55px solid rgba(var(--ion-text-color-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.2)}.alert-button.activated.sc-gic-alert-ios{background-color:rgba(var(--ion-text-color-rgb, var(--ion-text-color-rgb, 0, 0, 0)), 0.1)}";

const alertMdCss = ".sc-gic-alert-md-h{--min-width:250px;--width:auto;--min-height:auto;--height:auto;--max-height:90%;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;left:0;right:0;top:0;bottom:0;display:-ms-flexbox;display:flex;position:fixed;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;font-family:var(--ion-font-family, inherit);contain:strict;-ms-touch-action:none;touch-action:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;z-index:1001}.overlay-hidden.sc-gic-alert-md-h{display:none}.alert-top.sc-gic-alert-md-h{padding-top:50px;-ms-flex-align:start;align-items:flex-start}.alert-wrapper.sc-gic-alert-md{display:-ms-flexbox;display:flex;-ms-flex-direction:column;flex-direction:column;width:var(--width);min-width:var(--min-width);max-width:var(--max-width);height:var(--height);min-height:var(--min-height);max-height:var(--max-height);background:var(--background);contain:content;opacity:0;z-index:10}.alert-title.sc-gic-alert-md{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0}.alert-sub-title.sc-gic-alert-md{margin-left:0;margin-right:0;margin-top:5px;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;font-weight:normal}.alert-message.sc-gic-alert-md{-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-overflow-scrolling:touch;overflow-y:scroll;overscroll-behavior-y:contain}.alert-checkbox-group.sc-gic-alert-md::-webkit-scrollbar,.alert-radio-group.sc-gic-alert-md::-webkit-scrollbar,.alert-message.sc-gic-alert-md::-webkit-scrollbar{display:none}.alert-input.sc-gic-alert-md{padding-left:0;padding-right:0;padding-top:10px;padding-bottom:10px;width:100%;border:0;background:inherit;font:inherit;-webkit-box-sizing:border-box;box-sizing:border-box}.alert-button-group.sc-gic-alert-md{display:-ms-flexbox;display:flex;-ms-flex-direction:row;flex-direction:row;width:100%}.alert-button-group-vertical.sc-gic-alert-md{-ms-flex-direction:column;flex-direction:column;-ms-flex-wrap:nowrap;flex-wrap:nowrap}.alert-button.sc-gic-alert-md{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;display:block;border:0;font-size:14px;line-height:20px;z-index:0}.alert-button.ion-focused.sc-gic-alert-md,.alert-tappable.ion-focused.sc-gic-alert-md{background:var(--ion-color-step-100, #e6e6e6)}.alert-button-inner.sc-gic-alert-md{display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;-ms-flex-negative:0;flex-shrink:0;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:100%;height:100%}.alert-tappable.sc-gic-alert-md{margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;display:-ms-flexbox;display:flex;width:100%;border:0;background:transparent;font-size:inherit;line-height:initial;text-align:start;-webkit-appearance:none;-moz-appearance:none;appearance:none;contain:strict}.alert-button.sc-gic-alert-md,.alert-checkbox.sc-gic-alert-md,.alert-input.sc-gic-alert-md,.alert-radio.sc-gic-alert-md{outline:none}.alert-radio-icon.sc-gic-alert-md,.alert-checkbox-icon.sc-gic-alert-md,.alert-checkbox-inner.sc-gic-alert-md{-webkit-box-sizing:border-box;box-sizing:border-box}.alert-checkbox-group-vs.sc-gic-alert-md{min-height:90%}.sc-gic-alert-md-h{--background:var(--ion-overlay-background-color, var(--ion-background-color, #fff));--max-width:280px;font-size:14px}.alert-wrapper.sc-gic-alert-md{border-radius:4px;-webkit-box-shadow:0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12);box-shadow:0 11px 15px -7px rgba(0, 0, 0, 0.2), 0 24px 38px 3px rgba(0, 0, 0, 0.14), 0 9px 46px 8px rgba(0, 0, 0, 0.12)}.alert-head.sc-gic-alert-md{padding-left:23px;padding-right:23px;padding-top:20px;padding-bottom:15px;text-align:start}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.alert-head.sc-gic-alert-md{padding-left:unset;padding-right:unset;-webkit-padding-start:23px;padding-inline-start:23px;-webkit-padding-end:23px;padding-inline-end:23px}}.alert-title.sc-gic-alert-md{color:var(--ion-text-color, #000);font-size:20px;font-weight:500}.alert-sub-title.sc-gic-alert-md{color:var(--ion-text-color, #000);font-size:16px}.alert-message.sc-gic-alert-md,.alert-input-group.sc-gic-alert-md{padding-left:24px;padding-right:24px;padding-top:20px;padding-bottom:20px;color:var(--ion-color-step-550, #737373)}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.alert-message.sc-gic-alert-md,.alert-input-group.sc-gic-alert-md{padding-left:unset;padding-right:unset;-webkit-padding-start:24px;padding-inline-start:24px;-webkit-padding-end:24px;padding-inline-end:24px}}.alert-message.sc-gic-alert-md{max-height:240px;font-size:16px}.alert-message.sc-gic-alert-md:empty{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0}.alert-head.sc-gic-alert-md+.alert-message.sc-gic-alert-md{padding-top:0}.alert-input.sc-gic-alert-md{margin-left:0;margin-right:0;margin-top:5px;margin-bottom:5px;border-bottom:1px solid var(--ion-color-step-150, #d9d9d9);color:var(--ion-text-color, #000)}.alert-input.sc-gic-alert-md::-webkit-input-placeholder{color:var(--ion-placeholder-color, var(--ion-color-step-400, #999999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-md::-moz-placeholder{color:var(--ion-placeholder-color, var(--ion-color-step-400, #999999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-md:-ms-input-placeholder{color:var(--ion-placeholder-color, var(--ion-color-step-400, #999999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-md::-ms-input-placeholder{color:var(--ion-placeholder-color, var(--ion-color-step-400, #999999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-md::placeholder{color:var(--ion-placeholder-color, var(--ion-color-step-400, #999999));font-family:inherit;font-weight:inherit}.alert-input.sc-gic-alert-md::-ms-clear{display:none}.alert-input.sc-gic-alert-md:focus{margin-bottom:4px;border-bottom:2px solid ion-color(primary, base)}.alert-checkbox-group-vs.sc-gic-alert-md,.alert-checkbox-group-vs.sc-gic-alert-md ion-virtual-scroll.sc-gic-alert-md{min-height:240px}.alert-radio-group.sc-gic-alert-md,.alert-checkbox-group.sc-gic-alert-md{position:relative;max-height:240px;border-top:1px solid var(--ion-color-step-150, #d9d9d9);border-bottom:1px solid var(--ion-color-step-150, #d9d9d9);overflow:auto}.alert-tappable.sc-gic-alert-md{position:relative;height:48px;overflow:hidden}.alert-radio-label.sc-gic-alert-md{padding-left:52px;padding-right:26px;padding-top:13px;padding-bottom:13px;-ms-flex:1;flex:1;color:var(--ion-color-step-850, #262626);font-size:16px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.alert-radio-label.sc-gic-alert-md{padding-left:unset;padding-right:unset;-webkit-padding-start:52px;padding-inline-start:52px;-webkit-padding-end:26px;padding-inline-end:26px}}.alert-radio-icon.sc-gic-alert-md{left:26px;top:0;border-radius:50%;display:block;position:relative;width:20px;height:20px;border-width:2px;border-style:solid;border-color:var(--ion-color-step-550, #737373)}[dir=rtl].sc-gic-alert-md .alert-radio-icon.sc-gic-alert-md,[dir=rtl].sc-gic-alert-md-h .alert-radio-icon.sc-gic-alert-md,[dir=rtl] .sc-gic-alert-md-h .alert-radio-icon.sc-gic-alert-md{left:unset;right:unset;right:26px}.alert-radio-inner.sc-gic-alert-md{left:3px;top:3px;border-radius:50%;position:absolute;width:10px;height:10px;-webkit-transform:scale3d(0, 0, 0);transform:scale3d(0, 0, 0);-webkit-transition:-webkit-transform 280ms cubic-bezier(0.4, 0, 0.2, 1);transition:-webkit-transform 280ms cubic-bezier(0.4, 0, 0.2, 1);transition:transform 280ms cubic-bezier(0.4, 0, 0.2, 1);transition:transform 280ms cubic-bezier(0.4, 0, 0.2, 1), -webkit-transform 280ms cubic-bezier(0.4, 0, 0.2, 1);background-color:ion-color(primary, base)}[dir=rtl].sc-gic-alert-md .alert-radio-inner.sc-gic-alert-md,[dir=rtl].sc-gic-alert-md-h .alert-radio-inner.sc-gic-alert-md,[dir=rtl] .sc-gic-alert-md-h .alert-radio-inner.sc-gic-alert-md{left:unset;right:unset;right:3px}[aria-checked=true].sc-gic-alert-md .alert-radio-label.sc-gic-alert-md{color:var(--ion-color-step-850, #262626)}[aria-checked=true].sc-gic-alert-md .alert-radio-icon.sc-gic-alert-md{border-color:ion-color(primary, base)}[aria-checked=true].sc-gic-alert-md .alert-radio-inner.sc-gic-alert-md{-webkit-transform:scale3d(1, 1, 1);transform:scale3d(1, 1, 1)}.alert-checkbox-label.sc-gic-alert-md{padding-left:53px;padding-right:26px;padding-top:13px;padding-bottom:13px;-ms-flex:1;flex:1;color:var(--ion-color-step-850, #262626);font-size:16px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.alert-checkbox-label.sc-gic-alert-md{padding-left:unset;padding-right:unset;-webkit-padding-start:53px;padding-inline-start:53px;-webkit-padding-end:26px;padding-inline-end:26px}}.alert-checkbox-icon.sc-gic-alert-md{left:26px;top:0;border-radius:2px;position:relative;width:16px;height:16px;border-width:2px;border-style:solid;border-color:var(--ion-color-step-550, #737373);contain:strict}[dir=rtl].sc-gic-alert-md .alert-checkbox-icon.sc-gic-alert-md,[dir=rtl].sc-gic-alert-md-h .alert-checkbox-icon.sc-gic-alert-md,[dir=rtl] .sc-gic-alert-md-h .alert-checkbox-icon.sc-gic-alert-md{left:unset;right:unset;right:26px}[aria-checked=true].sc-gic-alert-md .alert-checkbox-icon.sc-gic-alert-md{border-color:ion-color(primary, base);background-color:ion-color(primary, base)}[aria-checked=true].sc-gic-alert-md .alert-checkbox-inner.sc-gic-alert-md{left:3px;top:0;position:absolute;width:6px;height:10px;-webkit-transform:rotate(45deg);transform:rotate(45deg);border-width:2px;border-top-width:0;border-left-width:0;border-style:solid;border-color:ion-color(primary, contrast)}[dir=rtl].sc-gic-alert-md [aria-checked=true].sc-gic-alert-md .alert-checkbox-inner.sc-gic-alert-md,[dir=rtl].sc-gic-alert-md-h [aria-checked=true].sc-gic-alert-md .alert-checkbox-inner.sc-gic-alert-md,[dir=rtl] .sc-gic-alert-md-h [aria-checked=true].sc-gic-alert-md .alert-checkbox-inner.sc-gic-alert-md{left:unset;right:unset;right:3px}.alert-button-group.sc-gic-alert-md{padding-left:8px;padding-right:8px;padding-top:8px;padding-bottom:8px;-webkit-box-sizing:border-box;box-sizing:border-box;-ms-flex-wrap:wrap-reverse;flex-wrap:wrap-reverse;-ms-flex-pack:end;justify-content:flex-end}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.alert-button-group.sc-gic-alert-md{padding-left:unset;padding-right:unset;-webkit-padding-start:8px;padding-inline-start:8px;-webkit-padding-end:8px;padding-inline-end:8px}}.alert-button.sc-gic-alert-md{border-radius:2px;margin-left:0;margin-right:8px;margin-top:0;margin-bottom:0;padding-left:10px;padding-right:10px;padding-top:10px;padding-bottom:10px;position:relative;background-color:transparent;color:ion-color(primary, base);font-weight:500;text-align:end;text-transform:uppercase;overflow:hidden}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.alert-button.sc-gic-alert-md{margin-left:unset;margin-right:unset;-webkit-margin-start:0;margin-inline-start:0;-webkit-margin-end:8px;margin-inline-end:8px}}@supports ((-webkit-margin-start: 0) or (margin-inline-start: 0)) or (-webkit-margin-start: 0){.alert-button.sc-gic-alert-md{padding-left:unset;padding-right:unset;-webkit-padding-start:10px;padding-inline-start:10px;-webkit-padding-end:10px;padding-inline-end:10px}}.alert-button-inner.sc-gic-alert-md{-ms-flex-pack:end;justify-content:flex-end}";

const Alert = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.didPresent = createEvent(this, "gicAlertDidPresent", 7);
    this.willPresent = createEvent(this, "gicAlertWillPresent", 7);
    this.willDismiss = createEvent(this, "gicAlertWillDismiss", 7);
    this.didDismiss = createEvent(this, "gicAlertDidDismiss", 7);
    this.processedInputs = [];
    this.processedButtons = [];
    this.presented = false;
    this.mode = getGicMode(this);
    /**
     * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
     */
    this.keyboardClose = true;
    /**
     * Array of buttons to be added to the alert.
     */
    this.buttons = [];
    /**
     * Array of input to show in the alert.
     */
    this.inputs = [];
    /**
     * If `true`, the alert will be dismissed when the backdrop is clicked.
     */
    this.backdropDismiss = true;
    /**
     * If `true`, the alert will be translucent.
     * Only applies when the mode is `"ios"` and the device supports
     * [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
     */
    this.translucent = false;
    /**
     * If `true`, the alert will animate.
     */
    this.animated = true;
    /**
     * If `true`, the alert will show a searchbar for radios and checkboxes
     */
    this.searchBar = false;
    /**
     * If `true`, the alert will use a virtual scroll to render radios and checkboxes
     */
    this.useVirtualScroll = false;
    /**
     * The current search string
     */
    this.searchString = '';
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
        const cancelButton = this.processedButtons.find(b => b.role === 'cancel');
        this.callButtonHandler(cancelButton);
      }
    };
    prepareOverlay(this.el);
  }
  buttonsChanged() {
    const buttons = this.buttons;
    this.processedButtons = buttons.map(btn => {
      return (typeof btn === 'string')
        ? { text: btn, role: btn.toLowerCase() === 'cancel' ? 'cancel' : undefined }
        : btn;
    });
  }
  inputsChanged() {
    const inputs = this.inputs;
    // An alert can be created with several different inputs. Radios,
    // checkboxes and inputs are all accepted, but they cannot be mixed.
    const inputTypes = new Set(inputs.map(i => i.type));
    if (inputTypes.has('checkbox') && inputTypes.has('radio')) {
      console.warn(`Alert cannot mix input types: ${(Array.from(inputTypes.values()).join('/'))}. Please see alert docs for more info.`);
    }
    this.inputType = inputTypes.values().next().value;
    const search = (this.searchString || '').trim();
    const regex = new RegExp(search, 'i');
    this.processedInputs = (search.length === 0 ? inputs : inputs.filter(i => regex.test(i.label || '')))
      .map((i, index) => ({
      type: i.type || 'text',
      name: i.name || `${index}`,
      placeholder: i.placeholder || '',
      value: i.value,
      label: i.label,
      checked: !!i.checked,
      disabled: !!i.disabled,
      id: i.id || `alert-input-${this.overlayIndex}-${index}`,
      handler: i.handler,
      min: i.min,
      max: i.max
    }));
  }
  componentWillLoad() {
    this.inputsChanged();
    this.buttonsChanged();
  }
  /**
   * Present the alert overlay after it has been created.
   */
  present() {
    return present(this, 'alertEnter', iosEnterAnimation, mdEnterAnimation);
  }
  /**
   * Dismiss the alert overlay after it has been presented.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the alert.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the alert.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   */
  dismiss(data, role) {
    return dismiss(this, data, role, 'alertLeave', iosLeaveAnimation, mdLeaveAnimation);
  }
  /**
   * Returns a promise that resolves when the alert did dismiss.
   */
  onDidDismiss() {
    return eventMethod(this.el, 'gicAlertDidDismiss');
  }
  /**
   * Returns a promise that resolves when the alert will dismiss.
   */
  onWillDismiss() {
    return eventMethod(this.el, 'gicAlertWillDismiss');
  }
  rbClick(selectedInput) {
    for (const input of this.processedInputs) {
      input.checked = input === selectedInput;
    }
    this.activeId = selectedInput.id;
    safeCall(selectedInput.handler, selectedInput);
    forceUpdate(this);
  }
  cbClick(selectedInput) {
    selectedInput.checked = !selectedInput.checked;
    safeCall(selectedInput.handler, selectedInput);
    forceUpdate(this);
  }
  buttonClick(button) {
    const role = button.role;
    const values = this.getValues();
    if (isCancel(role)) {
      return this.dismiss({ values }, role);
    }
    const returnData = this.callButtonHandler(button, values);
    if (returnData !== false) {
      return this.dismiss(Object.assign({ values }, returnData), button.role);
    }
    return Promise.resolve(false);
  }
  callButtonHandler(button, data) {
    if (button && button.handler) {
      // a handler has been provided, execute it
      // pass the handler the values from the inputs
      const returnData = safeCall(button.handler, data);
      if (returnData === false) {
        // if the return value of the handler is false then do not dismiss
        return false;
      }
      if (typeof returnData === 'object') {
        return returnData;
      }
    }
    return {};
  }
  getValues() {
    if (this.processedInputs.length === 0) {
      // this is an alert without any options/inputs at all
      return undefined;
    }
    if (this.inputType === 'radio') {
      // this is an alert with radio buttons (single value select)
      // return the one value which is checked, otherwise undefined
      const checkedInput = this.processedInputs.find(i => !!i.checked);
      return checkedInput ? checkedInput.value : undefined;
    }
    if (this.inputType === 'checkbox') {
      // this is an alert with checkboxes (multiple value select)
      // return an array of all the checked values
      return this.processedInputs.filter(i => i.checked).map(i => i.value);
    }
    // this is an alert with text inputs
    // return an object of all the values with the input name as the key
    const values = {};
    this.processedInputs.forEach(i => {
      values[i.name] = i.value || '';
    });
    return values;
  }
  renderSearchBar() {
    if (!this.searchBar || this.inputs.length === 0) {
      return null;
    }
    const inputTypes = new Set(this.inputs.map(i => i.type));
    if (!inputTypes.has('checkbox') && !inputTypes.has('radio')) {
      return;
    }
    const searchString = this.searchString || '';
    return (h("div", { class: "alert-search-bar" }, h("ion-item", null, h("ion-icon", { slot: "start", icon: "search" }), h("ion-input", { value: searchString, onIonChange: this.onSearchChange }), h("ion-button", { slot: "end", fill: "clear", onClick: this.resetSearch }, h("ion-icon", { slot: "icon-only", icon: "close" })))));
  }
  renderAlertInputs(labelledBy) {
    switch (this.inputType) {
      case 'checkbox': return this.renderCheckbox(labelledBy);
      case 'radio': return this.renderRadio(labelledBy);
      default: return this.renderInput(labelledBy);
    }
  }
  renderCheckboxNode(el, cell) {
    const i = cell.value;
    if (el) {
      el.setAttribute('aria-checked', `${i.checked}`);
      el.setAttribute('id', `${i.id}`);
      if (i.disabled) {
        el.setAttribute('disabled', 'disabled');
      }
      else {
        el.removeAttribute('disabled');
      }
      el.querySelector('.alert-checkbox-label').textContent = `${i.label}`;
      el.onclick = () => {
        this.cbClick(i);
        el.setAttribute('aria-checked', `${i.checked}`);
      };
    }
    return el;
  }
  renderCheckboxEntry(i, mode) {
    return (h("button", { type: "button", onClick: () => this.cbClick(i), "aria-checked": `${i.checked}`, id: i.id, disabled: i.disabled, tabIndex: 0, role: "checkbox", class: {
        'alert-tappable': true,
        'alert-checkbox': true,
        'alert-checkbox-button': true,
        'ion-focusable': true,
        'alert-checkbox-button-disabled': i.disabled || false
      } }, h("div", { class: "alert-button-inner" }, h("div", { class: "alert-checkbox-icon" }, h("div", { class: "alert-checkbox-inner" })), h("div", { class: "alert-checkbox-label" }, i.label)), mode === 'md' && h("ion-ripple-effect", null)));
  }
  renderCheckbox(labelledby) {
    const inputs = this.processedInputs;
    const mode = getGicMode(this);
    if (inputs.length === 0) {
      return null;
    }
    const hydClass = 'sc-gic-alert-' + mode;
    const checkboxTemplate = ``
      + `<button type="button" role="checkbox" class="alert-tappable alert-checkbox alert-checkbox-button ion-focusable ${hydClass}" tabindex="0" role="checkbox">`
      + `<div class="alert-button-inner ${hydClass}">`
      + `<div class="alert-checkbox-icon ${hydClass}">`
      + `<div class="alert-checkbox-inner ${hydClass}"></div>`
      + `</div>`
      + `<div class="alert-checkbox-label ${hydClass}"></div>`
      + `</div>`
      + (mode === 'md' ? `<ion-ripple-effect class="${hydClass}"></ion-ripple-effect>` : '')
      + `</button>`;
    return (h("div", { class: "alert-checkbox-group", "aria-labelledby": labelledby }, this.useVirtualScroll
      ?
        h("ion-content", { class: "alert-checkbox-group-vs" }, h("ion-virtual-scroll", { items: inputs, nodeRender: (el, cell) => this.renderCheckboxNode(el, cell) }, h("template", { innerHTML: checkboxTemplate })))
      : inputs.map(i => this.renderCheckboxEntry(i, mode))));
  }
  renderRadioEntry(i) {
    return (h("button", { type: "button", onClick: () => this.rbClick(i), "aria-checked": `${i.checked}`, disabled: i.disabled, id: i.id, tabIndex: 0, class: {
        'alert-radio-button': true,
        'alert-tappable': true,
        'alert-radio': true,
        'ion-focusable': true,
        'alert-radio-button-disabled': i.disabled || false
      }, role: "radio" }, h("div", { class: "alert-button-inner" }, h("div", { class: "alert-radio-icon" }, h("div", { class: "alert-radio-inner" })), h("div", { class: "alert-radio-label" }, i.label))));
  }
  renderRadioNode(el, cell) {
    const i = cell.value;
    if (el) {
      el.setAttribute('aria-checked', `${i.checked}`);
      el.setAttribute('id', `${i.id}`);
      if (i.disabled) {
        el.setAttribute('disabled', 'disabled');
      }
      else {
        el.removeAttribute('disabled');
      }
      el.querySelector('.alert-radio-label').textContent = `${i.label}`;
      el.onclick = () => {
        this.cbClick(i);
        el.parentElement.querySelectorAll('.alert-radio-button')
          .forEach(b => b.setAttribute('aria-checked', 'false'));
        el.setAttribute('aria-checked', `${i.checked}`);
      };
    }
    return el;
  }
  renderRadio(labelledby) {
    const mode = getGicMode(this);
    const inputs = this.processedInputs;
    if (inputs.length === 0) {
      return null;
    }
    const hydClass = 'sc-gic-alert-' + mode;
    const radioTemplate = ``
      + `<button type="button" class="alert-radio-button alert-tappable alert-radio ion-focusable ${hydClass}" tabIndex="0" role="radio">`
      + `<div class="alert-button-inner ${hydClass}">`
      + `<div class="alert-radio-icon ${hydClass}">`
      + `<div class="alert-radio-inner ${hydClass}"></div>`
      + `</div>`
      + `<div class="alert-radio-label ${hydClass}"></div>`
      + `</div>`
      + `</button>`;
    return (h("div", { class: "alert-radio-group", role: "radiogroup", "aria-labelledby": labelledby, "aria-activedescendant": this.activeId }, this.useVirtualScroll
      ?
        h("ion-content", { class: "alert-checkbox-group-vs" }, h("ion-virtual-scroll", { items: inputs, nodeRender: (el, cell) => this.renderRadioNode(el, cell) }, h("template", { innerHTML: radioTemplate })))
      : inputs.map(i => this.renderRadioEntry(i))));
  }
  renderInput(labelledby) {
    const inputs = this.processedInputs;
    if (inputs.length === 0) {
      return null;
    }
    return (h("div", { class: "alert-input-group", "aria-labelledby": labelledby }, inputs.map(i => {
      if (i.type === 'textarea') {
        return (h("div", { class: "alert-input-wrapper" }, h("textarea", { placeholder: i.placeholder, value: i.value, onInput: e => i.value = e.target.value, id: i.id, disabled: i.disabled, tabIndex: 0, class: {
            'alert-input': true,
            'alert-input-disabled': i.disabled || false
          } })));
      }
      else {
        return (h("div", { class: "alert-input-wrapper" }, h("input", { placeholder: i.placeholder, value: i.value, type: i.type, min: i.min, max: i.max, onInput: e => i.value = e.target.value, id: i.id, disabled: i.disabled, tabIndex: 0, class: {
            'alert-input': true,
            'alert-input-disabled': i.disabled || false
          } })));
      }
    })));
  }
  renderAlertButtons() {
    const buttons = this.processedButtons;
    const mode = getGicMode(this);
    const alertButtonGroupClass = {
      'alert-button-group': true,
      'alert-button-group-vertical': buttons.length > 2
    };
    return (h("div", { class: alertButtonGroupClass }, buttons.map(button => h("button", { type: "button", class: buttonClass(button), tabIndex: 0, onClick: () => this.buttonClick(button) }, h("span", { class: "alert-button-inner" }, button.text), mode === 'md' && h("ion-ripple-effect", null)))));
  }
  render() {
    const { overlayIndex, header, subHeader } = this;
    const mode = getGicMode(this);
    const hdrId = `alert-${overlayIndex}-hdr`;
    const subHdrId = `alert-${overlayIndex}-sub-hdr`;
    const msgId = `alert-${overlayIndex}-msg`;
    let labelledById;
    if (header !== undefined) {
      labelledById = hdrId;
    }
    else if (subHeader !== undefined) {
      labelledById = subHdrId;
    }
    return (h(Host, { role: "dialog", "aria-modal": "true", style: {
        zIndex: `${20000 + overlayIndex}`,
      }, class: Object.assign(Object.assign({}, getClassMap(this.cssClass)), { [mode]: true, 'alert-translucent': this.translucent }), onIonAlertWillDismiss: this.dispatchCancelHandler, onIonBackdropTap: this.onBackdropTap }, h("ion-backdrop", { tappable: this.backdropDismiss }), h("div", { class: "alert-wrapper" }, h("div", { class: "alert-head" }, header && h("h2", { id: hdrId, class: "alert-title" }, header), subHeader && h("h2", { id: subHdrId, class: "alert-sub-title" }, subHeader)), h("div", { id: msgId, class: "alert-message", innerHTML: sanitizeDOMString(this.message) }), this.searchBar && this.renderSearchBar(), this.renderAlertInputs(labelledById), this.renderAlertButtons())));
  }
  get el() { return this; }
  static get watchers() { return {
    "buttons": ["buttonsChanged"],
    "inputs": ["inputsChanged"],
    "searchString": ["inputsChanged"]
  }; }
  static get style() { return {
    ios: alertIosCss,
    md: alertMdCss
  }; }
};
const buttonClass = (button) => {
  return Object.assign({ 'alert-button': true, 'ion-focusable': true, 'ion-activatable': true }, getClassMap(button.cssClass));
};

const GicAlert = /*@__PURE__*/proxyCustomElement(Alert, [34,"gic-alert",{"overlayIndex":[2,"overlay-index"],"keyboardClose":[4,"keyboard-close"],"enterAnimation":[16],"leaveAnimation":[16],"cssClass":[1,"css-class"],"header":[1],"subHeader":[1,"sub-header"],"message":[1],"buttons":[16],"inputs":[1040],"backdropDismiss":[4,"backdrop-dismiss"],"translucent":[4],"animated":[4],"searchBar":[4,"search-bar"],"useVirtualScroll":[4,"use-virtual-scroll"],"searchString":[1025,"search-string"]}]);

export { GicAlert };
