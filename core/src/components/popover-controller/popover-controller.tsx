import { OverlayController } from '@ionic/core';
import { Build, Component, ComponentInterface, Method } from '@stencil/core';

import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

/**
 * @deprecated Use the `popoverController` exported from core.
 */
@Component({
  tag: 'gic-popover-controller',
})
export class PopoverController implements ComponentInterface, OverlayController {

  constructor() {
    if (Build.isDev) {
      console.warn(`[DEPRECATED][gic-popover-controller] Use the popoverController export from @gic/core:
  import { popoverController } from '@gic/core';
  const popover = await popoverController.create({...});`);
    }
  }

  /**
   * Create a popover overlay with popover options.
   *
   * @param options The options to use to create the popover.
   */
  @Method()
  create(options: any): Promise<HTMLGicPopoverElement> {
    return createOverlay('gic-popover', options);
  }

  /**
   * Dismiss the open popover overlay.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the popover.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the popover.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   * @param id The id of the popover to dismiss. If an id is not provided, it will dismiss the most recently opened popover.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(document, data, role, 'gic-popover', id);
  }

  /**
   * Get the most recently opened popover overlay.
   */
  @Method()
  async getTop(): Promise<HTMLGicPopoverElement | undefined> {
    return getOverlay(document, 'gic-popover') as HTMLGicPopoverElement;
  }
}
