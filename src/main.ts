import { gameMusic } from './audio/music/game';
import { titleMusic } from './audio/music/title';
import { preloadAudio } from './audio/preload';
import { deathSound } from './audio/sounds/death';
import { dialogOpenSound } from './audio/sounds/dialogopen';
import { explodeSound } from './audio/sounds/explode';
import { suckSound } from './audio/sounds/suck';
import { talkSound } from './audio/sounds/talk';
import { vacuumSound } from './audio/sounds/vacuum';
import { walkSound } from './audio/sounds/walk';
import { BOSS_WAVES, LIGHT_X_OFFSET, LIGHT_Y_OFFSET, LIGHT_Z_OFFSET } from './constants';
import { DEBUG } from './debug';
import { GameEntity, entities } from './entities/entity';
import { FloatingText } from './entities/floatingtext';
import { Ghost } from './entities/ghost';
import { Hero } from './entities/hero';
import { Particle } from './entities/particle';
import { HEIGHT, WIDTH, overlayCtx } from './globals';
import { lookAt } from './graphics/camera';
import { DYNAMIC_CUBES } from './graphics/constants';
import { camera, endFrame, lightSource, startFrame, updateBuffers } from './graphics/engine';
import { STATIC_DRAW } from './graphics/glconstants';
import {
  OVERLAY_BLACK,
  OVERLAY_GREEN,
  drawShadowText,
  fillEllipse,
  fillRect,
  setFontSize,
  setGlobalAlpha,
  setTextAlign,
} from './graphics/overlay';
import { GAMEPAD_ENABLED, getGamepad, updateGamepad } from './input/gamepad';
import {
  KEY_1,
  KEY_3,
  KEY_4,
  KEY_6,
  KEY_7,
  KEY_8,
  KEY_9,
  KEY_A,
  KEY_D,
  KEY_DOWN,
  KEY_ENTER,
  KEY_LEFT,
  KEY_M,
  KEY_R,
  KEY_RIGHT,
  KEY_S,
  KEY_SPACE,
  KEY_UP,
  KEY_W,
  isKeyDown,
  isKeyPressed,
  updateKeys,
} from './input/keyboard';
import { isAnyInputDown, resetInputs } from './input/utils';
import { levels } from './levels/levels';
import { initTitleScreen } from './levels/titlescreen';
import { dropBoxes } from './levels/utils';
import {
  copyVec3,
  createVec3,
  dotVec3,
  lerpVec3,
  magnitudeVec3,
  normalizeVec3,
  scaleAndAddVec3,
  scaleVec3,
  setVec3,
  strVec3,
  subtractVec3,
  transformMat4Vec3,
} from './math/vec3';
import { Box } from './physics/box';
import { createCollisionInfo, detectCollision } from './physics/collision';
import { solvePenatration } from './physics/resolve';
import { SLEEP_THRESHOLD } from './physics/shape';
import { clamp, lerp, symmetricRandom, unitRandom } from './utils';

const ENTER_MSG = 'PRESS ENTER TO CONTINUE';

export const player = new Hero(new Box(10, createVec3(2, 2, 2)));
player.accelerationPower *= 1.3;

const moveDir = createVec3();
const intersection = createCollisionInfo();
const vacuumPosition = createVec3();
const vacuumDirection = createVec3();
const vacuumDelta = createVec3();
const vacuumImpulse = createVec3();

export const gameState = {
  level: 0,
  paused: false,
  cameraYOffset: 50,
  cameraZOffset: -60,
  cameraLerpRate: 0.01,
  screenShakeTime: 0,
  dialogText: '',
  dialogOpenTime: 0,
  dialogCurrentOpacity: 0,
  dialogTargetOpacity: 0,
  dialogNextFunc: undefined as (() => void) | undefined,
  bossTriggered: false,
  nextSpawnTime: 0,
  wave: 0,
  // gameOver: false,
  gameOverTime: 0,
};

let firstClick = false;
let showDebug = false;
let audioGeneratorProgress = 0;
let audioGeneratorDone = false;

/**
 * Current real world time in seconds.
 */
export let time = 0;

/**
 * Current game time in seconds.
 */
export let gameTime = 0;

/**
 * Most recent game time delta in seconds.
 */
export let dt = 0;

/**
 * Last render time (milliseconds since the epoch).
 * Debug only.
 */
let lastRenderTime = 0;

/**
 * Current FPS.
 * Debug only.
 */
let fps = 0;

/**
 * Moving average FPS.
 * Debug only.
 */
let averageFps = 0;

let transitionFunc = undefined as (() => void) | undefined;
let transitionAnimation = 0;

export const setTransition = (func: () => void): void => {
  transitionFunc = func;
};

export const restartLevel = (): void => {
  transitionFunc = levels[gameState.level];
};

export const nextLevel = (): void => {
  gameState.level++;
  restartLevel();
};

const gameLoop = (now: number): void => {
  if (DEBUG) {
    if (lastRenderTime === 0) {
      lastRenderTime = now;
    } else {
      const actualDelta = now - lastRenderTime;
      lastRenderTime = now;
      fps = 1000.0 / actualDelta;
      averageFps = 0.9 * averageFps + 0.1 * fps;
    }
  }

  // Update time variables
  // Convert to seconds
  now *= 0.001;

  // Calculate the time delta
  // Maximum of 30 FPS
  // This handles the case where user comes back to browser after long time
  dt = Math.min(now - time, 1.0 / 30.0);

  // Set the current real world time
  time = now;

  // Set the current game time
  if (!gameState.paused) {
    gameTime += dt;
  }

  // Update input state
  updateKeys();
  updateGamepad();
  startFrame();

  if (!audioGeneratorDone) {
    overlayCtx.textBaseline = 'middle';
    setFontSize(16);
    setTextAlign('center');
    drawShadowText('LOADING...', WIDTH / 2, 270);

    // Draw a rectangle outline
    overlayCtx.strokeStyle = 'white';
    overlayCtx.lineWidth = 1;
    overlayCtx.strokeRect(WIDTH / 2 - 80, 300, 160, 10);

    // Fill the rectangle progress
    overlayCtx.fillStyle = 'white';
    overlayCtx.fillRect(WIDTH / 2 - 80, 300, 160 * audioGeneratorProgress, 10);
  } else if (!firstClick) {
    overlayCtx.textBaseline = 'middle';
    setFontSize(16);
    setTextAlign('center');
    drawShadowText(ENTER_MSG, WIDTH / 2, 270);

    if (isAnyInputDown()) {
      firstClick = true;
      titleMusic.startPlaying();
      initTitleScreen();
      resetInputs();
    }
  } else {
    updateWorld();
  }

  endFrame();
  requestAnimationFrame(gameLoop);
};
requestAnimationFrame(gameLoop);

const updateWorld = (): void => {
  handleInput();
  updateEntities();
  collisionDetection();
  drawOverlays();
  renderEntities();
  updateCamera();
  drawTransitionOverlay();
};

const handleInput = (): void => {
  if (gameState.level === 0) {
    handleTitleInput();
  } else {
    handleGameInput();
  }
};

const handleTitleInput = (): void => {
  if (isKeyPressed(KEY_ENTER)) {
    titleMusic.stopPlaying();
    gameMusic.startPlaying();
    dialogOpenSound.playOnce();
    nextLevel();
  }
};

const handleGameInput = (): void => {
  player.accelerating = false;

  const gamepad = getGamepad();

  setVec3(moveDir, 0, 0, 0);

  if (DEBUG && isKeyPressed(KEY_1)) {
    showDebug = !showDebug;
    gameState.screenShakeTime = gameTime + 0.5;
    player.invincibleTime = gameTime + 0.5;
  }

  if (DEBUG && isKeyPressed(KEY_3)) {
    const size = 0.1 + unitRandom() * 3.0;
    const mass = size ** 3;
    dropBoxes(player.shape.center, 10, size, mass);
  }

  if (DEBUG && isKeyPressed(KEY_4)) {
    talkSound.playOnce();
  }

  if (isKeyDown(KEY_SPACE) && player.power > 0) {
    // Decrease player power by 10 units per second
    player.power -= 10 * dt;

    vacuumSound.startPlaying();

    player.shape.setupTransformMatrix();
    setVec3(vacuumPosition, 1.4, 3.2, 2.4);
    transformMat4Vec3(vacuumPosition, vacuumPosition, player.shape.transformMatrix);
    setVec3(vacuumDirection, 1.4, 1, 10);
    transformMat4Vec3(vacuumDirection, vacuumDirection, player.shape.transformMatrix);
    subtractVec3(vacuumDirection, vacuumDirection, vacuumPosition);

    let closestEntity: GameEntity | undefined = undefined;
    let closestDist = 20;

    // Vacuum entities
    for (const e of entities) {
      // Only consider entities that are not static, noclip, or the player
      if (!e.shape.static && !e.shape.noclip && e !== player) {
        // Check if the entity is in front of the vacuum
        subtractVec3(vacuumDelta, e.shape.center, vacuumPosition);
        if (dotVec3(vacuumDelta, vacuumDirection) > 0) {
          // Check if the entity is within the vacuum range
          const dist = magnitudeVec3(vacuumDelta);
          if (dist < 20) {
            e.inVacuum = true;
            if (dist < 3) {
              // Lock it in place
              copyVec3(e.shape.velocity, player.shape.velocity);
              // TODO: Currently, all shapes are boxes.
              const box = e.shape as Box;
              scaleVec3(box.halfExtents, box.halfExtents, 0.8);
              if (box.halfExtents[0] < 0.3) {
                e.health = 0;
                suckSound.playOnce();
                gameState.screenShakeTime = gameTime + 0.5;
                const points = e instanceof Ghost ? 1000 : 10;
                player.score += points;
                new FloatingText(e.shape.center, points.toString(), OVERLAY_GREEN);
              }
            } else {
              // Pull it
              const force = clamp(10000 / dist, 1000, 5000);
              const acceleration = force / e.shape.mass;
              normalizeVec3(vacuumImpulse, vacuumDelta);
              scaleAndAddVec3(e.shape.velocity, e.shape.velocity, vacuumImpulse, -dt * acceleration);
              e.shape.sleepCount = 0;

              const speed = magnitudeVec3(e.shape.velocity);
              if (speed > 24) {
                scaleVec3(e.shape.velocity, e.shape.velocity, 12 / speed);
              }
            }
          }
          if (dist < closestDist) {
            closestEntity = e;
            closestDist = dist;
          }
        }
      }
    }
    if (closestEntity) {
      player.turnTowardVec3(closestEntity.shape.center, 0.05);
    }
  } else {
    vacuumSound.stopPlaying();
  }

  if (isKeyPressed(KEY_R) && !gameState.gameOverTime) {
    restartLevel();
  }

  if (isKeyPressed(KEY_M)) {
    gameMusic.togglePlaying();
  }

  if (DEBUG && isKeyPressed(KEY_6)) {
    explodeSound.playOnce();
  }

  if (DEBUG && isKeyPressed(KEY_7)) {
    dialogOpenSound.playOnce();
    talkSound.playOnce();
    showDialog('Welcome to the Untitled Ghost Game!');
  }

  if (DEBUG && isKeyPressed(KEY_8)) {
    dialogOpenSound.playOnce();
    gameState.level = 1;
    restartLevel();
  }

  if (DEBUG && isKeyPressed(KEY_9)) {
    dialogOpenSound.playOnce();
    nextLevel();
  }

  if (transitionFunc) {
    transitionAnimation += 0.02;
    if (transitionAnimation >= 1) {
      transitionFunc();
      transitionFunc = undefined;

      // HACK: It would be better for transition func implementations to do this manually,
      // but 100% of them call updateBuffers(STATIC_DRAW) so this is a quick fix.
      updateBuffers(STATIC_DRAW);
    }
  } else {
    transitionAnimation = clamp(transitionAnimation - 0.02, 0, 1);
  }

  const moveSpeed = 0.0001;

  if (isKeyDown(KEY_UP) || isKeyDown(KEY_W)) {
    moveDir[2] += moveSpeed;
  }
  if (isKeyDown(KEY_DOWN) || isKeyDown(KEY_S)) {
    moveDir[2] -= moveSpeed;
  }
  if (isKeyDown(KEY_LEFT) || isKeyDown(KEY_A)) {
    moveDir[0] -= moveSpeed;
  }
  if (isKeyDown(KEY_RIGHT) || isKeyDown(KEY_D)) {
    moveDir[0] += moveSpeed;
  }

  // if (DEBUG && isKeyPressed(KEY_SPACE)) {
  //   // player.jump();
  //   player.shape.center[1] += 1;
  //   player.shape.velocity[1] = 20;
  //   setVec3(player.shape.angularVelocity, 0, 0, 0);
  // }

  if (GAMEPAD_ENABLED && gamepad && Math.hypot(gamepad.axes[0], gamepad.axes[1]) > 0.5) {
    moveDir[0] += gamepad.axes[0];
    moveDir[2] -= gamepad.axes[1];
  }

  if (magnitudeVec3(moveDir) > 0) {
    player.move(moveDir);
  } else {
    const linearDamping = 0.001 ** dt;
    player.shape.velocity[0] *= linearDamping;
    player.shape.velocity[2] *= linearDamping;
  }

  if (magnitudeVec3(player.shape.velocity) > 20) {
    if (unitRandom() < 0.15) {
      const dust = new Particle(player.shape.center);
      dust.shape.center[0] += symmetricRandom();
      dust.shape.center[2] += symmetricRandom();
      dust.shape.velocity[1] = 2;
      dust.acceleration[1] = 2;
    }
    if (!player.ai) {
      walkSound.startPlaying();
    }
  } else {
    walkSound.stopPlaying();
  }

  if (gameState.gameOverTime && entities.length < 100 && Math.random() < 0.1) {
    dropBoxes(createVec3(0, 20, 0), 1, 1, 1);
  }
};

const updateEntities = (): void => {
  for (const e of entities) {
    e.update();
  }
};

const collisionDetection = (): void => {
  // Player shape is never sleeping
  player.shape.sleepCount = 0;

  // Step count: Should be 600 steps per second
  const stepCount = clamp(Math.round(600 * dt), 1, 20);

  // Physics: Update all shapes
  for (let step = 0; step < stepCount; step++) {
    for (let i = 0; i < entities.length; i++) {
      const shape = entities[i].shape;
      if (!shape.noclip && !shape.static && shape.sleepCount < SLEEP_THRESHOLD) {
        shape.update();
      }
      shape.setupTransformMatrix();
      shape.updateBounds();
    }

    // Do entity-to-entity collision detection
    for (let i = 0; i < entities.length; i++) {
      const attacker = entities[i];
      if (!attacker.shape.noclip) {
        for (let j = i + 1; j < entities.length; j++) {
          const defender = entities[j];
          if (
            !defender.shape.noclip &&
            ((!attacker.shape.static && attacker.shape.sleepCount < SLEEP_THRESHOLD) ||
              (!defender.shape.static && defender.shape.sleepCount < SLEEP_THRESHOLD)) &&
            attacker.shape.broadphaseIntersects(defender.shape)
          ) {
            if (detectCollision(intersection, attacker.shape, defender.shape)) {
              solvePenatration(attacker.shape, defender.shape, intersection);
            }
          }
        }
      }
    }
  }

  for (const e of entities) {
    // Reset inVacuum flag
    e.inVacuum = false;

    // Update shape sleeping state
    const shape = e.shape;
    if (!shape.static) {
      if (magnitudeVec3(shape.velocity) < 0.5 && magnitudeVec3(shape.angularVelocity) < 0.5) {
        shape.sleepCount++;
      }
    }
  }
};

const drawOverlays = (): void => {
  if (gameState.level === 0) {
    drawTitleOverlay();
  } else if (!transitionFunc) {
    drawGameOverlay();
  }

  if (DEBUG) {
    drawDebugOverlay();
  }
};

const drawTitleOverlay = (): void => {
  setTextAlign('center');
  setFontSize(32);
  drawShadowText('PHANTOMICUS', WIDTH / 2, 80);

  setGlobalAlpha((Math.sin(time * 5) + 1) * 0.5);
  setFontSize(12);
  drawShadowText(ENTER_MSG, WIDTH / 2, HEIGHT - 40);
  setGlobalAlpha(1.0);
};

export const showDialog = (text: string, nextFunc?: () => void): void => {
  gameState.dialogText = text;
  gameState.dialogOpenTime = gameTime;
  gameState.dialogTargetOpacity = 1;
  gameState.dialogNextFunc = nextFunc;
  dialogOpenSound.playOnce();
  talkSound.playOnce();
};

export const showDialogs = (texts: string[]): void => {
  let nextFunc: (() => void) | undefined = undefined;
  for (let i = texts.length - 1; i >= 0; i--) {
    const text = texts[i];
    const currentFunc = nextFunc;
    nextFunc = () => showDialog(text, currentFunc);
  }
  (nextFunc as () => void)();
};

export const hideDialog = (): void => {
  gameState.dialogTargetOpacity = 0;
};

const drawGameOverlay = (): void => {
  if (gameState.bossTriggered && !gameState.gameOverTime) {
    setTextAlign('center');
    setFontSize(20);
    drawShadowText(`WAVE ${gameState.wave} / ${BOSS_WAVES}`, WIDTH / 2 - 20, 60);
  }

  setTextAlign('left');
  setFontSize(20);
  drawShadowText(`🏨 ${gameState.level}`, 10, 20);
  drawShadowText(`❤️ ${player.health}`, 10, 60);
  drawShadowText(`⚡ ${player.power | 0}`, 10, 100);
  drawShadowText(`💰 ${player.score.toLocaleString()}`, 10, 140);
  drawShadowText(`⏱️ ${gameTime.toFixed(1)}`, 10, 180);

  setFontSize(12);
  drawShadowText('SPACEBAR - VACUUM    R - RESTART    M - MUSIC', 10, HEIGHT - 20);

  drawDialogOverlay();
};

const drawDialogOverlay = (): void => {
  gameState.dialogCurrentOpacity = lerp(gameState.dialogCurrentOpacity, gameState.dialogTargetOpacity, dt * 10);
  if (gameState.dialogCurrentOpacity > 0.01) {
    setGlobalAlpha(gameState.dialogCurrentOpacity);

    const length = clamp((gameTime - gameState.dialogOpenTime) * 30, 1, gameState.dialogText.length);

    // Hack: I don't like mixing game state and rendering code, but this is a quick fix
    if (isKeyPressed(KEY_ENTER)) {
      if (length < gameState.dialogText.length) {
        gameState.dialogOpenTime = -1000;
      } else {
        hideDialog();
        if (gameState.dialogNextFunc) {
          gameState.dialogNextFunc();
        }
      }
    }

    // Text box
    fillRect(200, HEIGHT - 140, WIDTH - 400, 100, 'rgba(60, 100, 210, 0.5)');

    setFontSize(20);
    drawShadowText(gameState.dialogText.substring(0, length), 280, HEIGHT - 120);

    // hair
    fillEllipse(210, HEIGHT - 95, 6, 40, '#f0f0f0');

    // head
    fillEllipse(210, HEIGHT - 80, 40, 32, '#eabf96');

    // left lens
    fillEllipse(190, HEIGHT - 85, 18, 18, '#76a190');

    // right lens
    fillEllipse(230, HEIGHT - 85, 18, 18, '#76a190');

    // nose
    fillEllipse(210, HEIGHT - 70, 10, 8, '#e49076');

    if (length >= gameState.dialogText.length) {
      overlayCtx.globalAlpha = (Math.sin(gameTime * 5) + 1) * gameState.dialogCurrentOpacity;
      setFontSize(12);
      drawShadowText(ENTER_MSG, WIDTH - 400, HEIGHT - 60);
    }

    setGlobalAlpha(1.0);
  }
};

const drawDebugOverlay = (): void => {
  if (DEBUG && showDebug) {
    const debugX = 750;
    setTextAlign('left');
    setFontSize(10);
    drawShadowText(`health = ${player.health.toFixed(1)}`, debugX, 120);
    drawShadowText(`time = ${time.toFixed(1)}`, debugX, 140);
    drawShadowText(`gameTime = ${gameTime.toFixed(1)}`, debugX, 160);
    drawShadowText(`dt = ${dt.toFixed(3)}`, debugX, 180);
    drawShadowText(`player.pos = ${strVec3(player.shape.center)}`, debugX, 200);
    drawShadowText(`player.velocity = ${strVec3(player.shape.velocity)}`, debugX, 220);
    drawShadowText(`player.angular = ${strVec3(player.shape.angularVelocity)}`, debugX, 240);
    drawShadowText(`lightSource.source = ${strVec3(lightSource.source)}`, debugX, 260);
    drawShadowText(`entities.length = ${entities.length}`, debugX, 320);
  }
};

const renderEntities = (): void => {
  for (let i = entities.length - 1; i >= 0; i--) {
    const entity = entities[i];
    if (entity.health <= 0) {
      if (entity === player) {
        if (!transitionFunc) {
          // Player died
          // Reset position and health
          deathSound.playOnce();
          restartLevel();
        }
      } else {
        entities.splice(i, 1);
        const onDeath = entity.onDeath;
        if (onDeath) {
          setTimeout(() => onDeath(entity), 500);
        }
      }
      continue;
    }
    entity.render();
  }

  if (isKeyDown(KEY_SPACE) && player.power > 0) {
    renderVacuumAnimation(0);
    renderVacuumAnimation(5);
    renderVacuumAnimation(10);
    renderVacuumAnimation(15);
  }
};

const renderVacuumAnimation = (offset: number): void => {
  const vacuumColor = 0x30f0f0f0;
  const vacuumDistance = 20 - ((gameTime * 30 + offset) % 20);
  const vacuumWidth = 2 + 0.3 * vacuumDistance;
  const vacuumHeight = 2 + 0.2 * vacuumDistance;
  const vacuumThickness = 0.01 * vacuumDistance;

  // Left side
  player.quickShape(
    DYNAMIC_CUBES,
    vacuumColor,
    1.4 - vacuumWidth,
    2.4,
    vacuumDistance,
    vacuumThickness,
    vacuumHeight,
    vacuumThickness
  );

  // Right side
  player.quickShape(
    DYNAMIC_CUBES,
    vacuumColor,
    1.4 + vacuumWidth,
    2.4,
    vacuumDistance,
    vacuumThickness,
    vacuumHeight,
    vacuumThickness
  );

  // Top
  player.quickShape(
    DYNAMIC_CUBES,
    vacuumColor,
    1.4,
    2.4 + vacuumHeight,
    vacuumDistance,
    vacuumWidth,
    vacuumThickness,
    vacuumThickness
  );

  // Bottom
  player.quickShape(
    DYNAMIC_CUBES,
    vacuumColor,
    1.4,
    2.4 - vacuumHeight,
    vacuumDistance,
    vacuumWidth,
    vacuumThickness,
    vacuumThickness
  );
};

const updateCamera = (): void => {
  lerpVec3(
    camera.source,
    camera.source,
    player.shape.center[0],
    player.shape.center[1] + gameState.cameraYOffset,
    player.shape.center[2] + gameState.cameraZOffset,
    gameState.cameraLerpRate
  );
  lerpVec3(
    camera.lookAt,
    camera.lookAt,
    player.shape.center[0],
    player.shape.center[1] + 6,
    player.shape.center[2],
    gameState.cameraLerpRate
  );

  if (gameTime < gameState.screenShakeTime) {
    const shake = gameState.screenShakeTime - gameTime;
    camera.lookAt[0] += shake * symmetricRandom();
    camera.lookAt[1] += shake * symmetricRandom();
    camera.lookAt[2] += shake * symmetricRandom();
  }

  lookAt(camera, camera.lookAt, Math.PI / 4);

  setVec3(lightSource.source, LIGHT_X_OFFSET, LIGHT_Y_OFFSET, LIGHT_Z_OFFSET);
  transformMat4Vec3(lightSource.source, lightSource.source, player.shape.transformMatrix);
  setVec3(lightSource.lookAt, LIGHT_X_OFFSET, 1, 10);
  transformMat4Vec3(lightSource.lookAt, lightSource.lookAt, player.shape.transformMatrix);
  lookAt(lightSource, lightSource.lookAt, 1);
};

const drawTransitionOverlay = (): void => {
  if (transitionAnimation > 0.001) {
    const radius = clamp(WIDTH * (1.0 - transitionAnimation), 1, WIDTH);
    overlayCtx.fillStyle = OVERLAY_BLACK;
    overlayCtx.beginPath();
    overlayCtx.arc(WIDTH / 2, HEIGHT / 2, radius, 0, 2 * Math.PI);
    overlayCtx.rect(WIDTH, 0, -WIDTH, HEIGHT);
    overlayCtx.fill();
  }
};

preloadAudio((progress) => (audioGeneratorProgress = progress))
  .then(() => (audioGeneratorDone = true))
  .catch(console.error);
