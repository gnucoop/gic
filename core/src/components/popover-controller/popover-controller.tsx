import { ComponentRef, OverlayController, PopoverOptions } from '@ionic/core/dist/types/interface';
import { Component, ComponentInterface, Method, Prop } from '@stencil/core';

import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'gic-popover-controller',
})
export class PopoverController implements ComponentInterface, OverlayController {

  @Prop({ context: 'document' }) doc!: Document;

  /**
   * Create a popover overlay with popover options.
   */
  @Method()
  create<T extends ComponentRef>(opts: PopoverOptions<T>): Promise<HTMLIonPopoverElement> {
    return createOverlay('gic-popover', opts);
  }

  /**
   * Dismiss the open popover overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(this.doc, data, role, 'gic-popover', id);
  }

  /**
   * Get the most recently opened popover overlay.
   */
  @Method()
  async getTop(): Promise<HTMLIonPopoverElement | undefined> {
    return getOverlay(this.doc, 'gic-popover') as HTMLIonPopoverElement;
  }
}
