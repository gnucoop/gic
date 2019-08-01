import { Animation, AnimationBuilder } from '@ionic/core';

import { Animator } from './animator';

export const create = (animationBuilder?: AnimationBuilder, baseEl?: any, opts?: any): Promise<Animation> => {
  if (animationBuilder) {
    return animationBuilder(Animator as any, baseEl, opts);
  }
  return Promise.resolve(new Animator() as any);
};
