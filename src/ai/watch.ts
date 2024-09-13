import { GameEntity } from '../entities/entity';
import { player } from '../main';
import { AI } from './ai';

export const watch: AI = (entity: GameEntity) => {
  if (entity.distanceToPlayer() < 32) {
    entity.turnTowardVec3(player.shape.center);
  }
};
