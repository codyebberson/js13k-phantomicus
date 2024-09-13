import { Instrument, Note, Sequence, SoundDefinition, getFreq } from '../player';

export type PackedNote = [
  /** start time */
  number,
  /** duration */
  number,
  /** MIDI note */
  number,
];

export type PackedPattern = PackedNote[];

export type PackedPatternInstance = [number, number];

export type PackedTrack = [PackedPattern[], PackedPatternInstance[]];

export const unpackSong = (tracks: PackedTrack[], instruments: Instrument[], tickDuration: number): SoundDefinition => {
  const sequences: Sequence[] = [];
  for (let i = 0; i < tracks.length; i++) {
    const notes: Note[] = [];
    const patterns = tracks[i][0];
    const patternInstances = tracks[i][1];
    for (let j = 0; j < patternInstances.length; j++) {
      const patternInstance = patternInstances[j];
      const pattern = patterns[patternInstance[0]];
      for (const note of pattern) {
        notes.push([getFreq(note[2]), (patternInstance[1] + note[0]) * tickDuration, note[1] * tickDuration]);
      }
    }
    sequences.push([instruments[i], notes]);
  }
  return [sequences, undefined, true];
};
