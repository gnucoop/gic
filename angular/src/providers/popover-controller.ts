import { DOCUMENT } from '@angular/common';
import { ComponentFactoryResolver, Inject, Injectable, Injector } from '@angular/core';
import { PopoverOptions } from '@gic/core';
import { AngularDelegate } from '@ionic/angular';

import { OverlayBaseController } from '../util/overlay';

@Injectable()
export class PopoverController extends OverlayBaseController<PopoverOptions, HTMLIonPopoverElement> {

  constructor(
    private angularDelegate: AngularDelegate,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    @Inject(DOCUMENT) doc: any
  ) {
    super('gic-popover-controller', doc);
  }

  create(opts: PopoverOptions): Promise<HTMLIonPopoverElement> {
    return super.create({
      ...opts,
      delegate: this.angularDelegate.create(this.resolver, this.injector)
    });
  }
}
