declare const __zone_symbol__requestAnimationFrame: any;
declare const requestAnimationFrame: any;

export const componentOnReady =
    (el: any, callback: any) => {
      if (el.componentOnReady) {
        el.componentOnReady().then(callback);
      } else {
        callback();
      }
    }

export const getElementRoot = (el: HTMLElement, fallback: HTMLElement = el) => {
  return el.shadowRoot || fallback;
};

export const raf = (h: any) => {
  if (typeof __zone_symbol__requestAnimationFrame === 'function') {
    return __zone_symbol__requestAnimationFrame(h);
  }
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(h);
  }
  return setTimeout(h);
};

export const hasShadowDom = (el: HTMLElement) => {
  return !!el.shadowRoot && !!(el as any).attachShadow;
};

export const findItemLabel = (componentEl: HTMLElement) => {
  const itemEl = componentEl.closest('ion-item');
  if (itemEl) {
    return itemEl.querySelector('ion-label');
  }
  return null;
};

export const renderHiddenInput =
    (always: boolean, container: HTMLElement, name: string,
     value: string | undefined | null, disabled: boolean) => {
      if (always || hasShadowDom(container)) {
        let input =
            container.querySelector('input.aux-input') as HTMLInputElement |
            null;
        if (!input) {
          input = container.ownerDocument!.createElement('input');
          input.type = 'hidden';
          input.classList.add('aux-input');
          container.appendChild(input);
        }
        input.disabled = disabled;
        input.name = name;
        input.value = value || '';
      }
    };

export const getAriaLabel = (componentEl: HTMLElement, inputId: string): {
  label: Element | null,
  labelId: string,
  labelText: string | null | undefined
} => {
  let labelText;

  // If the user provides their own label via the aria-labelledby attr
  // we should use that instead of looking for an ion-label
  const labelledBy = componentEl.getAttribute('aria-labelledby');

  // Grab the id off of the component in case they are using
  // a custom label using the label element
  const componentId = componentEl.id;

  let labelId = labelledBy !== null && labelledBy.trim() !== '' ?
      labelledBy :
      inputId + '-lbl';

  let label = labelledBy !== null && labelledBy.trim() !== '' ?
      document.getElementById(labelledBy) :
      findItemLabel(componentEl);

  if (label) {
    if (labelledBy === null) {
      label.id = labelId;
    }

    labelText = label.textContent;
    label.setAttribute('aria-hidden', 'true');

    // if there is no label, check to see if the user has provided
    // one by setting an id on the component and using the label element
  } else if (componentId.trim() !== '') {
    label = document.querySelector(`label[for="${componentId}"]`);

    if (label) {
      if (label.id !== '') {
        labelId = label.id;
      } else {
        label.id = labelId = `${componentId}-lbl`;
      }

      labelText = label.textContent;
    }
  }

  return { label, labelId, labelText };
};
