import { CssClassMap } from '@ionic/core/dist/types/interface';

export function getClassList(classes: string | (string | null | undefined)[] | undefined): string[] {
  if (classes !== undefined) {
    const array = Array.isArray(classes) ? classes : classes.split(' ');
    return array
      .filter(c => c != null)
      .map(c => (c as string).trim())
      .filter(c => c !== '');
  }
  return [];
}

export function getClassMap(classes: string | string[] | undefined): CssClassMap {
  const map: CssClassMap = {};
  getClassList(classes).forEach(c => map[c] = true);
  return map;
}

export function hostContext(selector: string, el: HTMLElement): boolean {
  return el.closest(selector) !== null;
}
