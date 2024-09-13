import { LIGHT_X_OFFSET, LIGHT_Y_OFFSET, VACUUM_X_OFFSET, VACUUM_Y_OFFSET, VACUUM_Z_OFFSET } from '../constants';
import { COLOR_BLACK, COLOR_WHITE } from '../graphics/colors';
import { DYNAMIC_CUBES, DYNAMIC_SPHERES } from '../graphics/constants';
import { gameTime } from '../main';
import { rotateXMat4, rotateZMat4, scaleMat4, translateMat4 } from '../math/mat4';
import { lerp } from '../utils';
import { GameEntity } from './entity';

export class Hero extends GameEntity {
  // score = 0;
  // power = 0;
  // leftArmRotationX = 0.0;
  // leftArmRotationZ = -1.2;
  rightArmRotationX = 0.0;
  // rightArmRotationZ = 1.2;
  leftLegRotationX = 0;
  rightLegRotationX = 0;

  render(): void {
    const theta = gameTime * 20;
    const speed = Math.hypot(this.shape.velocity[0], this.shape.velocity[2]);
    const bounciness = 0.005;
    const bodyOffsetY = bounciness * Math.sin(theta) * speed;
    const bodyRotationX = 0.005 * speed;

    // Update the shape transform matrix
    // Note, this is dangerous, because this transform matrix is used for collision detection as well
    // We're cheating here, because we know that the rendering happens after the collision detection
    // And that the collision detection will reset the transform matrix
    translateMat4(this.shape.transformMatrix, this.shape.transformMatrix, 0, bodyOffsetY, 0);
    rotateXMat4(this.shape.transformMatrix, this.shape.transformMatrix, bodyRotationX);

    // if (!this.isGrounded() || gameState === GameState.AFTER_LEVEL) {
    //   // Jumping = arms up
    //   leftArmRotationZ = -0.5;
    //   rightArmRotationZ = 0.5;
    // } else
    if (this.accelerating) {
      // Running = arms back
      const r = ((gameTime % 0.8) / 0.8) * 2 * Math.PI;
      this.rightLegRotationX = 0.02 * speed * Math.sin(r);
      // rightLegRotationX = leftArmRotationX = 0.07 * 10 * Math.sin(r);
      this.rightArmRotationX = this.leftLegRotationX = -this.rightLegRotationX;
    } else {
      const lerpRate = 0.1;
      this.rightArmRotationX = lerp(this.rightArmRotationX, 0, lerpRate);
      this.leftLegRotationX = lerp(this.leftLegRotationX, 0, lerpRate);
      this.rightLegRotationX = lerp(this.rightLegRotationX, 0, lerpRate);
    }

    const leftArmRotationX = -1;
    const leftArmRotationZ = -1.3;
    const rightArmRotationZ = 1.2;

    const skin = this.getColor(0xff799fc1);
    const hair = this.getColor(0xfff0f0f0);
    const shirt = this.getColor(0xffb0c0d8);
    const pants = this.getColor(0xff6c818b);
    const redVaccuum = this.getColor(0xff2020d0);
    const darkBrown = this.getColor(0xff305060);

    // Draw head
    this.quickShape(DYNAMIC_SPHERES, skin, 0, 5.9, 0, 0.6, 0.8, 0.6);

    // Draw hair
    {
      const m = this.createShape(DYNAMIC_SPHERES, hair);
      translateMat4(m, m, 0, 6.2, 0);
      rotateXMat4(m, m, -0.6);
      scaleMat4(m, m, 0.6, 0.5, 0.75);
    }

    // Beard
    {
      const m = this.createShape(DYNAMIC_SPHERES, hair);
      translateMat4(m, m, 0, 5.5, 0.15);
      rotateXMat4(m, m, 0.75);
      scaleMat4(m, m, 0.55, 0.4, 0.75);
    }

    // Draw left eye
    this.quickShape(DYNAMIC_SPHERES, COLOR_BLACK, -0.2, 6, 0.5, 0.15, 0.15, 0.2);

    // Draw right eye
    this.quickShape(DYNAMIC_SPHERES, COLOR_BLACK, 0.2, 6, 0.5, 0.15, 0.15, 0.2);

    // Draw stomach
    this.quickShape(DYNAMIC_SPHERES, shirt, 0, 3.9, 0.2, 1.3, 1.5, 1.0);

    // Left shoulder
    this.quickShape(DYNAMIC_SPHERES, shirt, 0.7, 4.7, 0.1, 0.9, 0.6, 0.6);

    // Right shoulder
    this.quickShape(DYNAMIC_SPHERES, shirt, -0.7, 4.7, 0.1, 0.9, 0.6, 0.6);

    // Left backpack
    this.quickShape(DYNAMIC_SPHERES, redVaccuum, -0.4, 4, -0.8, 0.6, 1.2, 0.6);

    // Right backpack
    this.quickShape(DYNAMIC_SPHERES, redVaccuum, 0.4, 4, -0.8, 0.6, 1.2, 0.6);

    // Belt
    this.quickShape(DYNAMIC_SPHERES, darkBrown, 0, 2.9, 0.2, 1.25, 0.5, 1.0);

    // Left strap
    {
      const m = this.createShape(DYNAMIC_SPHERES, darkBrown);
      translateMat4(m, m, 0.65, 4.5, 0.2);
      rotateZMat4(m, m, 0.5);
      scaleMat4(m, m, 0.3, 1.1, 0.8);
    }

    // Right strap
    {
      const m = this.createShape(DYNAMIC_SPHERES, darkBrown);
      translateMat4(m, m, -0.65, 4.5, 0.2);
      rotateZMat4(m, m, -0.5);
      scaleMat4(m, m, 0.3, 1.1, 0.8);
    }

    // Draw left arm
    {
      const m = this.createShape(DYNAMIC_SPHERES, shirt);
      translateMat4(m, m, 1, 4.5, 0.0);
      rotateXMat4(m, m, leftArmRotationX);
      rotateZMat4(m, m, leftArmRotationZ);
      translateMat4(m, m, 0.75, 0, 0.0);
      scaleMat4(m, m, 1.4, 0.4, 0.4);
    }

    // Flashlight
    this.quickShape(DYNAMIC_SPHERES, redVaccuum, LIGHT_X_OFFSET, LIGHT_Y_OFFSET, 1.2, 0.4, 0.4, 1.5);

    // Bulb
    this.quickShape(DYNAMIC_SPHERES, 0xff80ffff, LIGHT_X_OFFSET, LIGHT_Y_OFFSET, 2.4, 0.4, 0.4, 0.4);

    // Vaccuum mouth
    this.quickShape(DYNAMIC_CUBES, COLOR_WHITE, VACUUM_X_OFFSET, VACUUM_Y_OFFSET, VACUUM_Z_OFFSET, 0.4, 0.3, 0.2);

    // Draw right arm
    {
      const m = this.createShape(DYNAMIC_SPHERES, shirt);
      translateMat4(m, m, -1, 4.5, 0.0);
      rotateXMat4(m, m, this.rightArmRotationX);
      rotateZMat4(m, m, rightArmRotationZ);
      translateMat4(m, m, -0.75, 0, 0.0);
      scaleMat4(m, m, 1.4, 0.4, 0.4);
    }

    // Draw left leg
    {
      const m = this.createShape(DYNAMIC_SPHERES, pants);
      translateMat4(m, m, 0.0, 3, 0.0);
      rotateXMat4(m, m, this.leftLegRotationX);
      translateMat4(m, m, 0.7, -1.6, 0.0);
      scaleMat4(m, m, 0.6, 1.6, 0.6);
    }

    // Left shoe
    {
      const m = this.createShape(DYNAMIC_SPHERES, darkBrown);
      translateMat4(m, m, 0.0, 3, 0.0);
      rotateXMat4(m, m, this.leftLegRotationX);
      translateMat4(m, m, 0.7, -3.1, 0.4);
      rotateXMat4(m, m, -this.leftLegRotationX);
      scaleMat4(m, m, 0.5, 0.5, 0.8);
    }

    // Draw right leg
    {
      const m = this.createShape(DYNAMIC_SPHERES, pants);
      translateMat4(m, m, 0.0, 3, 0.0);
      rotateXMat4(m, m, this.rightLegRotationX);
      translateMat4(m, m, -0.7, -1.6, 0.0);
      scaleMat4(m, m, 0.6, 1.6, 0.6);
    }

    // Right shoe
    {
      const m = this.createShape(DYNAMIC_SPHERES, darkBrown);
      translateMat4(m, m, 0.0, 3, 0.0);
      rotateXMat4(m, m, this.rightLegRotationX);
      translateMat4(m, m, -0.7, -3.1, 0.4);
      rotateXMat4(m, m, -this.rightLegRotationX);
      scaleMat4(m, m, 0.5, 0.5, 0.8);
    }
  }
}
