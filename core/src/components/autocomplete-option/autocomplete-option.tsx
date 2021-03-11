import { Component, ComponentInterface, Element, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
  tag: 'gic-autocomplete-option',
  shadow: true,
  styleUrl: 'autocomplete-option.scss'
})
export class SelectOption implements ComponentInterface {

  private optId = `gic-acopt-${autocompleteOptionIds++}`;

  @Element() el!: HTMLElement;

  /**
   * The text value of the option.
   */
  @Prop({ mutable: true }) value?: any | null;

  /**
   * Emitted when the autocomplete option loads.
   * @internal
   */
  @Event() ionAutocompleteOptionDidLoad!: EventEmitter<void>;

  /**
   * Emitted when the autocomplete option unloads.
   * @internal
   */
  @Event() ionAutocompleteOptionDidUnload!: EventEmitter<void>;

  componentWillLoad() {
    if (this.value === undefined) {
      this.value = this.el.textContent || '';
    }
  }

  componentDidLoad() {
    this.ionAutocompleteOptionDidLoad.emit();
  }

  disconnectedCallback() {
    this.ionAutocompleteOptionDidUnload.emit();
  }

  hostData() {
    return {
      'role': 'option',
      'id': this.optId
    };
  }
}

let autocompleteOptionIds = 0;
