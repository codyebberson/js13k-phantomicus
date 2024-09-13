import { pickup } from '../ai/pickup';
import { createColor } from '../graphics/colors';
import { DYNAMIC_CUBES } from '../graphics/constants';
import { gameTime } from '../main';
import { rotateYMat4 } from '../math/mat4';
import { createVec3, setVec3 } from '../math/vec3';
import { Box } from '../physics/box';
import { GameEntity } from './entity';
import { Pipe } from './pipe';

export class Key extends GameEntity {
  constructor(x: number, y: number, z: number, pipe?: Pipe) {
    super(new Box(5, createVec3(0.1, 0.1, 0.1)));
    this.pipe = pipe;
    setVec3(this.shape.center, x, y, z);
    this.color = createColor(244, 244, 0);
    this.score = 100;
    this.ai = pickup;
  }

  render(): void {
    const yOffset = 5 + 0.2 * Math.sin(gameTime * 4);

    rotateYMat4(this.shape.transformMatrix, this.shape.transformMatrix, gameTime * 2);

    // Main body
    this.quickShape(DYNAMIC_CUBES, this.color, 0, yOffset, 0, 1.5, 0.25, 0.25);

    // Tooth 1
    this.quickShape(DYNAMIC_CUBES, this.color, -1.25, yOffset - 0.5, 0, 0.25, 0.5, 0.25);

    // Tooth 2
    this.quickShape(DYNAMIC_CUBES, this.color, -0.25, yOffset - 0.5, 0, 0.25, 0.5, 0.25);

    // Left bow
    this.quickShape(DYNAMIC_CUBES, this.color, 1.5, yOffset, 0, 0.25, 0.75, 0.25);

    // Right bow
    this.quickShape(DYNAMIC_CUBES, this.color, 2.5, yOffset, 0, 0.25, 0.75, 0.25);

    // Top bow
    this.quickShape(DYNAMIC_CUBES, this.color, 2, yOffset + 0.75, 0, 0.75, 0.25, 0.25);

    // Bottom bow
    this.quickShape(DYNAMIC_CUBES, this.color, 2, yOffset - 0.75, 0, 0.75, 0.25, 0.25);
  }
}
