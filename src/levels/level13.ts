import { boss } from '../ai/boss';
import { Ghost } from '../entities/ghost';
import { lightSource, updateBuffers } from '../graphics/engine';
import { STATIC_DRAW } from '../graphics/glconstants';
import { showDialog } from '../main';
import { setVec3 } from '../math/vec3';
import { Box } from '../physics/box';
import { createCheckerboard, createCoinRow, initBasicLevel, resetWorld } from './utils';

export const initLevel13 = (): void => {
  resetWorld(0, -45);

  // Darken the ambient light
  lightSource.ambientLight = 0.2;

  initBasicLevel(50, 50);
  createCheckerboard();

  // Coin row leading to bossGhost
  createCoinRow(-40, -20, 0, 5, 8);
  createCoinRow(0, -20, 0, 5, 8);
  createCoinRow(40, -20, 0, 5, 8);

  const bossGhost = new Ghost(0, 0, 45);
  bossGhost.shape.noclip = true;
  setVec3((bossGhost.shape as Box).halfExtents, 8, 8, 8);
  bossGhost.ai = boss;
  bossGhost.aggro = true;

  updateBuffers(STATIC_DRAW);

  showDialog('Hmm, the lights are out');
};
