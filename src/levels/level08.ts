import { createExitPipe, createSymmetricPipe, initBasicLevel, resetWorld } from './utils';

export const initLevel08 = (): void => {
  resetWorld(0, -16);

  initBasicLevel(80, 20);

  // 4-pipe puzzle
  // 1 and 5 are connected
  // 2 and 3 are connected
  // 4 is the exit

  createSymmetricPipe(-60, 16, 60);
  createSymmetricPipe(-30, 16, 0);

  const exit = createExitPipe(30, 16);
  exit.locked = false;
};
