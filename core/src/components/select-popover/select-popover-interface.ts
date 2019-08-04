import { SelectPopoverOption as BaseSelectPopoverOption } from '@ionic/core';

export interface SelectPopoverOption extends BaseSelectPopoverOption {
  searchBar?: boolean;
  useVirtualScroll?: boolean;
}
