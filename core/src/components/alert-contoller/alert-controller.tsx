import { OverlayController } from '@ionic/core';
import { Build, Component, ComponentInterface, Method } from '@stencil/core';

import { AlertOptions } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

/**
 * @deprecated Use the `alertController` exported from core.
 */
@Component({
  tag: 'gic-alert-controller'
})
export class AlertController implements ComponentInterface, OverlayController {

  constructor() {
    if (Build.isDev) {
      console.warn(`[DEPRECATED][gic-alert-controller] Use the alertController export from @gic/core:
  import { alertController } from '@gic/core';
  const alert = await alertController.create({...});`);
    }
  }

  /**
   * Create an alert overlay with alert options.
   *
   * @param options The options to use to create the alert.
   */
  @Method()
  create(options: AlertOptions): Promise<HTMLGicAlertElement> {
    return createOverlay('gic-alert', options);
  }

  /**
   * Dismiss the open alert overlay.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the alert.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the alert.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   * @param id The id of the alert to dismiss. If an id is not provided, it will dismiss the most recently opened alert.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(document, data, role, 'gic-alert', id);
  }

  /**
   * Get the most recently opened alert overlay.
   */
  @Method()
  async getTop(): Promise<HTMLGicAlertElement | undefined> {
    return getOverlay(document, 'gic-alert') as HTMLGicAlertElement;
  }
}
