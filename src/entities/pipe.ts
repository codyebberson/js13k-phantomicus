import { createWarp } from '../ai/warp';
import { pipeSound } from '../audio/sounds/pipe';
import { walkSound } from '../audio/sounds/walk';
import { DYNAMIC_CUBES, STATIC_CUBES, STATIC_SPHERES } from '../graphics/constants';
import { drawLists } from '../graphics/engine';
import { player } from '../main';
import { rotateZMat4, scaleMat4, translateMat4, translateMat4Vec3 } from '../math/mat4';
import { Vec3, createVec3, distanceVec3IgnoreY, setVec3 } from '../math/vec3';
import { Box } from '../physics/box';
import { STATIC_MASS } from '../physics/shape';
import { GameEntity } from './entity';

export class Pipe extends GameEntity {
  waypoints?: Vec3[];
  onEnter?: () => void;
  locked?: boolean;

  constructor(x: number, y: number, z: number, waypoints?: Vec3[], onEnter?: () => void, locked = false) {
    super(new Box(STATIC_MASS, createVec3(6, 6, 3)));
    this.waypoints = waypoints;
    this.onEnter = onEnter;
    this.locked = locked;

    setVec3(this.shape.center, x, y, z);

    const pipeColor = 0xff40e040;
    for (let i = 0; i < 16; i++) {
      const m = drawLists[STATIC_CUBES].addInstance(pipeColor);
      translateMat4Vec3(m, m, this.shape.center);
      rotateZMat4(m, m, (i * Math.PI) / 8);
      translateMat4(m, m, 0, 5, 0);
      scaleMat4(m, m, 1.195, 1, 3);
    }

    {
      const color = 0xff000000;
      const m = drawLists[STATIC_SPHERES].addInstance(color);
      translateMat4Vec3(m, m, this.shape.center);
      translateMat4(m, m, 0, 0, -1);
      scaleMat4(m, m, 4, 4, 0.25);
    }
  }

  update(): void {
    if (
      !player.ai &&
      !this.locked &&
      this.waypoints &&
      distanceVec3IgnoreY(this.waypoints[0], player.shape.center) < 4
    ) {
      if (this.onEnter) {
        this.onEnter();
      }
      player.ai = createWarp(player.ai, this.waypoints);
      player.shape.noclip = true;
      walkSound.stopPlaying();
      pipeSound.playOnce();
    }
  }

  render(): void {
    if (this.locked) {
      // Lock body
      this.quickShape(DYNAMIC_CUBES, 0xff40f0f0, 0, 0, -4, 1, 0.8, 0.5);

      // Lock top left
      this.quickShape(DYNAMIC_CUBES, 0xff40f0f0, -0.6, 1.3, -4, 0.2, 0.6, 0.2);

      // Lock top right
      this.quickShape(DYNAMIC_CUBES, 0xff40f0f0, 0.6, 1.3, -4, 0.2, 0.6, 0.2);

      // Lock top
      this.quickShape(DYNAMIC_CUBES, 0xff40f0f0, 0, 1.8, -4, 0.6, 0.2, 0.2);
    }
  }
}
