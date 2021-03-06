import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';

import { getGicMode } from '../../global/gic-global';
import { AutocompletePopoverOption, PopoverOptions } from '../../interface';
import { popoverController } from '../../utils/overlays';

@Component({
  tag: 'gic-autocomplete',
  styleUrls: {
    ios: 'autocomplete.ios.scss',
    md: 'autocomplete.md.scss'
  },
  shadow: true
})
export class AutoComplete implements ComponentInterface {
  @Element() el!: HTMLGicSelectElement;

  @Prop({ mutable: true }) value: string | null = null;
  @Prop() placeholder?: string;

  /**
   * Any additional options that the `popover` interface
   * can take. See the [PopoverController API docs](../../popover/PopoverController/#create)
   * for the create options for each interface.
   */
  @Prop() interfaceOptions: any = {};

  private popoverId = `gic-acpopover-${autocompleteId++}`;
  private childOpts: HTMLGicAutocompleteOptionElement[] = [];
  private options: string[] = [];
  private isOpen = false;

  private searchValue = '';
  // private filteredOptions: string[] = [];
  // private hasFocus: boolean = false;
  private overlay?: HTMLGicPopoverElement;
  private evt?: CustomEvent<FocusEvent>;

  async componentDidLoad() {
    await this.loadOptions();
    this.updateOptionsList();
  }

  /**
   * Close the autocomplete popover.
   */
  private close(): Promise<boolean> {
    // TODO check !this.overlay || !this.isFocus()
    if (!this.overlay) {
      return Promise.resolve(false);
    }
    return this.overlay.dismiss();
  }

  private updateOptionsList() {
    const options = (this.childOpts || []).map(o => o.value);
    const searchValue = (this.searchValue || '').trim();
    const regex = new RegExp('^' + searchValue, 'i');
    this.options = searchValue.length > 0 ? options.filter(o => regex.test(o)) : options;
  }

  private createPopoverOptions(data: string[]): AutocompletePopoverOption[] {
    return data.map(o => {
      return {
        text: o,
        handler: () => {
          this.value = o;
          this.searchValue = '';
          this.close();
        }
      } as AutocompletePopoverOption;
    });
  }

  private async loadOptions() {
    this.childOpts = await Promise.all(
      Array.from(this.el.querySelectorAll('gic-autocomplete-option')).map(o => o.componentOnReady())
    );
  }

  onIonFocus = (ev: CustomEvent<FocusEvent>) => {
    this.showHints(ev);
  }

  private async showHints(ev?: CustomEvent<FocusEvent>) {
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
    if (this.overlay === undefined) { return; }
    const popovers = this.overlay.getElementsByTagName('gic-autocomplete-popover');
    if (popovers.length > 0) {
      const popover = popovers.item(0) as HTMLGicAutocompletePopoverElement;
      popover.options = this.createPopoverOptions(this.options);
    }
  }

  private createOverlay(ev?: CustomEvent<FocusEvent>): Promise<HTMLGicPopoverElement> {
    const mode = getGicMode(this);
    const interfaceOptions = this.interfaceOptions;

    const popoverOpts: PopoverOptions = {
      mode,
      ...interfaceOptions,
      showBackdrop: false,
      backdropDismiss: false,
      translucent: false,
      animated: false,
      component: 'gic-autocomplete-popover',
      cssClass: ['select-popover', interfaceOptions.cssClass],
      event: ev,
      id: this.popoverId,
      componentProps: {
        options: this.createPopoverOptions(this.options)
      }
    };
    return popoverController.create(popoverOpts);
  }

  onInput = (ev: Event) => {
    const input = ev.target as HTMLIonInputElement | null;
    if (input) {
      this.searchValue = typeof input.value === 'string' ? input.value : '';
      if (this.options.indexOf(this.searchValue || '') === -1) {
        this.value = null;
      }
      this.updateOptionsList();
      this.showHints();
    }
  }

  render() {
    const mode = getGicMode(this);
    const value = this.value || '';

    return (
      <Host
        class={{
          [mode]: true,
        }}
      >
        <ion-input
            value={value}
            placeholder={this.placeholder}
            onIonFocus={this.onIonFocus}
            onIonChange={this.onInput}
        >
        </ion-input>
      </Host>
    );
  }
}

let autocompleteId = 0;
