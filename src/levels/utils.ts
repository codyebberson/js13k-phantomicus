import { createPatrol } from '../ai/patrol';
import { explodeSound } from '../audio/sounds/explode';
import { Coin } from '../entities/coin';
import { GameEntity, entities } from '../entities/entity';
import { Ghost } from '../entities/ghost';
import { Key } from '../entities/key';
import { Pipe } from '../entities/pipe';
import { createHsvColor } from '../graphics/colors';
import { STATIC_CUBES } from '../graphics/constants';
import { camera, drawLists, lightSource, resetBuffers } from '../graphics/engine';
import { DYNAMIC_DRAW, STATIC_DRAW } from '../graphics/glconstants';
import { resetInputs } from '../input/utils';
import { gameState, nextLevel, player } from '../main';
import { scaleMat4, translateMat4 } from '../math/mat4';
import { identityQuat, rotateXQuat, rotateYQuat } from '../math/quat';
import { Vec3, copyVec3, createVec3, setVec3 } from '../math/vec3';
import { Box } from '../physics/box';
import { STATIC_MASS } from '../physics/shape';
import { clamp, symmetricRandom, unitRandom } from '../utils';

export const resetWorld = (x: number, z: number) => {
  // Reset entities
  entities.length = 0;

  // Reset inputs (keyboard, mouse, gamepad)
  resetInputs();

  // Reset graphics buffers
  resetBuffers(DYNAMIC_DRAW);
  resetBuffers(STATIC_DRAW);

  // Reset game state
  gameState.bossTriggered = false;
  gameState.nextSpawnTime = 0;
  gameState.wave = 0;

  // Hide dialogs
  gameState.dialogCurrentOpacity = 0;
  gameState.dialogTargetOpacity = 0;

  // Player is a special case
  // Add the player back to the entities list
  player.health = 100;
  player.power = 0;
  player.ai = undefined;
  player.shape.noclip = false;
  setVec3(player.shape.center, x, 4, z);
  setVec3(player.shape.velocity, 0, 0, 0);
  setVec3(player.shape.angularVelocity, 0, 0, 0);
  identityQuat(player.shape.rotation);
  entities.push(player);

  // Reset camera
  gameState.cameraYOffset = 40;
  gameState.cameraZOffset = -50;
  gameState.cameraLerpRate = 0.1;
  // camera.near = 0;
  // camera.far = 120;
  setVec3(camera.source, x, 200, z - 50);
  copyVec3(camera.lookAt, player.shape.center);

  // Reset light level
  lightSource.ambientLight = 0.6;
};

export const createGround = (x: number, z: number, halfWidth: number, halfDepth: number, color = 0xff304050): void => {
  const ground = new GameEntity(new Box(STATIC_MASS, createVec3(halfWidth, 4, halfDepth)));
  ground.color = color;
  setVec3(ground.shape.center, x, -4, z);
};

export const createCheckerboard = (): void => {
  // Create a checkerboard pattern
  for (let x = -200; x <= 200; x += 8) {
    for (let z = -200; z <= 200; z += 8) {
      if ((x + z) % 16 === 0) {
        const m = drawLists[STATIC_CUBES].addInstance(0xff000000);
        translateMat4(m, m, x, 0, z);
        scaleMat4(m, m, 4, 0.01, 4);
      }
    }
  }
};

export const createWall = (x: number, z: number, halfWidth: number, halfDepth: number, color = 0xff708090): void => {
  const backWall = new GameEntity(new Box(STATIC_MASS, createVec3(halfWidth, 16, halfDepth)));
  backWall.color = color;
  setVec3(backWall.shape.center, x, 16, z);
};

export const createCoinRow = (x: number, z: number, dx: number, dz: number, count: number): void => {
  for (let i = 0; i < count; i++) {
    new Coin(x + i * dx, 4, z + i * dz);
  }
};

export const createDeadPipe = (x: number, z: number): Pipe => new Pipe(x, 6, z);

export const createCommonPipe = (x: number, z: number, x2: number): Pipe =>
  new Pipe(x, 6, z, [
    createVec3(x, 5, z - 4),
    createVec3(x, 5, z + 12),
    createVec3(x2, 5, z + 12),
    createVec3(x2, 5, z - 13),
  ]);

export const createSymmetricPipe = (x: number, z: number, x2: number): Pipe => {
  createCommonPipe(x2, z, x);
  return createCommonPipe(x, z, x2);
};

export const createExitPipe = (x: number, z: number): Pipe =>
  new Pipe(x, 6, z, [createVec3(x, 5, z - 4), createVec3(x, 5, z + 200)], nextLevel, true);

export const createCommonGhost = (x1: number, z1: number, x2: number, z2: number): Ghost => {
  const ghost1 = new Ghost(x1, 4, z1);
  ghost1.ai = createPatrol([
    createVec3(x1, 4, z1),
    createVec3(x2, 4, z1),
    createVec3(x2, 4, z2),
    createVec3(x1, 4, z2),
  ]);
  return ghost1;
};

export const randomBoxColor = (): number => createHsvColor(unitRandom(), 0.6, 0.95);

export const dropBoxes = (center: Vec3, count: number, size: number, mass: number): void => {
  // Drop a bunch of random boxes on top of the player
  // const size = 0.1 + unitRandom() * 3.0;
  // const mass = size ** 3;
  for (let i = 0; i < count; i++) {
    const newBox = new GameEntity(new Box(mass, createVec3(size, size, size)));
    // newBox.shape.restitution = 1; // super bouncy
    newBox.shape.velocity[1] = 10;
    newBox.color = randomBoxColor();
    setVec3(
      newBox.shape.center,
      center[0] + 4 * symmetricRandom(),
      center[1] + 4 * i,
      center[2] + 4 * symmetricRandom()
    );
    rotateXQuat(newBox.shape.rotation, newBox.shape.rotation, unitRandom());
    rotateYQuat(newBox.shape.rotation, newBox.shape.rotation, unitRandom());
  }
};

export const createBoxWall = (startX: number, endX: number, z: number, mass = 2, size = 2): void => {
  for (let y = 0; y < 3; y++) {
    for (let x = startX; x <= endX; x += size * 2) {
      const newBox = new GameEntity(new Box(mass, createVec3(size, size, size)));
      newBox.color = randomBoxColor();
      setVec3(newBox.shape.center, x, 1 + y * 2 * size, z);
    }
  }
};

export const initBasicLevel = (halfWidth: number, halfDepth: number): void => {
  // Ground
  createGround(0, 0, halfWidth, halfDepth);

  // Back wall
  createWall(0, halfDepth, halfWidth, 1);

  // Left wall
  createWall(-halfWidth, 0, 1, halfDepth);

  // Front wall
  createWall(0, -halfDepth, halfWidth, 1, 0);

  // Right wall
  createWall(halfWidth, 0, 1, halfDepth);
};

export const initGhostHuntLevel = (size: number): void => {
  resetWorld(0, -size + 4);

  initBasicLevel(size, size);
  createCheckerboard();
  createCoinRow(-size + 8, -size + 4, 8, 0, (2 * (size - 8)) / 8);

  const exit = createExitPipe(0, size - 4);

  // Ghost count
  // If size = 100, then 10 ghosts
  // If size = 30, then 3 ghosts
  const ghostCount = (size / 10) | 0;

  for (let i = 0; i < ghostCount; i++) {
    const p1 = createVec3(symmetricRandom() * size, 10, symmetricRandom() * size * 0.5);
    const p2 = createVec3(symmetricRandom() * size, 10, symmetricRandom() * size * 0.5);
    const ghost = new Ghost(p1[0], p1[1], p1[2]);
    ghost.ai = createPatrol([p1, p2]);
    if (i === 0) {
      ghost.onDeath = () => {
        explodeSound.playOnce();
        new Key(ghost.shape.center[0], 10, clamp(ghost.shape.center[2] + 8, 4, size - 4), exit);
      };
    }
  }
};

export const initTreasureLevel = (size: number): void => {
  resetWorld(0, -size + 4);
  initBasicLevel(size, size);
  const coinCount = ((size - 4) / 4) | 0;
  createCoinRow(-size + 8, -size + 4, 0, 8, coinCount);
  createCoinRow(size - 8, -size + 4, 0, 8, coinCount);
  const exit = createExitPipe(0, size - 4);
  new Key(0, 8, 0, exit);
};
