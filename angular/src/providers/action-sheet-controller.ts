import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ActionSheetOptions } from '@gic/core';

import { OverlayBaseController } from '../util/overlay';

@Injectable({
  providedIn: 'root',
})
export class ActionSheetController extends OverlayBaseController<ActionSheetOptions, HTMLIonActionSheetElement> {
  constructor(@Inject(DOCUMENT) doc: any) {
    super('gic-action-sheet-controller', doc);
  }
}
