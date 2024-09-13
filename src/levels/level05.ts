import { createExitPipe, createSymmetricPipe, initBasicLevel, resetWorld } from './utils';

export const initLevel05 = (): void => {
  resetWorld(0, -16);

  initBasicLevel(40, 20);

  // 3-pipe puzzle

  createSymmetricPipe(-30, 16, 0);

  const exit = createExitPipe(30, 16);
  exit.locked = false;
};
