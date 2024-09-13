import { hurtSound } from '../audio/sounds/hurt';
import { GameEntity } from '../entities/entity';
import { gameState, gameTime, player } from '../main';
import { AI } from './ai';

export const chase: AI = (entity: GameEntity) => {
  entity.moveToward(player.shape.center);

  if (!entity.inVacuum && !player.isInvincible() && entity.distanceToPlayer() < 8) {
    gameState.screenShakeTime = gameTime + 0.5;
    player.invincibleTime = gameTime + 0.5;
    player.health -= 10;
    hurtSound.playOnce();
  }
};
