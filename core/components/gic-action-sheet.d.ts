import type { Components, JSX } from "../dist/types/interface";

interface GicActionSheet extends Components.GicActionSheet, HTMLElement {}
export const GicActionSheet: {
  prototype: GicActionSheet;
  new (): GicActionSheet;
};
