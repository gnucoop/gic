export interface GicGlobal {
  config?: any;
  asyncQueue?: boolean;
}

export interface GicWindow extends Window {
  Gic: GicGlobal;
  __zone_symbol__requestAnimationFrame?: (ts: FrameRequestCallback) => number;
}

export interface HTMLStencilElement extends HTMLElement {
  componentOnReady(): Promise<this>;
  forceUpdate(): void;
}
