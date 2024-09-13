import { identity } from '../../utils';
import { FILTER_HIPASS, FilteredInstrument, whiteNoise } from '../player';

export const closedHiHat: FilteredInstrument = [
  identity, // No pitch envelope needed for hi-hat
  () => 0.05 * whiteNoise(), // Short noise burst
  0.001, // Very fast attack
  0.03, // Very short decay
  0, // No sustain for closed hi-hat
  0.01, // Very quick release
  FILTER_HIPASS,
  (_x, _t) => 2000, // High cutoff frequency
  (_x, _t) => 0.5, // Higher resonance for metallic character
];
