import { explodeSound } from '../audio/sounds/explode';
import { BOSS_WAVES } from '../constants';
import { GameEntity, entities } from '../entities/entity';
import { Ghost } from '../entities/ghost';
import { lightSource } from '../graphics/engine';
import { gameState, gameTime, player, showDialogs } from '../main';
import { AI } from './ai';
import { chase } from './chase';

export const boss: AI = (entity: GameEntity) => {
  if (entity.distanceToPlayer() < 32) {
    gameState.bossTriggered = true;
  }

  if (gameState.bossTriggered && !gameState.gameOverTime) {
    entity.turnTowardVec3(player.shape.center);

    if (gameTime > gameState.nextSpawnTime && gameState.wave < BOSS_WAVES) {
      gameState.wave++;

      const g1 = new Ghost(-40, 4, 40);
      g1.aggro = true;
      g1.ai = chase;

      const g2 = new Ghost(40, 4, 40);
      g2.aggro = true;
      g2.ai = chase;

      gameState.nextSpawnTime = gameTime + 3;
    }

    if (gameState.wave >= BOSS_WAVES) {
      const ghostCount = entities.filter((e) => e instanceof Ghost).length;
      if (ghostCount === 1) {
        gameState.gameOverTime = gameTime;
        entity.health = 0;
        entity.aggro = false;
        explodeSound.playOnce();
        lightSource.ambientLight = 0.8; // Turn the lights back on

        const time = gameTime | 0;
        const bonus = Math.max(0, 500 - time) * 100;
        showDialogs([
          'Wow, you did it!  All the ghosts are gone!',
          `Time bonus: ${bonus.toLocaleString()}`,
          `Total score: ${(player.score + bonus).toLocaleString()}`,
        ]);
      }
    }
  }
};
