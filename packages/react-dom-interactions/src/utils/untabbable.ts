import {isShadowRoot, isElement} from './is';
import {getDocument} from './getDocument';
import {contains} from './contains';
import {SELECTOR} from '../FloatingFocusManager';

function selectAll(
  rootElement: HTMLElement,
  list: HTMLElement[] = []
): HTMLElement[] {
  const allElements = Array.from(
    getDocument(rootElement).querySelectorAll(SELECTOR)
  ) as HTMLElement[];

  return allElements
    .map((currentElement) => {
      if (isShadowRoot(currentElement) && isElement(currentElement)) {
        return selectAll(currentElement, list);
      }

      return currentElement;
    })
    .flat();
}

export function untabbableOutside(element: HTMLElement) {
  const allElements = selectAll(element);

  const outsideElements = allElements
    .filter((node) => !contains(element, node))
    .map((node) => ({
      node,
      tabIndex: node.getAttribute('tabindex'),
    }));

  outsideElements.forEach(({node}) => {
    node.setAttribute('tabindex', '-1');
  });

  return () => {
    outsideElements.forEach(({node, tabIndex}) => {
      if (tabIndex) {
        node.setAttribute('tabindex', tabIndex);
      } else {
        node.removeAttribute('tabindex');
      }
    });
  };
}
