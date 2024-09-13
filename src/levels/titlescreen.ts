import { GameEntity } from '../entities/entity';
import { Pipe } from '../entities/pipe';
import { STATIC_CUBES } from '../graphics/constants';
import { camera, drawLists, updateBuffers } from '../graphics/engine';
import { STATIC_DRAW } from '../graphics/glconstants';
import { gameState } from '../main';
import { scaleMat4, translateMat4 } from '../math/mat4';
import { createVec3, setVec3 } from '../math/vec3';
import { Box } from '../physics/box';
import { STATIC_MASS } from '../physics/shape';
import { resetWorld } from './utils';

export const initTitleScreen = (): void => {
  resetWorld(0, -32);

  // Ground
  const ground = new GameEntity(new Box(STATIC_MASS, createVec3(400, 1, 400)));
  ground.color = 0xff304050;
  setVec3(ground.shape.center, 0, -1, 0);

  new Pipe(0, 6, -4, [createVec3(0, 4, -4)]);

  // Building
  {
    const m = drawLists[STATIC_CUBES].addInstance(0xff808080);
    translateMat4(m, m, 0, 100, 10);
    scaleMat4(m, m, 100, 100, 10);
  }

  // Windows
  for (let x = -80; x <= 80; x += 20) {
    for (let y = 22; y <= 190; y += 40) {
      const m = drawLists[STATIC_CUBES].addInstance(Math.random() < 0.5 ? 0xff00a0a0 : 0xff00ffff);
      translateMat4(m, m, x, y, 0);
      scaleMat4(m, m, 4, 4, 0.5);
    }
  }

  updateBuffers(STATIC_DRAW);

  // Cinematic camera
  setVec3(camera.source, 0, 300, -200);
  gameState.cameraYOffset = 40;
  gameState.cameraZOffset = -50;
  gameState.cameraLerpRate = 0.02;
  // camera.near = 0;
  // camera.far = 120;
};
