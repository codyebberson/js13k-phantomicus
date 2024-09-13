import { FILTER_LOPASS, FilteredInstrument, sint, whiteNoise } from '../player';

export const hiMidTom: FilteredInstrument = [
  (x, t) => x * (1 + Math.exp(-t * 20) * 0.5), // Pitch envelope: start slightly higher and drop to the fundamental frequency
  // Main body of the tom: sine wave with slight overtones
  // Add a touch of noise for the stick attack
  (t) => (sint(t) + sint(t * 1.5) * 0.3 + sint(t * 2) * 0.1) * 0.5 + whiteNoise() * Math.exp(-t * 200) * 0.1,
  0.001, // Very fast attack
  0.15, // Moderate decay
  0.2, // Some sustain
  0.2, // Moderate release
  FILTER_LOPASS,
  // Filter envelope: start open and gradually close
  (x, t) => x * (0.5 + Math.exp(-t * 10) * 1.5),
  (_x, _t) => 0.5, // Moderate resonance for some 'body'
];
