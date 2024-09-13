import { GameEntity } from '../entities/entity';
import { Vec3, distanceVec3IgnoreY, scaleVec3 } from '../math/vec3';
import { AI } from './ai';
import { chase } from './chase';

export const createPatrol = (waypoints: Vec3[]): AI => {
  let waypointIndex = 0;

  return (entity: GameEntity) => {
    const playerDist = entity.distanceToPlayer();
    if (playerDist < 32) {
      // Do a little jump
      entity.shape.velocity[1] = 20;
      entity.ai = chase;
      entity.aggro = true;
    } else {
      const waypoint = waypoints[waypointIndex];
      if (distanceVec3IgnoreY(entity.shape.center, waypoint) < 4) {
        waypointIndex = (waypointIndex + 1) % waypoints.length;
        scaleVec3(entity.shape.velocity, entity.shape.velocity, 0.3);
      } else {
        entity.moveToward(waypoint);
      }
    }
  };
};
