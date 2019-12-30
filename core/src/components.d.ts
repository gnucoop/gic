/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  ActionSheetButton,
  AnimationBuilder,
  ComponentProps,
  FrameworkDelegate,
  Mode,
  OverlayEventDetail,
  OverlaySelect,
  StyleEventDetail,
} from '@ionic/core';
import {
  ActionSheetOptions,
  AlertButton,
  AlertInput,
  AlertOptions,
  AutocompletePopoverOption,
  ComponentRef,
  SelectChangeEventDetail,
  SelectInterface,
  SelectPopoverOption,
} from './interface';
import {
  SelectCompareFn,
} from './components/select/select-interface';

export namespace Components {
  interface GicActionSheet {
    /**
    * If `true`, the action sheet will animate.
    */
    'animated': boolean;
    /**
    * If `true`, the action sheet will be dismissed when the backdrop is clicked.
    */
    'backdropDismiss': boolean;
    /**
    * An array of buttons for the action sheet.
    */
    'buttons': (ActionSheetButton | string)[];
    /**
    * Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces.
    */
    'cssClass'?: string | string[];
    /**
    * Dismiss the action sheet overlay after it has been presented.
    * @param data Any data to emit in the dismiss events.
    * @param role The role of the element that is dismissing the action sheet. This can be useful in a button handler for determining which button was clicked to dismiss the action sheet. Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
    */
    'dismiss': (data?: any, role?: string | undefined) => Promise<boolean>;
    /**
    * Animation to use when the action sheet is presented.
    */
    'enterAnimation'?: AnimationBuilder;
    /**
    * Title for the action sheet.
    */
    'header'?: string;
    /**
    * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
    */
    'keyboardClose': boolean;
    /**
    * Animation to use when the action sheet is dismissed.
    */
    'leaveAnimation'?: AnimationBuilder;
    /**
    * Returns a promise that resolves when the action sheet did dismiss.
    */
    'onDidDismiss': () => Promise<OverlayEventDetail<any>>;
    /**
    * Returns a promise that resolves when the action sheet will dismiss.
    */
    'onWillDismiss': () => Promise<OverlayEventDetail<any>>;
    'overlayIndex': number;
    /**
    * Present the action sheet overlay after it has been created.
    */
    'present': () => Promise<void>;
    /**
    * If `true`, the action sheet will show a searchbar for radios and checkboxes
    */
    'searchBar': boolean;
    /**
    * The current search string
    */
    'searchString'?: string | null;
    /**
    * Subtitle for the action sheet.
    */
    'subHeader'?: string;
    /**
    * If `true`, the action sheet will be translucent. Only applies when the mode is `"ios"` and the device supports [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
    */
    'translucent': boolean;
    /**
    * If `true`, the action sheet will use a virtual scroll to render radios and checkboxes
    */
    'useVirtualScroll': boolean;
  }
  interface GicActionSheetController {
    /**
    * Create an action sheet overlay with action sheet options.
    * @param options The options to use to create the action sheet.
    */
    'create': (options: ActionSheetOptions) => Promise<HTMLGicActionSheetElement>;
    /**
    * Dismiss the open action sheet overlay.
    * @param data Any data to emit in the dismiss events.
    * @param role The role of the element that is dismissing the action sheet. This can be useful in a button handler for determining which button was clicked to dismiss the action sheet. Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
    * @param id The id of the action sheet to dismiss. If an id is not provided, it will dismiss the most recently opened action sheet.
    */
    'dismiss': (data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>;
    /**
    * Get the most recently opened action sheet overlay.
    */
    'getTop': () => Promise<HTMLGicActionSheetElement | undefined>;
  }
  interface GicAlert {
    /**
    * If `true`, the alert will animate.
    */
    'animated': boolean;
    /**
    * If `true`, the alert will be dismissed when the backdrop is clicked.
    */
    'backdropDismiss': boolean;
    /**
    * Array of buttons to be added to the alert.
    */
    'buttons': (AlertButton | string)[];
    /**
    * Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces.
    */
    'cssClass'?: string | string[];
    /**
    * Dismiss the alert overlay after it has been presented.
    * @param data Any data to emit in the dismiss events.
    * @param role The role of the element that is dismissing the alert. This can be useful in a button handler for determining which button was clicked to dismiss the alert. Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
    */
    'dismiss': (data?: any, role?: string | undefined) => Promise<boolean>;
    /**
    * Animation to use when the alert is presented.
    */
    'enterAnimation'?: AnimationBuilder;
    /**
    * The main title in the heading of the alert.
    */
    'header'?: string;
    /**
    * Array of input to show in the alert.
    */
    'inputs': AlertInput[];
    /**
    * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
    */
    'keyboardClose': boolean;
    /**
    * Animation to use when the alert is dismissed.
    */
    'leaveAnimation'?: AnimationBuilder;
    /**
    * The main message to be displayed in the alert. `message` can accept either plaintext or HTML as a string. To display characters normally reserved for HTML, they must be escaped. For example `<Ionic>` would become `&lt;Ionic&gt;`  For more information: [Security Documentation](https://ionicframework.com/docs/faq/security)
    */
    'message'?: string;
    /**
    * The mode determines which platform styles to use.
    */
    'mode'?: "ios" | "md";
    /**
    * Returns a promise that resolves when the alert did dismiss.
    */
    'onDidDismiss': () => Promise<OverlayEventDetail<any>>;
    /**
    * Returns a promise that resolves when the alert will dismiss.
    */
    'onWillDismiss': () => Promise<OverlayEventDetail<any>>;
    'overlayIndex': number;
    /**
    * Present the alert overlay after it has been created.
    */
    'present': () => Promise<void>;
    /**
    * If `true`, the alert will show a searchbar for radios and checkboxes
    */
    'searchBar': boolean;
    /**
    * The current search string
    */
    'searchString'?: string | null;
    /**
    * The subtitle in the heading of the alert. Displayed under the title.
    */
    'subHeader'?: string;
    /**
    * If `true`, the alert will be translucent. Only applies when the mode is `"ios"` and the device supports [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
    */
    'translucent': boolean;
    /**
    * If `true`, the alert will use a virtual scroll to render radios and checkboxes
    */
    'useVirtualScroll': boolean;
  }
  interface GicAlertController {
    /**
    * Create an alert overlay with alert options.
    * @param options The options to use to create the alert.
    */
    'create': (options: AlertOptions) => Promise<HTMLGicAlertElement>;
    /**
    * Dismiss the open alert overlay.
    * @param data Any data to emit in the dismiss events.
    * @param role The role of the element that is dismissing the alert. This can be useful in a button handler for determining which button was clicked to dismiss the alert. Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
    * @param id The id of the alert to dismiss. If an id is not provided, it will dismiss the most recently opened alert.
    */
    'dismiss': (data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>;
    /**
    * Get the most recently opened alert overlay.
    */
    'getTop': () => Promise<HTMLGicAlertElement | undefined>;
  }
  interface GicAutocomplete {
    /**
    * Any additional options that the `popover` interface can take. See the [PopoverController API docs](../../popover/PopoverController/#create) for the create options for each interface.
    */
    'interfaceOptions': any;
    /**
    * The mode determines which platform styles to use.
    */
    'mode': Mode;
    'placeholder'?: string;
    'value': string | null;
  }
  interface GicAutocompleteOption {
    /**
    * The text value of the option.
    */
    'value'?: any | null;
  }
  interface GicAutocompletePopover {
    /**
    * Array of options for the popover
    */
    'options': AutocompletePopoverOption[];
    'searchStr'?: string;
  }
  interface GicPopover {
    /**
    * If `true`, the popover will animate.
    */
    'animated': boolean;
    /**
    * If `true`, the popover will be dismissed when the backdrop is clicked.
    */
    'backdropDismiss': boolean;
    /**
    * The component to display inside of the popover.
    */
    'component': ComponentRef;
    /**
    * The data to pass to the popover component.
    */
    'componentProps'?: ComponentProps;
    /**
    * Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces.
    */
    'cssClass'?: string | string[];
    'delegate'?: FrameworkDelegate;
    /**
    * Dismiss the popover overlay after it has been presented.
    * @param data Any data to emit in the dismiss events.
    * @param role The role of the element that is dismissing the popover. For example, 'cancel' or 'backdrop'.
    */
    'dismiss': (data?: any, role?: string | undefined) => Promise<boolean>;
    /**
    * Animation to use when the popover is presented.
    */
    'enterAnimation'?: AnimationBuilder;
    /**
    * The event to pass to the popover animation.
    */
    'event': any;
    /**
    * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
    */
    'keyboardClose': boolean;
    /**
    * Animation to use when the popover is dismissed.
    */
    'leaveAnimation'?: AnimationBuilder;
    /**
    * The mode determines which platform styles to use.
    */
    'mode'?: "ios" | "md";
    /**
    * Returns a promise that resolves when the popover did dismiss.
    */
    'onDidDismiss': () => Promise<OverlayEventDetail<any>>;
    /**
    * Returns a promise that resolves when the popover will dismiss.
    */
    'onWillDismiss': () => Promise<OverlayEventDetail<any>>;
    'overlayIndex': number;
    /**
    * Present the popover overlay after it has been created.
    */
    'present': () => Promise<void>;
    /**
    * If `true`, a backdrop will be displayed behind the popover.
    */
    'showBackdrop': boolean;
    /**
    * If `true`, the popover will be translucent. Only applies when the mode is `"ios"` and the device supports [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
    */
    'translucent': boolean;
  }
  interface GicPopoverController {
    /**
    * Create a popover overlay with popover options.
    * @param options The options to use to create the popover.
    */
    'create': (options: any) => Promise<HTMLGicPopoverElement>;
    /**
    * Dismiss the open popover overlay.
    * @param data Any data to emit in the dismiss events.
    * @param role The role of the element that is dismissing the popover. This can be useful in a button handler for determining which button was clicked to dismiss the popover. Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
    * @param id The id of the popover to dismiss. If an id is not provided, it will dismiss the most recently opened popover.
    */
    'dismiss': (data?: any, role?: string | undefined, id?: string | undefined) => Promise<boolean>;
    /**
    * Get the most recently opened popover overlay.
    */
    'getTop': () => Promise<HTMLGicPopoverElement | undefined>;
  }
  interface GicSelect {
    /**
    * The text to display on the cancel button.
    */
    'cancelText': string;
    /**
    * A property name or function used to compare object values
    */
    'compareWith'?: string | SelectCompareFn | null;
    /**
    * If `true`, the user cannot interact with the select.
    */
    'disabled': boolean;
    /**
    * The interface the select should use: `action-sheet`, `popover` or `alert`.
    */
    'interface': SelectInterface;
    /**
    * Any additional options that the `alert`, `action-sheet` or `popover` interface can take. See the [AlertController API docs](../../alert/AlertController/#create), the [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) and the [PopoverController API docs](../../popover/PopoverController/#create) for the create options for each interface.
    */
    'interfaceOptions': any;
    /**
    * The mode determines which platform styles to use.
    */
    'mode': Mode;
    /**
    * If `true`, the select can accept multiple values.
    */
    'multiple': boolean;
    /**
    * The name of the control, which is submitted with the form data.
    */
    'name': string;
    /**
    * The text to display on the ok button.
    */
    'okText': string;
    /**
    * Opens the select overlay, it could be an alert, action-sheet or popover, based in `gic-select` settings.
    */
    'open': (ev?: UIEvent | undefined) => Promise<HTMLIonActionSheetElement | HTMLIonAlertElement | HTMLIonPopoverElement | undefined>;
    /**
    * The text to display when the select is empty.
    */
    'placeholder'?: string | null;
    /**
    * If `true`, the select will show a searchbar for radios and checkboxes
    */
    'searchBar': boolean;
    /**
    * The text to display instead of the selected option's value.
    */
    'selectedText'?: string | null;
    /**
    * If `true`, the buttons list will be rendered in a virtual scroll
    */
    'useVirtualScroll': boolean;
    /**
    * the value of the select.
    */
    'value'?: any | null;
  }
  interface GicSelectOption {
    /**
    * If `true`, the user cannot interact with the select option.
    */
    'disabled': boolean;
    /**
    * If `true`, the element is selected.
    */
    'selected': boolean;
    /**
    * The text value of the option.
    */
    'value'?: any | null;
  }
  interface GicSelectPopover {
    /**
    * Header text for the popover
    */
    'header'?: string;
    /**
    * Text for popover body
    */
    'message'?: string;
    /**
    * Array of options for the popover
    */
    'options': SelectPopoverOption[];
    /**
    * If `true`, the select popover will show a searchbar for radios and checkboxes
    */
    'searchBar': boolean;
    /**
    * The current search string
    */
    'searchString'?: string | null;
    /**
    * Subheader text for the popover
    */
    'subHeader'?: string;
    /**
    * If `true`, the select popover will use a virtual scroll to render radios and checkboxes
    */
    'useVirtualScroll': boolean;
  }
}

declare global {


  interface HTMLGicActionSheetElement extends Components.GicActionSheet, HTMLStencilElement {}
  var HTMLGicActionSheetElement: {
    prototype: HTMLGicActionSheetElement;
    new (): HTMLGicActionSheetElement;
  };

  interface HTMLGicActionSheetControllerElement extends Components.GicActionSheetController, HTMLStencilElement {}
  var HTMLGicActionSheetControllerElement: {
    prototype: HTMLGicActionSheetControllerElement;
    new (): HTMLGicActionSheetControllerElement;
  };

  interface HTMLGicAlertElement extends Components.GicAlert, HTMLStencilElement {}
  var HTMLGicAlertElement: {
    prototype: HTMLGicAlertElement;
    new (): HTMLGicAlertElement;
  };

  interface HTMLGicAlertControllerElement extends Components.GicAlertController, HTMLStencilElement {}
  var HTMLGicAlertControllerElement: {
    prototype: HTMLGicAlertControllerElement;
    new (): HTMLGicAlertControllerElement;
  };

  interface HTMLGicAutocompleteElement extends Components.GicAutocomplete, HTMLStencilElement {}
  var HTMLGicAutocompleteElement: {
    prototype: HTMLGicAutocompleteElement;
    new (): HTMLGicAutocompleteElement;
  };

  interface HTMLGicAutocompleteOptionElement extends Components.GicAutocompleteOption, HTMLStencilElement {}
  var HTMLGicAutocompleteOptionElement: {
    prototype: HTMLGicAutocompleteOptionElement;
    new (): HTMLGicAutocompleteOptionElement;
  };

  interface HTMLGicAutocompletePopoverElement extends Components.GicAutocompletePopover, HTMLStencilElement {}
  var HTMLGicAutocompletePopoverElement: {
    prototype: HTMLGicAutocompletePopoverElement;
    new (): HTMLGicAutocompletePopoverElement;
  };

  interface HTMLGicPopoverElement extends Components.GicPopover, HTMLStencilElement {}
  var HTMLGicPopoverElement: {
    prototype: HTMLGicPopoverElement;
    new (): HTMLGicPopoverElement;
  };

  interface HTMLGicPopoverControllerElement extends Components.GicPopoverController, HTMLStencilElement {}
  var HTMLGicPopoverControllerElement: {
    prototype: HTMLGicPopoverControllerElement;
    new (): HTMLGicPopoverControllerElement;
  };

  interface HTMLGicSelectElement extends Components.GicSelect, HTMLStencilElement {}
  var HTMLGicSelectElement: {
    prototype: HTMLGicSelectElement;
    new (): HTMLGicSelectElement;
  };

  interface HTMLGicSelectOptionElement extends Components.GicSelectOption, HTMLStencilElement {}
  var HTMLGicSelectOptionElement: {
    prototype: HTMLGicSelectOptionElement;
    new (): HTMLGicSelectOptionElement;
  };

  interface HTMLGicSelectPopoverElement extends Components.GicSelectPopover, HTMLStencilElement {}
  var HTMLGicSelectPopoverElement: {
    prototype: HTMLGicSelectPopoverElement;
    new (): HTMLGicSelectPopoverElement;
  };
  interface HTMLElementTagNameMap {
    'gic-action-sheet': HTMLGicActionSheetElement;
    'gic-action-sheet-controller': HTMLGicActionSheetControllerElement;
    'gic-alert': HTMLGicAlertElement;
    'gic-alert-controller': HTMLGicAlertControllerElement;
    'gic-autocomplete': HTMLGicAutocompleteElement;
    'gic-autocomplete-option': HTMLGicAutocompleteOptionElement;
    'gic-autocomplete-popover': HTMLGicAutocompletePopoverElement;
    'gic-popover': HTMLGicPopoverElement;
    'gic-popover-controller': HTMLGicPopoverControllerElement;
    'gic-select': HTMLGicSelectElement;
    'gic-select-option': HTMLGicSelectOptionElement;
    'gic-select-popover': HTMLGicSelectPopoverElement;
  }
}

declare namespace LocalJSX {
  interface GicActionSheet {
    /**
    * If `true`, the action sheet will animate.
    */
    'animated'?: boolean;
    /**
    * If `true`, the action sheet will be dismissed when the backdrop is clicked.
    */
    'backdropDismiss'?: boolean;
    /**
    * An array of buttons for the action sheet.
    */
    'buttons'?: (ActionSheetButton | string)[];
    /**
    * Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces.
    */
    'cssClass'?: string | string[];
    /**
    * Animation to use when the action sheet is presented.
    */
    'enterAnimation'?: AnimationBuilder;
    /**
    * Title for the action sheet.
    */
    'header'?: string;
    /**
    * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
    */
    'keyboardClose'?: boolean;
    /**
    * Animation to use when the action sheet is dismissed.
    */
    'leaveAnimation'?: AnimationBuilder;
    /**
    * Emitted after the alert has dismissed.
    */
    'onIonActionSheetDidDismiss'?: (event: CustomEvent<OverlayEventDetail>) => void;
    /**
    * Emitted after the alert has presented.
    */
    'onIonActionSheetDidPresent'?: (event: CustomEvent<void>) => void;
    /**
    * Emitted before the alert has dismissed.
    */
    'onIonActionSheetWillDismiss'?: (event: CustomEvent<OverlayEventDetail>) => void;
    /**
    * Emitted before the alert has presented.
    */
    'onIonActionSheetWillPresent'?: (event: CustomEvent<void>) => void;
    /**
    * If `true`, the action sheet will show a searchbar for radios and checkboxes
    */
    'searchBar'?: boolean;
    /**
    * The current search string
    */
    'searchString'?: string | null;
    /**
    * Subtitle for the action sheet.
    */
    'subHeader'?: string;
    /**
    * If `true`, the action sheet will be translucent. Only applies when the mode is `"ios"` and the device supports [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
    */
    'translucent'?: boolean;
    /**
    * If `true`, the action sheet will use a virtual scroll to render radios and checkboxes
    */
    'useVirtualScroll'?: boolean;
  }
  interface GicActionSheetController {}
  interface GicAlert {
    /**
    * If `true`, the alert will animate.
    */
    'animated'?: boolean;
    /**
    * If `true`, the alert will be dismissed when the backdrop is clicked.
    */
    'backdropDismiss'?: boolean;
    /**
    * Array of buttons to be added to the alert.
    */
    'buttons'?: (AlertButton | string)[];
    /**
    * Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces.
    */
    'cssClass'?: string | string[];
    /**
    * Animation to use when the alert is presented.
    */
    'enterAnimation'?: AnimationBuilder;
    /**
    * The main title in the heading of the alert.
    */
    'header'?: string;
    /**
    * Array of input to show in the alert.
    */
    'inputs'?: AlertInput[];
    /**
    * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
    */
    'keyboardClose'?: boolean;
    /**
    * Animation to use when the alert is dismissed.
    */
    'leaveAnimation'?: AnimationBuilder;
    /**
    * The main message to be displayed in the alert. `message` can accept either plaintext or HTML as a string. To display characters normally reserved for HTML, they must be escaped. For example `<Ionic>` would become `&lt;Ionic&gt;`  For more information: [Security Documentation](https://ionicframework.com/docs/faq/security)
    */
    'message'?: string;
    /**
    * The mode determines which platform styles to use.
    */
    'mode'?: "ios" | "md";
    /**
    * Emitted after the alert has dismissed.
    */
    'onGicAlertDidDismiss'?: (event: CustomEvent<OverlayEventDetail>) => void;
    /**
    * Emitted after the alert has presented.
    */
    'onGicAlertDidPresent'?: (event: CustomEvent<void>) => void;
    /**
    * Emitted before the alert has dismissed.
    */
    'onGicAlertWillDismiss'?: (event: CustomEvent<OverlayEventDetail>) => void;
    /**
    * Emitted before the alert has presented.
    */
    'onGicAlertWillPresent'?: (event: CustomEvent<void>) => void;
    /**
    * If `true`, the alert will show a searchbar for radios and checkboxes
    */
    'searchBar'?: boolean;
    /**
    * The current search string
    */
    'searchString'?: string | null;
    /**
    * The subtitle in the heading of the alert. Displayed under the title.
    */
    'subHeader'?: string;
    /**
    * If `true`, the alert will be translucent. Only applies when the mode is `"ios"` and the device supports [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
    */
    'translucent'?: boolean;
    /**
    * If `true`, the alert will use a virtual scroll to render radios and checkboxes
    */
    'useVirtualScroll'?: boolean;
  }
  interface GicAlertController {}
  interface GicAutocomplete {
    /**
    * Any additional options that the `popover` interface can take. See the [PopoverController API docs](../../popover/PopoverController/#create) for the create options for each interface.
    */
    'interfaceOptions'?: any;
    /**
    * The mode determines which platform styles to use.
    */
    'mode'?: Mode;
    'placeholder'?: string;
    'value'?: string | null;
  }
  interface GicAutocompleteOption {
    /**
    * The text value of the option.
    */
    'value'?: any | null;
  }
  interface GicAutocompletePopover {
    /**
    * Array of options for the popover
    */
    'options'?: AutocompletePopoverOption[];
    'searchStr'?: string;
  }
  interface GicPopover {
    /**
    * If `true`, the popover will animate.
    */
    'animated'?: boolean;
    /**
    * If `true`, the popover will be dismissed when the backdrop is clicked.
    */
    'backdropDismiss'?: boolean;
    /**
    * The component to display inside of the popover.
    */
    'component': ComponentRef;
    /**
    * The data to pass to the popover component.
    */
    'componentProps'?: ComponentProps;
    /**
    * Additional classes to apply for custom CSS. If multiple classes are provided they should be separated by spaces.
    */
    'cssClass'?: string | string[];
    /**
    * Animation to use when the popover is presented.
    */
    'enterAnimation'?: AnimationBuilder;
    /**
    * The event to pass to the popover animation.
    */
    'event'?: any;
    /**
    * If `true`, the keyboard will be automatically dismissed when the overlay is presented.
    */
    'keyboardClose'?: boolean;
    /**
    * Animation to use when the popover is dismissed.
    */
    'leaveAnimation'?: AnimationBuilder;
    /**
    * The mode determines which platform styles to use.
    */
    'mode'?: "ios" | "md";
    /**
    * Emitted after the popover has dismissed.
    */
    'onIonPopoverDidDismiss'?: (event: CustomEvent<OverlayEventDetail>) => void;
    /**
    * Emitted after the popover has presented.
    */
    'onIonPopoverDidPresent'?: (event: CustomEvent<void>) => void;
    /**
    * Emitted before the popover has dismissed.
    */
    'onIonPopoverWillDismiss'?: (event: CustomEvent<OverlayEventDetail>) => void;
    /**
    * Emitted before the popover has presented.
    */
    'onIonPopoverWillPresent'?: (event: CustomEvent<void>) => void;
    /**
    * If `true`, a backdrop will be displayed behind the popover.
    */
    'showBackdrop'?: boolean;
    /**
    * If `true`, the popover will be translucent. Only applies when the mode is `"ios"` and the device supports [`backdrop-filter`](https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter#Browser_compatibility).
    */
    'translucent'?: boolean;
  }
  interface GicPopoverController {}
  interface GicSelect {
    /**
    * The text to display on the cancel button.
    */
    'cancelText'?: string;
    /**
    * A property name or function used to compare object values
    */
    'compareWith'?: string | SelectCompareFn | null;
    /**
    * If `true`, the user cannot interact with the select.
    */
    'disabled'?: boolean;
    /**
    * The interface the select should use: `action-sheet`, `popover` or `alert`.
    */
    'interface'?: SelectInterface;
    /**
    * Any additional options that the `alert`, `action-sheet` or `popover` interface can take. See the [AlertController API docs](../../alert/AlertController/#create), the [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) and the [PopoverController API docs](../../popover/PopoverController/#create) for the create options for each interface.
    */
    'interfaceOptions'?: any;
    /**
    * The mode determines which platform styles to use.
    */
    'mode'?: Mode;
    /**
    * If `true`, the select can accept multiple values.
    */
    'multiple'?: boolean;
    /**
    * The name of the control, which is submitted with the form data.
    */
    'name'?: string;
    /**
    * The text to display on the ok button.
    */
    'okText'?: string;
    /**
    * Emitted when the select loses focus.
    */
    'onIonBlur'?: (event: CustomEvent<void>) => void;
    /**
    * Emitted when the selection is cancelled.
    */
    'onIonCancel'?: (event: CustomEvent<void>) => void;
    /**
    * Emitted when the value has changed.
    */
    'onIonChange'?: (event: CustomEvent<SelectChangeEventDetail>) => void;
    /**
    * Emitted when the select has focus.
    */
    'onIonFocus'?: (event: CustomEvent<void>) => void;
    /**
    * The text to display when the select is empty.
    */
    'placeholder'?: string | null;
    /**
    * If `true`, the select will show a searchbar for radios and checkboxes
    */
    'searchBar'?: boolean;
    /**
    * The text to display instead of the selected option's value.
    */
    'selectedText'?: string | null;
    /**
    * If `true`, the buttons list will be rendered in a virtual scroll
    */
    'useVirtualScroll'?: boolean;
    /**
    * the value of the select.
    */
    'value'?: any | null;
  }
  interface GicSelectOption {
    /**
    * If `true`, the user cannot interact with the select option.
    */
    'disabled'?: boolean;
    /**
    * If `true`, the element is selected.
    */
    'selected'?: boolean;
    /**
    * The text value of the option.
    */
    'value'?: any | null;
  }
  interface GicSelectPopover {
    /**
    * Header text for the popover
    */
    'header'?: string;
    /**
    * Text for popover body
    */
    'message'?: string;
    /**
    * Array of options for the popover
    */
    'options'?: SelectPopoverOption[];
    /**
    * If `true`, the select popover will show a searchbar for radios and checkboxes
    */
    'searchBar'?: boolean;
    /**
    * The current search string
    */
    'searchString'?: string | null;
    /**
    * Subheader text for the popover
    */
    'subHeader'?: string;
    /**
    * If `true`, the select popover will use a virtual scroll to render radios and checkboxes
    */
    'useVirtualScroll'?: boolean;
  }

  interface IntrinsicElements {
    'gic-action-sheet': GicActionSheet;
    'gic-action-sheet-controller': GicActionSheetController;
    'gic-alert': GicAlert;
    'gic-alert-controller': GicAlertController;
    'gic-autocomplete': GicAutocomplete;
    'gic-autocomplete-option': GicAutocompleteOption;
    'gic-autocomplete-popover': GicAutocompletePopover;
    'gic-popover': GicPopover;
    'gic-popover-controller': GicPopoverController;
    'gic-select': GicSelect;
    'gic-select-option': GicSelectOption;
    'gic-select-popover': GicSelectPopover;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements {
      'gic-action-sheet': LocalJSX.GicActionSheet & JSXBase.HTMLAttributes<HTMLGicActionSheetElement>;
      'gic-action-sheet-controller': LocalJSX.GicActionSheetController & JSXBase.HTMLAttributes<HTMLGicActionSheetControllerElement>;
      'gic-alert': LocalJSX.GicAlert & JSXBase.HTMLAttributes<HTMLGicAlertElement>;
      'gic-alert-controller': LocalJSX.GicAlertController & JSXBase.HTMLAttributes<HTMLGicAlertControllerElement>;
      'gic-autocomplete': LocalJSX.GicAutocomplete & JSXBase.HTMLAttributes<HTMLGicAutocompleteElement>;
      'gic-autocomplete-option': LocalJSX.GicAutocompleteOption & JSXBase.HTMLAttributes<HTMLGicAutocompleteOptionElement>;
      'gic-autocomplete-popover': LocalJSX.GicAutocompletePopover & JSXBase.HTMLAttributes<HTMLGicAutocompletePopoverElement>;
      'gic-popover': LocalJSX.GicPopover & JSXBase.HTMLAttributes<HTMLGicPopoverElement>;
      'gic-popover-controller': LocalJSX.GicPopoverController & JSXBase.HTMLAttributes<HTMLGicPopoverControllerElement>;
      'gic-select': LocalJSX.GicSelect & JSXBase.HTMLAttributes<HTMLGicSelectElement>;
      'gic-select-option': LocalJSX.GicSelectOption & JSXBase.HTMLAttributes<HTMLGicSelectOptionElement>;
      'gic-select-popover': LocalJSX.GicSelectPopover & JSXBase.HTMLAttributes<HTMLGicSelectPopoverElement>;
    }
  }
}


