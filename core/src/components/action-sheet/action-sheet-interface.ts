import { ActionSheetButton as BaseActionSheetButton, ActionSheetOptions as BaseActionSheetOptions } from '@ionic/core';

export interface ActionSheetOptions extends BaseActionSheetOptions {
  searchBar?: boolean;
  useVirtualScroll?: boolean;
}

export type ActionSheetButton = BaseActionSheetButton;
