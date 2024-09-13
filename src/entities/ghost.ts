import { DYNAMIC_SPHERES } from '../graphics/constants';
import { gameTime } from '../main';
import { rotateXMat4, rotateYMat4, rotateZMat4, scaleMat4, translateMat4 } from '../math/mat4';
import { createVec3, setVec3 } from '../math/vec3';
import { Box } from '../physics/box';
import { GameEntity } from './entity';

export class Ghost extends GameEntity {
  constructor(x: number, y: number, z: number) {
    super(new Box(10, createVec3(2.5, 2, 2.5)));
    setVec3(this.shape.center, x, y, z);
    this.shape.coefficientOfFriction = 0.0001;
    this.accelerationPower *= 0.2;
  }

  render(): void {
    const scale2 = (this.shape as Box).halfExtents[0] / 2.5;
    const scale = 1.0;
    scaleMat4(this.shape.transformMatrix, this.shape.transformMatrix, scale2, scale2, scale2);

    const topOffset = 0.1 * Math.sin(gameTime * 4);
    const bottomOffset = 0.1 * Math.sin(gameTime * 3);
    const tongueLength = 3.3 + 0.3 * Math.sin(gameTime * 4);
    const eyeColor = this.aggro ? 0xff0000ff : 0xff00ff00;

    // Top body
    this.quickShape(DYNAMIC_SPHERES, 0xffe0e0e0, 0, 4 + topOffset, 0, 4.2 * scale, 3.5 * scale, 4.2 * scale);

    // Bottom body
    this.quickShape(DYNAMIC_SPHERES, 0xffe0e0e0, 0, 3.6 + bottomOffset, 0, 3.9 * scale, 3.8 * scale, 3.8 * scale);

    const leftEye = this.createShape(DYNAMIC_SPHERES, eyeColor);
    translateMat4(leftEye, leftEye, -1, 5 + topOffset, 3.7);

    const rightEye = this.createShape(DYNAMIC_SPHERES, eyeColor);
    translateMat4(rightEye, rightEye, 1, 5 + topOffset, 3.7);

    if (this.aggro) {
      rotateZMat4(leftEye, leftEye, 0.8);
      rotateZMat4(rightEye, rightEye, -0.8);
    }

    scaleMat4(leftEye, leftEye, 0.3 * scale, 0.9 * scale, 0.3 * scale);
    scaleMat4(rightEye, rightEye, 0.3 * scale, 0.9 * scale, 0.3 * scale);

    // Black mouth hole
    this.quickShape(DYNAMIC_SPHERES, 0xff404040, 0, 3.0 + bottomOffset, 0.2, 3.4 * scale, 2.7 * scale, 3.7 * scale);

    // Tongue sticking out
    {
      const color = 0xff0000f0;
      const m = this.createShape(DYNAMIC_SPHERES, color);
      translateMat4(m, m, 0, 3.5 + bottomOffset, 2);
      rotateYMat4(m, m, 0.3 * Math.sin(gameTime * 7));
      rotateXMat4(m, m, Math.PI / 4);
      scaleMat4(m, m, 1.5 * scale, 0.5 * scale, tongueLength * scale);
    }
  }
}
