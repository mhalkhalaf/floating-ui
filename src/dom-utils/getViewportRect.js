// @flow
import getWindow from './getWindow';
import getDocumentElement from './getDocumentElement';
import getWindowScrollBarX from './getWindowScrollBarX';

export default function getViewportRect(element: Element) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;

  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;

    // Uses Layout Viewport (like Chrome; Safari does not currently)
    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
    // errors due to floating point numbers, so we need to check precision.
    // Safari returns a number <= 0, usually <= 1 when pinch-zoomed
    if (
      Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
      0.001
    ) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return {
    width,
    height,
    x: x + getWindowScrollBarX(element),
    y,
  };
}
