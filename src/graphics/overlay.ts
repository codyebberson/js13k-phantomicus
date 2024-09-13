import { overlayCtx } from '../globals';

export const OVERLAY_WHITE = '#fff';
export const OVERLAY_BLACK = '#000';
export const OVERLAY_GREEN = '#0f0';
export const OVERLAY_RED = '#f00';

export const setGlobalAlpha = (alpha: number): number => (overlayCtx.globalAlpha = alpha);

export const drawText = (str: string, x: number, y: number, fillColor = OVERLAY_BLACK): void => {
  overlayCtx.fillStyle = fillColor;
  overlayCtx.fillText(str, x, y);
};

export const drawShadowText = (
  str: string,
  x: number,
  y: number,
  fillColor = OVERLAY_WHITE,
  background?: string
): void => {
  if (background) {
    const width = overlayCtx.measureText(str).width * 1.1;
    overlayCtx.fillStyle = background;
    overlayCtx.beginPath();
    overlayCtx.arc(x, y + 4, width / 2 + 8, 0, Math.PI * 2);
    overlayCtx.fill();
  }
  for (const line of str.split('\n')) {
    drawText(line, x + 1, y + 1);
    drawText(line, x, y, fillColor);
    y += 24;
  }
};

export const setFontSize = (size: number, style = 'bold'): void => {
  overlayCtx.font = `${style} ${size}px sans-serif`;
};

export const setTextAlign = (alignment: CanvasTextAlign): void => {
  overlayCtx.textAlign = alignment;
};

export const fillRect = (x: number, y: number, width: number, height: number, color: string): void => {
  overlayCtx.fillStyle = color;
  overlayCtx.fillRect(x, y, width, height);
};

export const fillEllipse = (x: number, y: number, radiusX: number, radiusY: number, color: string): void => {
  overlayCtx.fillStyle = color;
  overlayCtx.beginPath();
  overlayCtx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
  overlayCtx.fill();
};
