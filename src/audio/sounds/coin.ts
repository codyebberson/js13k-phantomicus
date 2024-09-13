import { chime } from '../instruments/chime';
import { a6, d5, d6, fs5 } from '../notes';
import { Sound } from '../player';

export const coinSound = new Sound([
  [
    [
      chime,
      [
        [d5, 0.0, 0.05],
        [fs5, 0.05, 0.05],
        [a6, 0.1, 0.05],
        [d6, 0.15, 0.05],
      ],
    ],
  ],
]);
