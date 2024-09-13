import { g3 } from '../notes';
import { FILTER_LOPASS, Sound, square, whiteNoise } from '../player';

export const vacuumSound = new Sound([
  [
    [
      [
        // Generate a frequency function that starts at 50 hz and then ramps up to x hz
        (x, t) => Math.min(x, 50 + 300 * t) + 8 * Math.sin(15 * t), // frequency
        (t) => 0.2 * square(t) + 0.5 * whiteNoise(), // oscillator
        0.2, // attack
        0.01, // decay
        0.4, // sustain
        0.03, // release
        FILTER_LOPASS, // filter
        (_x, _t) => 500, // filterFreq
        (_x) => 0.7, // filterRes
      ],
      [[g3, 0.0, 10]],
    ],
  ],
  4,
  true,
]);
