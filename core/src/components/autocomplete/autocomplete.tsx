import { Component, Element, ComponentInterface, Prop } from '@stencil/core';

import { Mode, PopoverOptions } from '@ionic/core/dist/types/interface';
import { AutocompletePopoverOption } from '../../interface';

@Component({
  tag: 'gic-autocomplete',
  styleUrls: {
    ios: 'autocomplete.ios.scss',
    md: 'autocomplete.md.scss'
  },
  shadow: true
})
export class AutoComplete implements ComponentInterface {
  @Element() el!: HTMLIonSelectElement;

  /**
   * The mode determines which platform styles to use.
   */
  @Prop() mode!: Mode;

  @Prop({ mutable: true }) value: string | null = null;
  @Prop() placeholder?: string;
  @Prop({ connect: 'gic-popover-controller' }) popoverCtrl!: HTMLIonPopoverControllerElement;
  @Prop({ context: 'window' }) win!: Window;

  /**
   * Any additional options that the `popover` interface
   * can take. See the [PopoverController API docs](../../popover/PopoverController/#create)
   * for the create options for each interface.
   */
  @Prop() interfaceOptions: any = {};

  private popoverId = `gic-acpopover-${autocompleteId++}`;
  private childOpts: HTMLGicAutocompleteOptionElement[] = [];
  private options: string[] = [];
  private isOpen: boolean = false;

  private searchValue: string = '';
  // private filteredOptions: string[] = [];
  // private hasFocus: boolean = false;
  private overlay?: HTMLIonPopoverElement;
  private evt?: CustomEvent<void>;

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

  onIonFocus = (ev: CustomEvent<void>) => {
    this.showHints(ev);
  }

  private async showHints(ev?: CustomEvent<void>) {
    if (ev != null) {
      this.evt = ev;
    }
    if (this.options.indexOf(this.value || '') !== -1) {
      return;
    }
    if (this.overlay == null && !this.isOpen) {
      this.isOpen = true;
      this.overlay = await this.createOverlay(ev || this.evt);
      this.overlay.onDidDismiss().then(() => {
        this.overlay = undefined;
        this.isOpen = false;
      });
      this.overlay.present();
    }
    if (this.overlay == null) { return; }
    const popovers = this.overlay.getElementsByTagName('gic-autocomplete-popover');
    if (popovers.length > 0) {
      const popover = popovers.item(0) as HTMLGicAutocompletePopoverElement;
      popover.options = this.createPopoverOptions(this.options);
    }
  }

  private createOverlay(ev?: CustomEvent<void>): Promise<HTMLIonPopoverElement> {
    const interfaceOptions = this.interfaceOptions;

    const popoverOpts: PopoverOptions = {
      mode: this.mode,
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
    return this.popoverCtrl.create(popoverOpts);
  }

  onInput = (ev: Event) => {
    const input = ev.target as HTMLIonInputElement | null;
    if (input) {
      this.searchValue = input.value || '';
      if (this.options.indexOf(this.searchValue || '') === -1) {
        this.value = null;
      }
      this.updateOptionsList();
      this.showHints();
    }
  }

  render() {
    const value = this.value || '';

    return (
      <ion-input value={value}
          placeholder={this.placeholder}
          onIonFocus={this.onIonFocus}
          onIonChange={this.onInput}></ion-input>
    );
  }
}

let autocompleteId = 0;
