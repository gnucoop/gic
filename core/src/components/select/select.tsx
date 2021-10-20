import { CssClassMap, OverlaySelect, StyleEventDetail } from '@ionic/core';
import { Component, ComponentInterface, Element, Event, EventEmitter, Host, Method, Prop, State, Watch, h } from '@stencil/core';

import { getGicMode } from '../../global/gic-global';
import { ActionSheetButton, ActionSheetOptions, AlertInput, AlertOptions, PopoverOptions, SelectChangeEventDetail, SelectInterface, SelectPopoverOption } from '../../interface';
import { findItemLabel, getAriaLabel, renderHiddenInput } from '../../utils/helpers';
import { actionSheetController, alertController, popoverController } from '../../utils/overlays';
import { hostContext } from '../../utils/theme';
import { watchForOptions } from '../../utils/watch-options';

import { SelectCompareFn } from './select-interface';

@Component({
  tag: 'gic-select',
  styleUrls: {
    ios: 'select.ios.scss',
    md: 'select.md.scss'
  },
  shadow: true
})
export class Select implements ComponentInterface {

  private inputId = `ion-sel-${selectIds++}`;
  private overlay?: OverlaySelect;
  private didInit = false;
  private focusEl?: HTMLButtonElement;
  private mutationO?: MutationObserver;

  @Element() el!: HTMLGicSelectElement;

  @State() isExpanded = false;

  /**
   * If `true`, the user cannot interact with the select.
   */
  @Prop() disabled = false;

  /**
   * The text to display on the cancel button.
   */
  @Prop() cancelText = 'Cancel';

  /**
   * The text to display on the ok button.
   */
  @Prop() okText = 'OK';

  /**
   * The text to display when the select is empty.
   */
  @Prop() placeholder?: string | null;

  /**
   * The name of the control, which is submitted with the form data.
   */
  @Prop() name: string = this.inputId;

  /**
   * The text to display instead of the selected option's value.
   */
  @Prop() selectedText?: string | null;

  /**
   * If `true`, the select can accept multiple values.
   */
  @Prop() multiple = false;

  /**
   * The interface the select should use: `action-sheet`, `popover` or `alert`.
   */
  @Prop() interface: SelectInterface = 'alert';

  /**
   * Any additional options that the `alert`, `action-sheet` or `popover` interface
   * can take. See the [AlertController API docs](../../alert/AlertController/#create), the
   * [ActionSheetController API docs](../../action-sheet/ActionSheetController/#create) and the
   * [PopoverController API docs](../../popover/PopoverController/#create) for the
   * create options for each interface.
   */
  @Prop() interfaceOptions: any = {};

  /**
   * A property name or function used to compare object values
   */
  @Prop() compareWith?: string | SelectCompareFn | null;

  /**
   * If `true`, the select will show a searchbar for radios and checkboxes
   */
  @Prop() searchBar = true;

  /**
   * If `true`, the buttons list will be rendered in a virtual scroll
   */
  @Prop() useVirtualScroll = true;

  /**
   * the value of the select.
   */
  @Prop({ mutable: true }) value?: any | null;

  /**
   * Emitted when the value has changed.
   */
  @Event() ionChange!: EventEmitter<SelectChangeEventDetail>;

  /**
   * Emitted when the selection is cancelled.
   */
  @Event() ionCancel!: EventEmitter<void>;

  /**
   * Emitted when the select has focus.
   */
  @Event() ionFocus!: EventEmitter<void>;

  /**
   * Emitted when the select loses focus.
   */
  @Event() ionBlur!: EventEmitter<void>;

  /**
   * Emitted when the styles change.
   * @internal
   */
  @Event() ionStyle!: EventEmitter<StyleEventDetail>;

  @Watch('disabled')
  @Watch('placeholder')
  disabledChanged() {
    this.emitStyle();
  }

  @Watch('value')
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

    this.mutationO = watchForOptions<HTMLIonSelectOptionElement>(this.el, 'gic-select-option', async () => {
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
  @Method()
  async open(ev?: UIEvent): Promise<any> {
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

  private createOverlay(ev?: UIEvent): Promise<OverlaySelect> {
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
      return this.openPopover(ev!);
    }
    if (selectInterface === 'action-sheet') {
      return this.openActionSheet();
    }
    return this.openAlert();
  }

  private updateOverlayOptions(): void {
    if (!this.overlay) { return; }
    const overlay = (this.overlay as any);
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

  private createActionSheetButtons(data: HTMLGicSelectOptionElement[], selectValue: any): ActionSheetButton[] {
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
      } as ActionSheetButton;
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

  private createAlertInputs(data: HTMLGicSelectOptionElement[], inputType: 'checkbox' | 'radio', selectValue: any): AlertInput[] {
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

  private createPopoverOptions(data: HTMLIonSelectOptionElement[], selectValue: any): SelectPopoverOption[] {
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

  private async openPopover(ev: UIEvent) {
    const interfaceOptions = this.interfaceOptions;
    const mode = getGicMode(this);
    const showBackdrop = mode === 'md' ? false : true;
    const value = this.value;
    const searchBar = this.searchBar;
    const useVirtualScroll = this.useVirtualScroll;

    let event: Event | CustomEvent = ev;
    let size = 'auto';

    const item = this.el.closest('ion-item');

    // If the select is inside of an item containing a floating
    // or stacked label then the popover should take up the
    // full width of the item when it presents
    if (item && (item.classList.contains('item-label-floating') || item.classList.contains('item-label-stacked'))) {
      event = {
        ...ev,
        detail: {
          ionShadowTarget: item
        }
      }
      size = 'cover';
    }

    const popoverOpts: PopoverOptions = {
      mode,
      event,
      alignment: 'center',
      size,
      showBackdrop,
      ...interfaceOptions,

      component: 'gic-select-popover',
      cssClass: ['select-popover', interfaceOptions.cssClass],
      componentProps: {
        header: interfaceOptions.header,
        subHeader: interfaceOptions.subHeader,
        message: interfaceOptions.message,
        value,
        searchBar,
        useVirtualScroll,
        options: this.createPopoverOptions(this.childOpts, value)
      }
    };
    return popoverController.create(popoverOpts);
  }

  private async openActionSheet() {
    const mode = getGicMode(this);
    const interfaceOptions = this.interfaceOptions;
    const actionSheetOpts: ActionSheetOptions = {
      mode,
      ...interfaceOptions,

      buttons: this.createActionSheetButtons(this.childOpts, this.value),
      cssClass: ['select-action-sheet', interfaceOptions.cssClass]
    };
    return actionSheetController.create(actionSheetOpts);
  }

  private async openAlert() {
    const label = this.getLabel();
    const labelText = (label) ? label.textContent : null;

    const interfaceOptions = this.interfaceOptions;
    const inputType = (this.multiple ? 'checkbox' : 'radio');
    const mode = getGicMode(this);

    const alertOpts: AlertOptions = {
      mode,
      ...interfaceOptions,

      header: interfaceOptions.header ? interfaceOptions.header : labelText,
      inputs: this.createAlertInputs(this.childOpts, inputType, this.value),
      searchBar: this.searchBar,
      useVirtualScroll: this.useVirtualScroll,
      buttons: [
        {
          text: this.cancelText,
          role: 'cancel',
          handler: () => {
            this.ionCancel.emit();
          }
        },
        {
          text: this.okText,
          handler: (selectedValues: any) => {
            this.value = selectedValues;
          }
        }
      ],
      cssClass: ['select-alert', interfaceOptions.cssClass,
                 (this.multiple ? 'multiple-select-alert' : 'single-select-alert')]
    };
    return alertController.create(alertOpts);
  }

  /**
   * Close the select interface.
   */
  private close(): Promise<boolean> {
    // TODO check !this.overlay || !this.isFocus()
    if (!this.overlay) {
      return Promise.resolve(false);
    }
    return this.overlay.dismiss();
  }

  private getLabel() {
    return findItemLabel(this.el);
  }

  private hasValue(): boolean {
    return this.getText() !== '';
  }

  private get childOpts() {
    return Array.from(this.el.querySelectorAll('gic-select-option'));
  }

  private getText(): string {
    const selectedText = this.selectedText;
    if (selectedText != null && selectedText !== '') {
      return selectedText;
    }
    return generateText(this.childOpts, this.value, this.compareWith);
  }

  private setFocus() {
    if (this.focusEl) {
      this.focusEl.focus();
    }
  }

  private emitStyle() {
    this.ionStyle.emit({
      'interactive': true,
      'select': true,
      'has-placeholder': this.placeholder != null,
      'has-value': this.hasValue(),
      'interactive-disabled': this.disabled,
      'select-disabled': this.disabled
    });
  }

  private onClick = (ev: UIEvent) => {
    this.setFocus();
    this.open(ev);
  }

  private onFocus = () => {
    this.ionFocus.emit();
  }

  private onBlur = () => {
    this.ionBlur.emit();
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

    const selectTextClasses: CssClassMap = {
      'select-text': true,
      'select-placeholder': addPlaceholderClass
    };

    const textPart = addPlaceholderClass ? 'placeholder' : 'text';

    const displayLabel = labelText !== undefined
      ? (selectText !== '' ? `${selectText}, ${labelText}` : labelText)
      : selectText;
    return (
        <Host
          onClick={this.onClick}
          role="button"
          aria-haspopup="listbox"
          aria-disabled={disabled ? 'true' : null}
          aria-label={displayLabel}
          class={{
            [mode]: true,
            'in-item': hostContext('ion-item', el),
            'select-disabled': disabled,
            'select-expanded': isExpanded
          }}
        >
          <div aria-hidden="true" class={selectTextClasses} part={textPart}>
            {selectText}
          </div>
          <div class="select-icon" role="presentation" part="icon">
            <div class="select-icon-inner"></div>
          </div>
          <label id={labelId}>
            {displayLabel}
          </label>
          <button
            type="button"
            disabled={disabled}
            id={inputId}
            aria-labelledby={labelId}
            aria-haspopup="listbox"
            aria-expanded={`${isExpanded}`}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            ref={(focusEl => this.focusEl = focusEl)}
          ></button>
        </Host>
      );
  }
}

const isOptionSelected = (currentValue: any[] | any, compareValue: any, compareWith?: string | SelectCompareFn | null) => {
  if (currentValue === undefined) {
    return false;
  }
  if (Array.isArray(currentValue)) {
    return currentValue.some(val => compareOptions(val, compareValue, compareWith));
  } else {
    return compareOptions(currentValue, compareValue, compareWith);
  }
};

const getOptionValue = (el: HTMLIonSelectOptionElement) => {
  const value = el.value;
  return (value === undefined)
    ? el.textContent || ''
    : value;
};

const parseValue = (value: any) => {
  if (value == null) {
    return undefined;
  }
  if (Array.isArray(value)) {
    return value.join(',');
  }
  return value.toString();
};

const compareOptions = (currentValue: any, compareValue: any, compareWith?: string | SelectCompareFn | null): boolean => {
  if (typeof compareWith === 'function') {
    return compareWith(currentValue, compareValue);
  } else if (typeof compareWith === 'string') {
    return currentValue[compareWith] === compareValue[compareWith];
  } else {
    return Array.isArray(compareValue) ? compareValue.includes(currentValue) : currentValue === compareValue;
  }
};

const generateText = (opts: HTMLGicSelectOptionElement[], value: any | any[], compareWith?: string | SelectCompareFn | null) => {
  if (value === undefined) {
    return '';
  }
  if (Array.isArray(value)) {
    return value
      .map(v => textForValue(opts, v, compareWith))
      .filter(opt => opt !== null)
      .join(', ');
  } else {
    return textForValue(opts, value, compareWith) || '';
  }
};

const textForValue = (opts: HTMLGicSelectOptionElement[], value: any, compareWith?: string | SelectCompareFn | null): string | null => {
  const selectOpt = opts.find(opt => {
    return compareOptions(opt.value, value, compareWith);
  });
  return selectOpt
    ? selectOpt.textContent
    : null;
};

let selectIds = 0;

const OPTION_CLASS = 'select-interface-option';
