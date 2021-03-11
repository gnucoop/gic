import type { Components, JSX } from "../dist/types/interface";

interface GicPopover extends Components.GicPopover, HTMLElement {}
export const GicPopover: {
  prototype: GicPopover;
  new (): GicPopover;
};
