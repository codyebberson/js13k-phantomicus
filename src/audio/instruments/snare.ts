import { identity } from '../../utils';
import { FILTER_HIPASS, FilteredInstrument, sint, whiteNoise } from '../player';

export const snare: FilteredInstrument = [
  identity, // No pitch envelope needed for snare
  // Body of the snare: mix of sint wave and noise
  // const envelope = 0.1;
  // const toneBody = sint(t * 180) * 0.1; // Higher frequency for snare body
  // const noiseBody = whiteNoise() * 0.1;
  (t) => sint(t * 180) * 0.03 + whiteNoise() * 0.07,
  0.001, // Very fast attack
  0.1, // Short decay
  0.1, // Low sustain
  0.1, // Quick release
  FILTER_HIPASS,
  // Start with a higher cutoff and reduce it slightly
  (x, _t) => x * 0.5,
  (_x, _t) => 0.3, // Moderate resonance for some 'snap'
];
