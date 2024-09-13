import { identity } from '../../utils';
import { FILTER_LOPASS, MultiVoiceInstrument, square } from '../player';

export const bass: MultiVoiceInstrument = [
  identity, // frequency
  (t) => 0.4 * square(t), // oscillator
  0.01, // attack
  0.01, // decay
  0.5, // sustain
  0.1, // release
  FILTER_LOPASS, // filter
  (_x) => 1200, // filterFreq
  (_x) => 0.8, // filterRes,
  1, // unison
  0.001, // detune
];
