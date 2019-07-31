import { OverlayController } from '@ionic/core/dist/types/interface';
import { Component, ComponentInterface, Method, Prop } from '@stencil/core';

import { AlertOptions } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'gic-alert-controller'
})
export class AlertController implements ComponentInterface, OverlayController {

  @Prop({ context: 'document' }) doc!: Document;

  /**
   * Create an alert overlay with alert options
   */
  @Method()
  create(opts: AlertOptions): Promise<HTMLIonAlertElement> {
    return createOverlay('gic-alert', opts);
  }

  /**
   * Dismiss the open alert overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(this.doc, data, role, 'gic-alert', id);
  }

  /**
   * Get the most recently opened alert overlay.
   */
  @Method()
  async getTop(): Promise<HTMLIonAlertElement | undefined> {
    return getOverlay(this.doc, 'gic-alert') as HTMLIonAlertElement;
  }
}
