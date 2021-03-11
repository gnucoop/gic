import type { Components, JSX } from "../dist/types/interface";

interface GicAlert extends Components.GicAlert, HTMLElement {}
export const GicAlert: {
  prototype: GicAlert;
  new (): GicAlert;
};
