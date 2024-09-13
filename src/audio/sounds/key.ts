import { chime } from '../instruments/chime';
import { b5, b6, e6, fs6 } from '../notes';
import { Sound } from '../player';

export const keySound = new Sound([
  [
    [
      chime,
      [
        [b5, 0.0, 0.06], // Start with B5
        [e6, 0.04, 0.06], // Quick jump to E6
        [fs6, 0.08, 0.08], // Slightly longer FS6
        [b6, 0.14, 0.1], // End on a higher B6
      ],
    ],
  ],
]);
