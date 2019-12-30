import { Injectable } from '@angular/core';
import { ActionSheetOptions, actionSheetController } from '@gic/core';

import { OverlayBaseController } from '../util/overlay';

@Injectable({
  providedIn: 'root',
})
export class ActionSheetController extends OverlayBaseController<ActionSheetOptions, HTMLGicActionSheetElement> {
  constructor() {
    super(actionSheetController);
  }
}
