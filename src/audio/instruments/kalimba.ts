import { identity } from '../../utils';
import { MinimalInstrument, sint } from '../player';

export const kalimba: MinimalInstrument = [
  identity, // frequency
  // FM synthesis
  // const carrier = sint(t);
  // const modulator = sint(t * 3); // Modulator frequency is 3x the carrier
  // const modIndex = 0.2; // Low modulation index for subtle timbral changes
  (t) => 0.2 * (sint(t) * (1 + 0.2 * sint(t * 3))),
  0.001, // Very quick attack
  0.15, // Short decay (150ms)
  0.1, // Low sustain level
  0.1, // Short release
];
