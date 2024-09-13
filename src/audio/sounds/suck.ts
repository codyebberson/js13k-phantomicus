import { clamp, identity } from '../../utils';
import { FILTER_LOPASS, FilteredInstrument, Sound, whiteNoise } from '../player';

export const vacuumSuction: FilteredInstrument = [
  identity, // frequency
  (_t) => 0.4 * whiteNoise(),
  0.01, // Short attack
  0.1, // Short decay
  0.5, // Moderate sustain
  0.05, // Slightly longer release
  FILTER_LOPASS, // Low-pass filter to shape the sound
  (_x, t) => clamp(500 ** (1 + 4 * t), 500, 20000), // Slower filter frequency sweep
  (_x, _t) => 0.5, // Moderate resonance
];

export const suckSound = new Sound([[[vacuumSuction, [[1, 0, 0.25]]]]]);
