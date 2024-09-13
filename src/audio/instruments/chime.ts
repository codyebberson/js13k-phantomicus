import { identity } from '../../utils';
import { MinimalInstrument, square } from '../player';

export const chime: MinimalInstrument = [
  identity, // frequency
  (t) => 0.5 * square(t), // oscillator
  0.01, // attack
  0.01, // decay
  0.2, // sustain
  0.02, // release
];
