import { identity } from '../../utils';
import { as8 } from '../notes';
import { FILTER_LOPASS, Sound, whiteNoise } from '../player';

export const walkSound = new Sound([
  [
    [
      [
        identity, // frequency
        (_t) => 0.2 * whiteNoise(), // oscillator
        0.03, // attack
        0.01, // decay
        0.2, // sustain
        0.03, // release
        FILTER_LOPASS, // filter
        (_x, _t) => 500, // filterFreq
        (_x) => 0.7, // filterRes
      ],
      [[as8, 0.0, 0.05]],
    ],
  ],
  0.28,
  true,
]);
