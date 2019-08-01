import { Mode } from '@ionic/core';
import { Component, ComponentInterface, Listen, Prop, Watch, h } from '@stencil/core';

import { SelectPopoverOption } from '../../interface';

/**
 * @internal
 */
@Component({
  tag: 'gic-select-popover',
  styleUrl: 'select-popover.scss',
  scoped: true
})
export class SelectPopover implements ComponentInterface {

  mode!: Mode;

  /** Header text for the popover */
  @Prop() header?: string;

  /** Subheader text for the popover */
  @Prop() subHeader?: string;

  /** Text for popover body */
  @Prop() message?: string;

  /** Array of options for the popover */
  @Prop({ mutable: true }) options: SelectPopoverOption[] = [];

  /**
   * If `true`, the alert will show a searchbar for radios and checkboxes
   */
  @Prop() searchBar = true;

  /**
   * The current search string
   */
  @Prop({ mutable: true }) searchString?: string | null = '';

  private processedOptions: SelectPopoverOption[] = [];

  @Listen('ionSelect')
  onSelect(ev: any) {
    const option = this.options.find(o => o.value === ev.target.value);
    if (option && option.handler) {
      option.handler();
    }
  }

  @Watch('options')
  @Watch('searchString')
  optionsChanged() {
    const options = this.options;
    const search = (this.searchString || '').trim();
    const regex = new RegExp(search, 'i');
    this.processedOptions = search.length === 0
      ? options
      : options.filter(o => regex.test(o.text || ''));
  }

  componentWillLoad() {
    this.optionsChanged();
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

  render() {
    return (
      <ion-list>
        {this.header !== undefined && <ion-list-header>{this.header}</ion-list-header>}
        { (this.subHeader !== undefined || this.message !== undefined) &&
          <ion-item>
            <ion-label text-wrap>
              {this.subHeader !== undefined && <h3>{this.subHeader}</h3>}
              {this.message !== undefined && <p>{this.message}</p>}
            </ion-label>
          </ion-item>
        }
        {this.renderSearchBar()}
        <ion-radio-group>
          {this.processedOptions.map(option =>
            <ion-item>
              <ion-label>
                {option.text}
              </ion-label>
              <ion-radio
                checked={option.checked}
                value={option.value}
                disabled={option.disabled}
              >
              </ion-radio>
            </ion-item>
          )}
        </ion-radio-group>
      </ion-list>
    );
  }
}
