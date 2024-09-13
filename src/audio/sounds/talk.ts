import { identity, unitRandom } from '../../utils';
import { FILTER_LOPASS, Note, Sound, sint } from '../player';

const count = 20;
const notes: Note[] = [];
for (let i = 0; i < count; i++) {
  notes.push([200 + 100 * unitRandom(), i / 12, 0.05]);
}

export const talkSound = new Sound([
  [
    [
      [
        identity, // frequency
        (t) => 0.3 * sint(t), // oscillator
        0.01, // attack
        0.01, // decay
        0.8, // sustain
        0.01, // release
        FILTER_LOPASS, // filter
        (_x, _t) => 300, // filterFreq
        (_x) => 0.5, // filterRes
        3, // unison
        0.01, // detune
      ],
      notes,
    ],
  ],
]);
