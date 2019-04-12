import { Animation, AnimationBuilder } from '@ionic/core/dist/types/interface';

import { Animator } from './animator';

export function create(animationBuilder?: AnimationBuilder, baseEl?: any, opts?: any): Promise<Animation> {
  if (animationBuilder) {
    return animationBuilder(Animator as any, baseEl, opts);
  }
  return Promise.resolve(new Animator() as any);
}
