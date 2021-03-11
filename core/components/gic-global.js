import { getMode } from '@stencil/core/internal/client';

let defaultMode;
const getGicMode = (ref) => {
  return (ref && getMode(ref)) || defaultMode;
};

export { getGicMode as g };
