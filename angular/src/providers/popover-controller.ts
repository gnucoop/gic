import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { PopoverOptions, popoverController } from '@gic/core';
import { AngularDelegate } from '@ionic/angular';

import { OverlayBaseController } from '../util/overlay';

@Injectable()
export class PopoverController extends OverlayBaseController<PopoverOptions, HTMLGicPopoverElement> {
  constructor(
    private angularDelegate: AngularDelegate,
    private resolver: ComponentFactoryResolver,
    private injector: Injector
  ) {
    super(popoverController);
  }

  create(opts: PopoverOptions): Promise<HTMLGicPopoverElement> {
    return super.create({
      ...opts,
      delegate: this.angularDelegate.create(this.resolver, this.injector),
    });
  }
}
