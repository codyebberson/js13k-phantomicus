import { identity } from '../../utils';
import { FILTER_BANDPASS, MultiVoiceInstrument, square } from '../player';

export const theramin: MultiVoiceInstrument = [
  identity, // frequency
  (t) => 0.7 * square(t), // oscillator
  0.01, // attack
  0.01, // decay
  0.5, // sustain
  0.1, // release
  FILTER_BANDPASS, // filter
  (x) => x * 1.25, // filterFreq
  (_x) => 0.1, // filterRes
  7, // unison
  0.003, // detune
];
