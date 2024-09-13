import { identity } from '../../utils';
import { FILTER_HIPASS, FilteredInstrument, whiteNoise } from '../player';

export const openHiHat: FilteredInstrument = [
  identity, // No pitch envelope needed for hi-hat
  // Hi-hat is primarily noise-based
  // Shape the noise with a longer envelope for open hi-hat
  () => whiteNoise() * 0.3,
  0.001, // Very fast attack
  0.3, // Longer decay for open hi-hat
  0.1, // Some sustain for open hi-hat
  0.2, // Longer release for open hi-hat
  FILTER_HIPASS,
  (_x, _t) => 1500, // Slightly lower cutoff frequency compared to closed hi-hat
  (_x, _t) => 0.4, // Slightly lower resonance for a less "ringy" sound
];
