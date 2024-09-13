import { coinSound } from '../audio/sounds/coin';
import { GameEntity } from '../entities/entity';
import { FloatingText } from '../entities/floatingtext';
import { OVERLAY_GREEN } from '../graphics/overlay';
import { player } from '../main';
import { lerpVec3 } from '../math/vec3';
import { AI } from './ai';

export const pickup: AI = (entity: GameEntity) => {
  // entity.moveToward(player.shape.center);

  // if (!entity.inVacuum && !player.isInvincible() && entity.distanceToPlayer() < 8) {
  //   gameState.screenShakeTime = gameTime + 0.5;
  //   player.invincibleTime = gameTime + 0.5;
  //   player.health -= 10;
  //   hurtSound.playOnce();
  // }

  // const dist = distanceVec3(this.shape.center, player.shape.center);
  const dist = entity.distanceToPlayer();
  if (dist < 6) {
    // Give the player a coin
    entity.health = 0;
    player.score += entity.score;
    player.power += entity.power;
    coinSound.playOnce();
    new FloatingText(entity.shape.center, entity.score.toString(), OVERLAY_GREEN);
    if (entity.pipe) {
      entity.pipe.locked = false;
    }
  } else if (dist < 8) {
    // Move the coin toward the player
    lerpVec3(
      entity.shape.center,
      entity.shape.center,
      player.shape.center[0],
      player.shape.center[1],
      player.shape.center[2],
      0.1
    );
  }
};
