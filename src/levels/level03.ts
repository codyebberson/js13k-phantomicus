import { explodeSound } from '../audio/sounds/explode';
import { Key } from '../entities/key';
import {
  createCoinRow,
  createCommonGhost,
  createDeadPipe,
  createExitPipe,
  createGround,
  createSymmetricPipe,
  createWall,
  resetWorld,
} from './utils';

export const initLevel03 = (): void => {
  resetWorld(-160, -24);

  createGround(0, 0, 200, 50);

  // Back wall
  createWall(0, 4, 200, 1);

  // Front wall
  createWall(0, -50, 200, 1, 0);

  // Create 4 rooms = 5 walls each
  for (let x = -200; x <= 200; x += 100) {
    createWall(x, -25, 1, 25);
  }

  // Each room is 100 units wide
  // Each room has 2 pipes
  // 35 + 30 + 35 = 100

  // Room 1
  createDeadPipe(-165, 0);
  createSymmetricPipe(-135, 0, -75); // To room 2
  createCoinRow(-165, -30, 0, -5, 4);
  createCoinRow(-135, -30, 0, -5, 4);

  // Room 2
  createSymmetricPipe(-35, 0, 35); // To room 3
  createCoinRow(-75, -30, 0, -5, 4);
  createCoinRow(-35, -30, 0, -5, 4);

  // Room 3 exit pipe
  const exit = createExitPipe(65, 0);

  // Ghost in room 3
  const ghost = createCommonGhost(20, -40, 80, -40);
  ghost.onDeath = () => {
    explodeSound.playOnce();
    new Key(65, 8, -12, exit);
  };
};
