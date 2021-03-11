import type { Components, JSX } from "../dist/types/interface";

interface GicSelectOption extends Components.GicSelectOption, HTMLElement {}
export const GicSelectOption: {
  prototype: GicSelectOption;
  new (): GicSelectOption;
};
