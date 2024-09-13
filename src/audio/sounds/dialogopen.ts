import { chime } from '../instruments/chime';
import { as5, d5, f5 } from '../notes';
import { Sound } from '../player';

export const dialogOpenSound = new Sound([
  [
    [
      chime,
      [
        [d5, 0.0, 0.05],
        [f5, 0.05, 0.05],
        [as5, 0.1, 0.05],
      ],
    ],
  ],
]);
