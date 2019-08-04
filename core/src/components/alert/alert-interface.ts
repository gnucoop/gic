import {
  AlertButton as BaseAlertButton, AlertInput as BaseAlertInput, AlertOptions as BaseAlertOptions
} from '@ionic/core';

export type AlertButton = BaseAlertButton;
export type AlertInput = BaseAlertInput;
export interface AlertOptions extends BaseAlertOptions {
  searchBar?: boolean;
  useVirtualScroll?: boolean;
}
