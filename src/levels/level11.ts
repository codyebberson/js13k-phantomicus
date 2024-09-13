import { createExitPipe, createSymmetricPipe, initBasicLevel, resetWorld } from './utils';

export const initLevel11 = (): void => {
  resetWorld(0, -16);

  initBasicLevel(80, 20);

  // 4-pipe puzzle
  // 1 and 5 are connected
  // 3 and 4 are connected
  // 2 is the exit

  createSymmetricPipe(-60, 16, 60);
  createSymmetricPipe(0, 16, 30);

  const exit = createExitPipe(-30, 16);
  exit.locked = false;
};
