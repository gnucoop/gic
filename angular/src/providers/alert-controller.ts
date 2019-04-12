import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { ɵd as OverlayBaseController } from '@ionic/angular';
import { AlertOptions } from '@ionic/core';

@Injectable({
  providedIn: 'root',
})
export class AlertController extends OverlayBaseController<AlertOptions, HTMLIonAlertElement> {
  constructor(@Inject(DOCUMENT) doc: any) {
    super('gic-alert-controller', doc);
  }
}
