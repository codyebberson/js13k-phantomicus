import { watch } from '../ai/watch';
import { explodeSound } from '../audio/sounds/explode';
import { GameEntity } from '../entities/entity';
import { Ghost } from '../entities/ghost';
import { Key } from '../entities/key';
import { Scientist } from '../entities/scientist';
import { gameState, showDialogs } from '../main';
import { rotateYQuat } from '../math/quat';
import { createVec3, setVec3 } from '../math/vec3';
import { Box } from '../physics/box';
import { STATIC_MASS } from '../physics/shape';
import { createCoinRow, createExitPipe, createGround, createWall, resetWorld } from './utils';

/**
 * Lobby level
 */
export const initLevel01 = (): void => {
  resetWorld(0, 4);

  // Hallway
  createGround(0, 40, 30, 40);
  createWall(-30, 40, 1, 40);
  createWall(30, 40, 1, 40);
  createCoinRow(0, 20, 0, 4, 3);
  createCoinRow(0, 40, 0, 4, 3);

  // Main lobby
  createGround(0, 120, 80, 40);
  createWall(-80, 120, 1, 40);
  createWall(80, 120, 1, 40);
  createWall(0, 140, 80, 1);
  createCoinRow(-70, 84, 4, 0, 8);
  createCoinRow(70, 84, -4, 0, 8);

  // Invisible front walls
  createWall(0, 0, 80, 1, 0);
  createWall(-55, 80, 25, 1, 0);
  createWall(55, 80, 25, 1, 0);

  new Scientist(0, 0, 130, () =>
    showDialogs([
      'Oh, thank goodness you are here!',
      'Use your ghost-vacuum to capture ghosts.',
      'Then take the pipe to the next floor. Hurry!',
    ])
  );

  const desk = new GameEntity(new Box(STATIC_MASS, createVec3(8, 1.5, 4)));
  setVec3(desk.shape.center, 0, 1.5, 138.0 - 14);

  const pipe = createExitPipe(40, 136);

  const ghost1 = new Ghost(-50, 6, 115);
  ghost1.ai = watch;
  rotateYQuat(ghost1.shape.rotation, ghost1.shape.rotation, 2);
  ghost1.onDeath = () => {
    explodeSound.playOnce();
    new Key(-67, 8, 117, pipe);
  };

  // Lobby camera
  gameState.cameraYOffset = 30;
  gameState.cameraZOffset = -40;
};
