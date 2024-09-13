import { Key } from '../entities/key';
import { createBoxWall, createCoinRow, createCommonGhost, createExitPipe, initBasicLevel, resetWorld } from './utils';

export const initLevel09 = (): void => {
  resetWorld(0, -40);
  initBasicLevel(50, 50);

  createCoinRow(-45, -20, 5, 0, 18);

  createBoxWall(-40, -20, 10, 5);
  createBoxWall(-10, 10, 10, 5);
  createBoxWall(20, 40, 10, 5);

  // Create a ghost behind wall #3
  createCommonGhost(30, 16, 30, 16);

  const exit = createExitPipe(0, 46);
  new Key(-30, 8, 15, exit);
};
