import { Key } from '../entities/key';
import { Scientist } from '../entities/scientist';
import { player, showDialogs } from '../main';
import { rotateYQuat } from '../math/quat';
import { createVec3 } from '../math/vec3';
import { createCoinRow, createDeadPipe, createExitPipe, dropBoxes, initBasicLevel, resetWorld } from './utils';

export const initLevel02 = (): void => {
  resetWorld(-80, 0);
  rotateYQuat(player.shape.rotation, player.shape.rotation, 1.6);

  initBasicLevel(100, 25);

  createCoinRow(0, 0, 5, 0, 12);

  // Entrance pipe
  createDeadPipe(-80, 21);

  new Scientist(-50, 0, 20, () =>
    showDialogs(['Pardon the mess!', 'The key is around here somewhere.', 'Try vacuuming up the boxes.'])
  );

  // Pipe to next level
  const pipe = createExitPipe(60, 21);

  // Put the key down first
  new Key(60, 6, 0, pipe);

  // Create some random boxes on top
  dropBoxes(createVec3(0, 8, 0), 20, 1.5, 0.5);
  dropBoxes(createVec3(30, 8, 0), 20, 1.5, 0.5);
  dropBoxes(createVec3(60, 8, 0), 20, 1.5, 0.5);
};
