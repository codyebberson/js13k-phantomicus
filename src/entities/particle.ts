import { COLOR_WHITE } from '../graphics/colors';
import { DYNAMIC_SPHERES } from '../graphics/constants';
import { dt } from '../main';
import { scaleMat4 } from '../math/mat4';
import { Vec3, copyVec3, createVec3, scaleAndAddVec3 } from '../math/vec3';
import { Box } from '../physics/box';
import { GameEntity } from './entity';

/**
 * The Particle class represents a purely visual entity.
 * Particles are used for:
 *   1) Floaties - small specks that rise slowly and fade away.
 *   2) Running dust - dust clouds when entities run around.
 *   3) Explosion particles - flying everywhere.
 */
export class Particle extends GameEntity {
  size: number;
  deathRate: number;
  color: number;
  readonly acceleration: Vec3;

  constructor(v: Vec3) {
    super(new Box(1, createVec3(1, 1, 1)));
    copyVec3(this.shape.center, v);
    this.size = 0.6;
    this.deathRate = 100;
    this.color = COLOR_WHITE;
    this.acceleration = createVec3();
    this.shape.noclip = true;
  }

  /**
   * Updates the particle.
   * @override
   */
  update(): void {
    scaleAndAddVec3(this.shape.velocity, this.shape.velocity, this.acceleration, dt);
    scaleAndAddVec3(this.shape.center, this.shape.center, this.shape.velocity, dt);
    this.health -= dt * this.deathRate;
  }

  /**
   * Renders the particle.
   * @override
   */
  render(): void {
    const radius = this.size * (this.health / 100);
    const m = this.createShape(DYNAMIC_SPHERES, this.color);
    scaleMat4(m, m, radius, radius, radius);
  }
}
