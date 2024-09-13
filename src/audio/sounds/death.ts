import { chime } from '../instruments/chime';
import { as4, c5, ds3, ds4, f5, gs4 } from '../notes';
import { Sound } from '../player';

export const deathSound = new Sound([
  [
    [
      chime,
      [
        [ds3, 0.0, 0.1],
        [f5, 0.1, 0.1],
        [as4, 0.2, 0.1],
        [ds4, 0.3, 0.1],
        [gs4, 0.4, 0.1],
        [c5, 0.5, 0.25],
      ],
    ],
  ],
]);
