import { HEIGHT, WIDTH } from '../globals';
import { createMat4, multiplyMat4 } from '../math/mat4';
import { Vec3, createVec3, transformMat4Vec3 } from '../math/vec3';
import { modelViewMatrix, projectionMatrix } from './engine';
import { drawShadowText, setFontSize, setTextAlign } from './overlay';

const worldTextMat4 = createMat4();
const worldTextVec3 = createVec3();

export const drawWorldText = (msg: string, pos: Vec3, color: string, size = 16): void => {
  setFontSize(size);
  multiplyMat4(worldTextMat4, projectionMatrix, modelViewMatrix);
  transformMat4Vec3(worldTextVec3, pos, worldTextMat4);
  if (worldTextVec3[2] > 0) {
    setTextAlign('center');
    drawShadowText(msg, (1 + worldTextVec3[0]) * 0.5 * WIDTH, (1 - worldTextVec3[1]) * 0.5 * HEIGHT, color);
  }
};
