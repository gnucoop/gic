import { Injectable } from '@angular/core';
import { AlertOptions, alertController } from '@gic/core';

import { OverlayBaseController } from '../util/overlay';

@Injectable({
  providedIn: 'root',
})
export class AlertController extends OverlayBaseController<AlertOptions, HTMLGicAlertElement> {
  constructor() {
    super(alertController);
  }
}
