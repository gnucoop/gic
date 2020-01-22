import { Cell } from '@ionic/core';
import { Component, ComponentInterface, Host, Listen, Prop, Watch, h } from '@stencil/core';

import { getGicMode } from '../../global/gic-global';
import { SelectPopoverOption } from '../../interface';
import { safeCall } from '../../utils/overlays';

/**
 * @internal
 */
@Component({
  tag: 'gic-select-popover',
  styleUrl: 'select-popover.scss',
  scoped: true
})
export class SelectPopover implements ComponentInterface {

  /** Header text for the popover */
  @Prop() header?: string;

  /** Subheader text for the popover */
  @Prop() subHeader?: string;

  /** Text for popover body */
  @Prop() message?: string;

  /** Array of options for the popover */
  @Prop() options: SelectPopoverOption[] = [];

  /**
   * If `true`, the select popover will show a searchbar for radios and checkboxes
   */
  @Prop() searchBar = false;

  /**
   * If `true`, the select popover will use a virtual scroll to render radios and checkboxes
   */
  @Prop() useVirtualScroll = false;

  /**
   * The current search string
   */
  @Prop({ mutable: true }) searchString?: string | null = '';

  private processedOptions: SelectPopoverOption[] = [];

  @Listen('ionSelect')
  onSelect(ev: any) {
    const option = this.options.find(o => o.value === ev.target.value);
    if (option) {
      safeCall(option.handler);
    }
  }

  @Watch('searchString')
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

  private onSearchChange = (ev: Event) => {
    const input = ev.target as HTMLIonInputElement | null;
    if (input) {
      this.searchString = input.value || '';
    }
  }

  private resetSearch = () => {
    this.searchString = '';
  }

  private renderSearchBar() {
    if (!this.searchBar || this.options.length === 0) { return null; }
    const searchString = this.searchString || '';
    return (
      <ion-item>
        <ion-icon slot="start" icon="search"></ion-icon>
        <ion-input
            value={searchString}
            onIonChange={this.onSearchChange}
        >
        </ion-input>
        <ion-button slot="end" fill="clear" onClick={this.resetSearch}>
          <ion-icon slot="icon-only" icon="close"></ion-icon>
        </ion-button>
      </ion-item>
    );
  }

  private renderRadioNode(el: HTMLElement | null, cell: Cell) {
    const option = cell.value as SelectPopoverOption;
    if (el) {
      const label = el.querySelector('ion-label')!;
      label.textContent = `${option.text}`;
      const radio = el.querySelector('ion-radio')!;
      radio.setAttribute('value', `${option.value}`);
      if (option.checked) {
        radio.setAttribute('checked', 'checked');
      } else {
        radio.removeAttribute('checked');
      }
      if (option.disabled) {
        radio.setAttribute('disabled', 'disabled');
      } else {
        radio.removeAttribute('disabled');
      }
    }
    return el!;
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
    return (
      <Host class={mode}>
        <ion-list>
          {this.header !== undefined && <ion-list-header>{this.header}</ion-list-header>}
          { (this.subHeader !== undefined || this.message !== undefined) &&
            <ion-item>
              <ion-label class="ion-text-wrap">
                {this.subHeader !== undefined && <h3>{this.subHeader}</h3>}
                {this.message !== undefined && <p>{this.message}</p>}
              </ion-label>
            </ion-item>
          }
          {this.searchBar && this.renderSearchBar()}
          <ion-radio-group value={checkedValue}>
          {this.useVirtualScroll
          ?
          <ion-content class="select-popover-vs">
            <ion-virtual-scroll
              items={this.processedOptions}
              nodeRender={(el, cell) => this.renderRadioNode(el, cell)}
            >
              <template innerHTML={radioTemplate}></template>
            </ion-virtual-scroll>
          </ion-content>
          : this.processedOptions.map(option =>
              <ion-item>
                <ion-label>
                  {option.text}
                </ion-label>
                <ion-radio
                  value={option.value}
                  disabled={option.disabled}
                >
                </ion-radio>
              </ion-item>
            )}
          </ion-radio-group>
        </ion-list>
      </Host>
    );
  }
}
