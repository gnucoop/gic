import { Component, ComponentInterface, Method, Prop } from '@stencil/core';

import { ActionSheetOptions, OverlayController } from '@ionic/core/dist/types/interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

@Component({
  tag: 'gic-action-sheet-controller'
})
export class ActionSheetController implements ComponentInterface, OverlayController {

  @Prop({ context: 'document' }) doc!: Document;

  /**
   * Create an action sheet overlay with action sheet options.
   */
  @Method()
  create(opts: ActionSheetOptions): Promise<HTMLIonActionSheetElement> {
    return createOverlay(this.doc.createElement('gic-action-sheet'), opts);
  }

  /**
   * Dismiss the open action sheet overlay.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(this.doc, data, role, 'gic-action-sheet', id);
  }

  /**
   * Get the most recently opened action sheet overlay.
   */
  @Method()
  async getTop(): Promise<HTMLIonActionSheetElement | undefined> {
    return getOverlay(this.doc, 'gic-action-sheet') as HTMLIonActionSheetElement;
  }
}
