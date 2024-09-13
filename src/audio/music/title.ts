import { bass } from '../instruments/bass';
import { closedHiHat } from '../instruments/closedhihat';
import { hiMidTom } from '../instruments/himidtom';
import { kalimba } from '../instruments/kalimba';
import { kick } from '../instruments/kick';
import { snare } from '../instruments/snare';
import { synthLead } from '../instruments/synthlead';
import { theramin } from '../instruments/theramin';
import { Instrument, Sound } from '../player';
import { PackedTrack, unpackSong } from './unpack';

// Track channel: 0
// Track instrument: acoustic grand piano
const track0_AcousticGrandPiano: PackedTrack = [
  [
    [
      [0, 12, 69],
      [12, 2, 71],
      [16, 2, 72],
      [20, 2, 69],
      [24, 2, 72],
      [28, 2, 76],
    ],
    [
      [0, 16, 75],
      [16, 4, 76],
    ],
    [
      [4, 12, 76],
      [16, 16, 79],
    ],
    [
      [0, 16, 78],
      [16, 16, 75],
    ],
  ],
  [
    [0, 0],
    [1, 32],
    [2, 192],
    [3, 224],
  ],
];

// Track channel: 2
// Track instrument: acoustic grand piano
const track2_AcousticGrandPiano: PackedTrack = [
  [
    [
      [0, 12, 33],
      [12, 2, 35],
      [16, 2, 36],
      [20, 2, 33],
      [24, 2, 36],
      [28, 2, 40],
    ],
    [
      [0, 16, 39],
      [16, 4, 40],
    ],
    [
      [0, 4, 45],
      [24, 4, 40],
    ],
    [
      [0, 4, 45],
      [12, 4, 52],
      [16, 8, 51],
      [24, 4, 52],
    ],
    [[0, 4, 45]],
    [
      [0, 4, 48],
      [12, 4, 46],
      [16, 8, 47],
      [24, 4, 40],
    ],
  ],
  [
    [0, 0],
    [1, 32],
    [2, 64],
    [3, 96],
    [4, 128],
    [5, 160],
    [2, 192],
    [3, 224],
  ],
];

// Track channel: 4
// Track instrument: acoustic grand piano
const track4_AcousticGrandPiano: PackedTrack = [
  [
    [
      [0, 12, 81],
      [12, 2, 83],
      [16, 2, 84],
      [20, 2, 81],
      [24, 2, 84],
      [28, 2, 88],
    ],
    [
      [0, 16, 87],
      [16, 4, 88],
    ],
    [
      [4, 2, 76],
      [8, 2, 76],
      [12, 2, 76],
      [16, 4, 76],
      [24, 4, 72],
      [28, 4, 76],
    ],
    [
      [0, 4, 75],
      [8, 4, 71],
    ],
    [
      [4, 2, 74],
      [8, 2, 74],
      [12, 2, 74],
      [16, 4, 74],
      [24, 4, 71],
      [28, 4, 74],
    ],
    [
      [0, 4, 72],
      [12, 4, 70],
      [16, 2, 71],
      [24, 2, 64],
    ],
  ],
  [
    [0, 0],
    [1, 32],
    [2, 64],
    [3, 96],
    [4, 128],
    [5, 160],
    [2, 192],
    [3, 224],
  ],
];

// Track channel: 6
// Track instrument: acoustic grand piano
const track6_AcousticGrandPiano: PackedTrack = [
  [
    [
      [4, 4, 57],
      [4, 4, 60],
      [4, 4, 64],
      [12, 4, 57],
      [12, 4, 60],
      [12, 4, 64],
      [20, 4, 57],
      [20, 4, 60],
      [20, 4, 64],
      [28, 4, 57],
      [28, 4, 60],
      [28, 4, 64],
    ],
    [
      [4, 4, 57],
      [4, 4, 60],
      [4, 4, 63],
      [12, 4, 57],
      [12, 4, 60],
      [12, 4, 63],
      [20, 4, 57],
      [20, 4, 60],
      [20, 4, 63],
      [28, 4, 57],
      [28, 4, 60],
      [28, 4, 63],
    ],
    [
      [4, 4, 57],
      [4, 4, 62],
      [4, 4, 65],
      [12, 4, 57],
      [12, 4, 62],
      [12, 4, 65],
      [20, 4, 57],
      [20, 4, 62],
      [20, 4, 65],
      [28, 4, 57],
      [28, 4, 62],
      [28, 4, 65],
    ],
    [
      [4, 4, 57],
      [4, 4, 60],
      [4, 4, 65],
      [12, 4, 57],
      [12, 4, 60],
      [12, 4, 65],
      [20, 4, 59],
      [20, 4, 62],
      [20, 4, 64],
      [28, 4, 59],
      [28, 4, 62],
      [28, 4, 64],
    ],
  ],
  [
    [0, 64],
    [1, 96],
    [2, 128],
    [3, 160],
    [0, 192],
    [1, 224],
  ],
];

// Track channel: 8
// Track instrument: acoustic grand piano
const track8_AcousticGrandPiano: PackedTrack = [
  [
    [
      [0, 4, 45],
      [8, 4, 45],
      [16, 4, 45],
      [24, 4, 40],
    ],
    [
      [0, 4, 50],
      [8, 4, 50],
      [16, 4, 50],
      [24, 4, 45],
    ],
    [
      [0, 4, 48],
      [8, 4, 45],
      [12, 4, 46],
      [16, 4, 47],
      [24, 4, 40],
    ],
  ],
  [
    [0, 64],
    [0, 96],
    [1, 128],
    [2, 160],
    [0, 192],
    [0, 224],
  ],
];

// Track channel: 9
// Track instrument: Acoustic Bass Drum
const track9_AcousticBassDrum: PackedTrack = [
  [
    [[0, 32, 35]],
    [
      [0, 4, 35],
      [16, 4, 35],
    ],
    [
      [0, 4, 35],
      [12, 4, 35],
      [16, 8, 35],
      [24, 8, 35],
    ],
  ],
  [
    [0, 0],
    [1, 64],
    [1, 96],
    [1, 128],
    [2, 160],
    [1, 192],
    [1, 224],
  ],
];

// Track channel: 9
// Track instrument: Acoustic Snare
const track9_AcousticSnare: PackedTrack = [
  [
    [
      [8, 4, 38],
      [24, 4, 38],
    ],
  ],
  [
    [0, 64],
    [0, 96],
    [0, 128],
    [0, 192],
    [0, 224],
  ],
];

// Track channel: 9
// Track instrument: Closed Hi Hat
const track9_ClosedHiHat: PackedTrack = [
  [
    [
      [0, 4, 42],
      [4, 4, 42],
      [8, 4, 42],
      [12, 4, 42],
      [16, 4, 42],
      [20, 4, 42],
      [24, 4, 42],
      [28, 4, 42],
    ],
  ],
  [
    [0, 64],
    [0, 96],
    [0, 128],
    [0, 192],
    [0, 224],
  ],
];

// Track channel: 9
// Track instrument: Hi Mid Tom
const track9_HiMidTom: PackedTrack = [
  [
    [
      [4, 3, 48],
      [7, 1, 48],
      [8, 3, 48],
      [11, 1, 48],
    ],
  ],
  [[0, 160]],
];

const tracks = [
  track0_AcousticGrandPiano,
  track2_AcousticGrandPiano,
  track4_AcousticGrandPiano,
  track6_AcousticGrandPiano,
  track8_AcousticGrandPiano,
  track9_AcousticBassDrum,
  track9_AcousticSnare,
  track9_ClosedHiHat,
  track9_HiMidTom,
];

const instruments: Instrument[] = [
  theramin,
  bass,
  kalimba,
  synthLead,
  synthLead,
  // synthLead, // track11_AcousticGrandPiano
  kick,
  snare,
  closedHiHat,
  // openHiHat, // track9_OpenHiHat
  hiMidTom,
];

export const titleMusic = new Sound(unpackSong(tracks, instruments, 0.053));
