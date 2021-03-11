import type { Components, JSX } from "../dist/types/interface";

interface GicSelect extends Components.GicSelect, HTMLElement {}
export const GicSelect: {
  prototype: GicSelect;
  new (): GicSelect;
};
