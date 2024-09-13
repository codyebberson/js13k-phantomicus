import { pickup } from '../ai/pickup';
import { createColor } from '../graphics/colors';
import { DYNAMIC_CUBES } from '../graphics/constants';
import { gameTime } from '../main';
import { rotateXMat4, rotateYMat4, rotateZMat4, scaleMat4, translateMat4 } from '../math/mat4';
import { createVec3, setVec3 } from '../math/vec3';
import { Box } from '../physics/box';
import { GameEntity } from './entity';

/**
 * Coin is a spinning cube that the player can collect for points.
 */
export class Coin extends GameEntity {
  constructor(x: number, y: number, z: number) {
    super(new Box(5, createVec3(0.1, 0.1, 0.1)));
    setVec3(this.shape.center, x, y, z);
    this.color = createColor(244, 244, 0);
    this.score = 100;
    this.power = 10;
    this.ai = pickup;
  }

  render(): void {
    const m = this.createShape(DYNAMIC_CUBES, this.color);
    translateMat4(m, m, 0, 5 + 0.2 * Math.sin(gameTime * 4), 0);
    rotateYMat4(m, m, gameTime * 2);
    rotateXMat4(m, m, Math.PI / 4);
    rotateZMat4(m, m, Math.PI / 4);
    scaleMat4(m, m, 0.5, 0.5, 0.5);
  }
}
