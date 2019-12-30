import { OverlayController } from '@ionic/core';
import { Build, Component, ComponentInterface, Method } from '@stencil/core';

import { ActionSheetOptions } from '../../interface';
import { createOverlay, dismissOverlay, getOverlay } from '../../utils/overlays';

/**
 * @deprecated Use the `actionSheetController` exported from core.
 */
@Component({
  tag: 'gic-action-sheet-controller'
})
export class ActionSheetController implements ComponentInterface, OverlayController {

  constructor() {
    if (Build.isDev) {
      console.warn(`[DEPRECATED][gic-action-sheet-controller] Use the actionSheetController export from @gic/core:
  import { actionSheetController } from '@gic/core';
  const actionSheet = await actionSheetController.create({...});`);
    }
  }

  /**
   * Create an action sheet overlay with action sheet options.
   *
   * @param options The options to use to create the action sheet.
   */
  @Method()
  create(options: ActionSheetOptions): Promise<HTMLGicActionSheetElement> {
    return createOverlay('gic-action-sheet', options);
  }

  /**
   * Dismiss the open action sheet overlay.
   *
   * @param data Any data to emit in the dismiss events.
   * @param role The role of the element that is dismissing the action sheet.
   * This can be useful in a button handler for determining which button was
   * clicked to dismiss the action sheet.
   * Some examples include: ``"cancel"`, `"destructive"`, "selected"`, and `"backdrop"`.
   * @param id The id of the action sheet to dismiss. If an id is not provided, it will dismiss the most recently opened action sheet.
   */
  @Method()
  dismiss(data?: any, role?: string, id?: string) {
    return dismissOverlay(document, data, role, 'gic-action-sheet', id);
  }

  /**
   * Get the most recently opened action sheet overlay.
   */
  @Method()
  async getTop(): Promise<HTMLGicActionSheetElement | undefined> {
    return getOverlay(document, 'gic-action-sheet') as HTMLGicActionSheetElement;
  }
}
