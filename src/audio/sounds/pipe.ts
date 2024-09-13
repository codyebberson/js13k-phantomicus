import { chime } from '../instruments/chime';
import { a4, c3, d4, e5, g3 } from '../notes';
import { Sound } from '../player';

export const pipeSound = new Sound([
  [
    [
      chime,
      [
        [e5, 0.0, 0.04],
        [a4, 0.04, 0.04],
        [d4, 0.08, 0.04],
        [g3, 0.12, 0.04],
        [c3, 0.16, 0.04],
        [e5, 0.24, 0.04],
        [a4, 0.28, 0.04],
        [d4, 0.32, 0.04],
        [g3, 0.36, 0.04],
        [c3, 0.4, 0.04],
        [e5, 0.48, 0.04],
        [a4, 0.52, 0.04],
        [d4, 0.56, 0.04],
        [g3, 0.6, 0.04],
        [c3, 0.64, 0.04],
      ],
    ],
  ],
]);
