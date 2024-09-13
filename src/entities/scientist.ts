import { watch } from '../ai/watch';
import { createColor } from '../graphics/colors';
import { DYNAMIC_SPHERES } from '../graphics/constants';
import { gameState, gameTime } from '../main';
import { EPSILON } from '../math/constants';
import { createVec3, setVec3 } from '../math/vec3';
import { Box } from '../physics/box';
import { STATIC_MASS } from '../physics/shape';
import { GameEntity } from './entity';

export class Scientist extends GameEntity {
  onApproach: () => void;
  approached = false;

  constructor(x: number, y: number, z: number, onApproach: () => void) {
    super(new Box(STATIC_MASS, createVec3(0.1, 0.1, 0.1)));
    this.onApproach = onApproach;
    setVec3(this.shape.center, x, y, z);
    this.turnToward(0, -1, 1);
    this.color = createColor(244, 244, 0);
    this.ai = watch;
  }

  update(): void {
    super.update();
    if (gameState.dialogCurrentOpacity < EPSILON && !this.approached) {
      const dist = this.distanceToPlayer();
      if (dist < 32) {
        this.onApproach();
        this.approached = true;
      }
    }
  }

  render(): void {
    const yOffset = 0.2 * Math.sin(gameTime * 4);

    // body
    this.quickShape(DYNAMIC_SPHERES, 0xfff0f0f0, 0, 4 + yOffset, 0, 1.5, 1.5, 1.5);

    // head
    this.quickShape(DYNAMIC_SPHERES, 0xff96bfea, 0, 6 + yOffset, 0, 1.5, 1, 1.5);

    // left lens
    this.quickShape(DYNAMIC_SPHERES, 0xffc3cb87, -0.75, 6.2 + yOffset, 1.25, 0.7, 0.7, 0.2);

    // right lens
    this.quickShape(DYNAMIC_SPHERES, 0xffc3cb87, 0.75, 6.2 + yOffset, 1.25, 0.7, 0.7, 0.2);

    // hair
    this.quickShape(DYNAMIC_SPHERES, 0xfff0f0f0, 0, 6.5 + yOffset, 0, 0.25, 1.5, 0.25);
  }
}
