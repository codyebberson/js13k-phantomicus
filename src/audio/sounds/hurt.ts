import { clamp } from '../../utils';
import { a3 } from '../notes';
import { FILTER_LOPASS, FilteredInstrument, Sound, sint } from '../player';

const hurtInstrument: FilteredInstrument = [
  // identity, // frequency
  (x, t) => clamp(x - 500 * t, 20, 2000), // frequency
  (t) => 0.3 * sint(t), // oscillator
  0.01, // attack
  0.01, // decay
  0.8, // sustain
  0.01, // release
  FILTER_LOPASS, // filter
  // Filter frequency should start high and go low over time
  (x, t) => clamp(5 * x - 25 * x * t, 20, 5000), // filterFreq
  (_x) => 0.7, // filterRes
];

export const hurtSound = new Sound([
  [
    [
      hurtInstrument,
      [
        [a3, 0, 0.2],
        [a3, 0.2, 0.2],
      ],
    ],
  ],
]);
