import { MinimalInstrument, sint, whiteNoise } from '../player';

export const kick: MinimalInstrument = [
  // Pitch envelope: start high and quickly drop to the fundamental frequency
  (x, t) => x * (1 + Math.exp(-t * 30) * 2),
  // Main body of the kick: sint wave
  // const fundamental = sint(t);
  // Add some distortion for punch
  // const distortion = Math.tanh(sint(t) * 2) * 0.5;
  // Add noise for the initial click
  // const clickNoise = Math.exp(-t * 200) * whiteNoise() * 0.2;
  (t) => (sint(t) * 0.7 + Math.tanh(sint(t) * 2) * 0.5 * 0.3) * 0.8 + Math.exp(-t * 200) * whiteNoise() * 0.2,
  0.001, // Very fast attack
  0.15, // Short decay
  0.1, // Low sustain level
  0.1, // Quick release
];
