import { identity } from '../../utils';
import { FILTER_LOPASS, FilteredInstrument, square } from '../player';

export const synthLead: FilteredInstrument = [
  identity, // frequency
  (t) => 0.075 * (square(t) + square(t / 2)), // oscillator
  0.01, // attack
  0.01, // decay
  0.5, // sustain
  0.1, // release
  FILTER_LOPASS, // filter
  (_x) => 2000, // filterFreq
  (_x) => 0.5, // filterRes
];
