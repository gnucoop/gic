import { PopoverOptions as BasePopoverOptions } from '@ionic/core';

import { ComponentRef } from '../../interface';

export type PopoverOptions<T extends ComponentRef = ComponentRef> = BasePopoverOptions<T>;
