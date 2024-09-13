import { identity } from '../../utils';
import { MinimalInstrument, square } from '../player';

export const blip: MinimalInstrument = [
  identity, // frequency
  (t) => 0.4 * square(t),
  0.01, // Very short attack
  0.02, // Short decay
  0.25, // No sustain
  0.02, // Short release
];
