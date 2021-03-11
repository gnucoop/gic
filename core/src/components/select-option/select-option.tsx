import { Component, ComponentInterface, Element, Host, Prop, h } from '@stencil/core';

import { getGicMode } from '../../global/gic-global';

@Component({
  tag: 'gic-select-option',
  shadow: true,
  styleUrl: 'select-option.scss'
})
export class SelectOption implements ComponentInterface {

  private inputId = `gic-selopt-${selectOptionIds++}`;

  @Element() el!: HTMLElement;

  /**
   * If `true`, the user cannot interact with the select option.
   */
  @Prop() disabled = false;

  /**
   * The text value of the option.
   */
  @Prop() value?: any | null;

  render() {
    return (
      <Host
        role="option"
        id={this.inputId}
        class={getGicMode(this)}
      >
      </Host>
    );
  }
}

let selectOptionIds = 0;
