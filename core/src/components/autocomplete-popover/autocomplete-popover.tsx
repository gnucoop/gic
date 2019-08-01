import { Mode } from '@ionic/core';
import { Component, ComponentInterface, Prop, h } from '@stencil/core';

import { AutocompletePopoverOption } from '../../interface';

/**
 * @internal
 */
@Component({
  tag: 'gic-autocomplete-popover',
  styleUrl: 'autocomplete-popover.scss',
  scoped: true
})
export class AutocompletePopover implements ComponentInterface {

  mode!: Mode;

  /** Array of options for the popover */
  @Prop({ mutable: true }) options: AutocompletePopoverOption[] = [];

  @Prop({ mutable: true }) searchStr?: string;

  onClick = (ev: any) => {
    const option = this.options.find(o => o.text === ev.target.textContent);
    if (option && option.handler) {
      option.handler();
    }
  }

  render() {
    return (
      <ion-list>
        {this.options.map(option =>
          <ion-item onClick={this.onClick}>
            <ion-label>
              {option.text}
            </ion-label>
          </ion-item>
        )}
      </ion-list>
    );
  }
}
