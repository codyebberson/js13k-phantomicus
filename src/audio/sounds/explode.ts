import { clamp, identity } from '../../utils';
import { a4, f4, g4 } from '../notes';
import { FILTER_LOPASS, FilteredInstrument, Sound, whiteNoise } from '../player';

const explodeInstrument: FilteredInstrument = [
  identity, // frequency
  (_t) => 0.3 * whiteNoise(), // oscillator
  0.01, // attack
  0.01, // decay
  0.8, // sustain
  0.01, // release
  FILTER_LOPASS, // filter
  // Filter frequency should start high and go low over time
  (x, t) => clamp(5 * x - 25 * x * t, 20, 5000), // filterFreq
  (_x) => 0.7, // filterRes
];

export const explodeSound = new Sound([
  [
    [
      explodeInstrument,
      [
        [a4, 0, 0.2],
        [a4, 0.2, 0.2],
        [g4, 0.4, 0.2],
        [f4, 0.6, 0.2],
      ],
    ],
  ],
]);
