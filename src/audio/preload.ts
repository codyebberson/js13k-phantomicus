import { gameMusic } from './music/game';
import { titleMusic } from './music/title';
import { AudioGeneratorCallback, Sound } from './player';
import { coinSound } from './sounds/coin';
import { deathSound } from './sounds/death';
import { dialogOpenSound } from './sounds/dialogopen';
import { explodeSound } from './sounds/explode';
import { hurtSound } from './sounds/hurt';
import { keySound } from './sounds/key';
import { pipeSound } from './sounds/pipe';
import { suckSound } from './sounds/suck';
import { talkSound } from './sounds/talk';
import { vacuumSound } from './sounds/vacuum';
import { walkSound } from './sounds/walk';

const sounds: Sound[] = [
  dialogOpenSound,
  coinSound,
  keySound,
  pipeSound,
  walkSound,
  vacuumSound,
  suckSound,
  talkSound,
  deathSound,
  explodeSound,
  hurtSound,
  gameMusic,
  titleMusic,
];

export const preloadAudio = async (callback: AudioGeneratorCallback): Promise<void> => {
  for (const sound of sounds) {
    await sound.init(callback);
  }
};
