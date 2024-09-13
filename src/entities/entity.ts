import { AI } from '../ai/ai';
import { ACCELERATION } from '../constants';
import { DYNAMIC_CUBES } from '../graphics/constants';
import { drawLists } from '../graphics/engine';
import { dt, gameTime, player } from '../main';
import { Mat4, multiplyMat4, scaleMat4, translateMat4 } from '../math/mat4';
import { createQuaternion, identityQuat, rotateYQuat, slerpQuat } from '../math/quat';
import {
  Vec3,
  createVec3,
  distanceVec3,
  magnitudeVec3,
  normalizeVec3,
  scaleAndAddVec3,
  scaleVec3,
  subtractVec3,
} from '../math/vec3';
import { Box } from '../physics/box';
import { Shape } from '../physics/shape';
import { Pipe } from './pipe';

const tempMoveTarget = createVec3();
const tempTurnQuat = createQuaternion();

/**
 * The GameEntity class represents an entity in the game.
 */
export class GameEntity {
  readonly shape: Shape;
  health = 100;
  score = 0;
  power = 0;
  pipe?: Pipe;
  accelerating = false;
  accelerationPower = ACCELERATION;
  invincibleTime = 0;
  color = 0xff808080;
  aggro = false;
  inVacuum = false;
  ai?: AI;
  onDeath?: (e: GameEntity) => void;

  /**
   * Creates a new game entity.
   */
  constructor(shape: Shape) {
    this.shape = shape;
    entities.push(this);
  }

  isInvincible(): boolean {
    return gameTime - this.invincibleTime < 0.5;
  }

  isFlashing(): boolean {
    return this.isInvincible() && ((gameTime * 5) | 0) % 2 === 0;
  }

  getColor(color: number): number {
    return this.isFlashing() ? 0xff000080 : color;
  }

  move(moveDir: Vec3): void {
    moveDir[1] = 0;
    normalizeVec3(moveDir, moveDir);
    if (magnitudeVec3(moveDir) > 0.5) {
      scaleVec3(this.shape.angularVelocity, this.shape.angularVelocity, 0.5 * dt);
      scaleAndAddVec3(this.shape.velocity, this.shape.velocity, moveDir, dt * this.accelerationPower);
      const speed = magnitudeVec3(this.shape.velocity);
      const maxSpeed = 48;
      if (speed > maxSpeed) {
        scaleVec3(this.shape.velocity, this.shape.velocity, maxSpeed / speed);
      }
      this.turnToward(moveDir[0], moveDir[2], 0.07);
      this.accelerating = true;
    }
  }

  moveToward(dest: Vec3): void {
    subtractVec3(tempMoveTarget, dest, this.shape.center);
    this.move(tempMoveTarget);
  }

  distanceToPlayer(): number {
    return distanceVec3(this.shape.center, player.shape.center);
  }

  /**
   * Turns toward the target angle.
   * Assumes that this.yaw and angle are in the range -PI to PI.
   * @param dx The target delta x.
   * @param dz The target delta z.
   */
  turnToward(dx: number, dz: number, turnSpeed = 0.2): void {
    identityQuat(tempTurnQuat);
    rotateYQuat(tempTurnQuat, tempTurnQuat, Math.atan2(dx, dz));
    slerpQuat(this.shape.rotation, this.shape.rotation, tempTurnQuat, turnSpeed);
  }

  turnTowardVec3(target: Vec3, turnSpeed = 0.2): void {
    subtractVec3(tempMoveTarget, target, this.shape.center);
    this.turnToward(tempMoveTarget[0], tempMoveTarget[2], turnSpeed);
  }

  /**
   * Updates the entity.
   * By default, does nothing.
   */
  update(): void {
    this.ai?.(this);
  }

  /**
   * Renders the entity.
   * By default, does nothing.
   * Static entities can use this default implementation.
   */
  render(): void {
    // Subclasses should override
    // Default implementation is a gray box
    const color = this.color;
    if (color !== 0) {
      const m = this.createShape(DYNAMIC_CUBES, color);
      const box = this.shape as Box;
      const [x, y, z] = box.halfExtents;
      scaleMat4(m, m, x, y, z);
    }
  }

  /**
   * Creates a new shape transformed to instance space.
   * @param drawListIndex - The index of the draw list to use.
   * @param color - The color of the shape.
   * @returns - The model matrix of the shape.
   */
  createShape(drawListIndex: number, color: number): Mat4 {
    const m = drawLists[drawListIndex].addInstance(color);
    multiplyMat4(m, m, this.shape.transformMatrix);
    return m;
  }

  /**
   * Creates, translates, and scales a shape.
   * This is a common pattern for creating shapes.
   * @param drawListIndex - The index of the draw list to use.
   * @param color - The color of the shape.
   * @param tx - The x translation.
   * @param ty - The y translation.
   * @param tz - The z translation.
   * @param sx - The x scale.
   * @param sy - The y scale.
   * @param sz - The z scale.
   */
  quickShape(
    drawListIndex: number,
    color: number,
    tx: number,
    ty: number,
    tz: number,
    sx: number,
    sy: number,
    sz: number
  ): Mat4 {
    const m = drawLists[drawListIndex].addInstance(color);
    multiplyMat4(m, m, this.shape.transformMatrix);
    translateMat4(m, m, tx, ty, tz);
    scaleMat4(m, m, sx, sy, sz);
    return m;
  }
}

export const entities: GameEntity[] = [];
