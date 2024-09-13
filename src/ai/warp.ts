import { pipeSound } from '../audio/sounds/pipe';
import { GameEntity } from '../entities/entity';
import { dt } from '../main';
import { Vec3, distanceVec3, normalizeVec3, scaleAndAddVec3, scaleVec3, subtractVec3 } from '../math/vec3';
import { AI } from './ai';

export const createWarp = (previous: AI | undefined, waypoints: Vec3[]): AI => {
  let waypointIndex = 0;

  return (entity: GameEntity) => {
    if (waypointIndex >= waypoints.length) {
      entity.ai = previous;
      entity.shape.noclip = false;
      pipeSound.playOnce();
      return;
    }
    const waypoint = waypoints[waypointIndex];
    if (distanceVec3(entity.shape.center, waypoint) < 2) {
      waypointIndex++;
    } else {
      const speed = 50;
      subtractVec3(entity.shape.velocity, waypoint, entity.shape.center);
      entity.turnToward(entity.shape.velocity[0], entity.shape.velocity[2], 0.1);
      normalizeVec3(entity.shape.velocity, entity.shape.velocity);
      scaleVec3(entity.shape.velocity, entity.shape.velocity, speed);
      scaleAndAddVec3(entity.shape.center, entity.shape.center, entity.shape.velocity, dt);
    }
  };
};
