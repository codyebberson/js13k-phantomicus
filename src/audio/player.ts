import { sleep, symmetricRandom, unitRandom } from '../utils';

export type MinimalNote = [
  number, // baseFrequency
  number, // start
  number, // duration
];

export type ExtendedNote = [
  ...MinimalNote,
  number, // volume
  number, // glide
];

export type Note = MinimalNote | ExtendedNote;

export type FrequencyFunction = (x: number, t: number) => number;

export type OscillatorFunction = (t: number) => number;

export type MinimalInstrument = [
  FrequencyFunction, // frequency
  OscillatorFunction, // oscillator
  number, // attack
  number, // decay
  number, // sustain
  number, // release
];

export type FilteredInstrument = [
  ...MinimalInstrument,
  number, // filter
  FrequencyFunction, // filterFreq
  FrequencyFunction, // filterRes
];

export type MultiVoiceInstrument = [
  ...FilteredInstrument,
  number, // unison
  number, // detune
];

export type Instrument = MinimalInstrument | FilteredInstrument | MultiVoiceInstrument;

export type Sequence = [Instrument, Note[]];

export type SoundDefinition = {
  0: Sequence[];
  1?: number; // duration
  2?: boolean; // loop
  3?: boolean; // reverb
};

export interface Voice {
  ratio: number;
  frequency: number;
  phi: number;
  pan: number;
}

export type AudioGeneratorCallback = (progress: number) => void;

/** No filter. */
export const FILTER_NONE = 0;

/** High pass filter. */
export const FILTER_HIPASS = 1;

/** Low pass filter. */
export const FILTER_LOPASS = 2;

/** Bandpass filter. */
export const FILTER_BANDPASS = 3;

/** Notch filter. */
export const FILTER_NOTCH = 4;

/** Global audio context. */
export const audioCtx = new AudioContext();

/** Global sample rate. */
export const SAMPLE_RATE = audioCtx.sampleRate;

/** Master gain node. */
export const masterGainNode = audioCtx.createGain();
masterGainNode.connect(audioCtx.destination);
masterGainNode.gain.value = 0.8;

export const createAudioBuffer = (duration: number): AudioBuffer => {
  const samples = duration * SAMPLE_RATE;
  return audioCtx.createBuffer(2, samples, SAMPLE_RATE);
};

export const getAudioBufferData = (audioBuffer: AudioBuffer): Float32Array[] => {
  return [audioBuffer.getChannelData(0), audioBuffer.getChannelData(1)];
};

const reverbDuration = 2.0;
const impulse = createAudioBuffer(reverbDuration);
const [impulseL, impulseR] = getAudioBufferData(impulse);
const reverbLength = impulseL.length;
const decay = 5;
for (let i = 0; i < reverbLength; i++) {
  impulseL[i] = 0.25 * symmetricRandom() * (1 - i / reverbLength) ** decay;
  impulseR[i] = 0.25 * symmetricRandom() * (1 - i / reverbLength) ** decay;
}

/** Reverb convolver. */
const reverbConvolver = audioCtx.createConvolver();
reverbConvolver.buffer = impulse;
reverbConvolver.connect(masterGainNode);

/**
 * Returns a sin wave with input phase from 0 to 1.
 * @param t The time in phase from 0 to 1.
 * @returns The sin output from -1 to 1.
 */
export const sint: OscillatorFunction = (t: number): number => Math.sin(2 * Math.PI * t);

/**
 * Returns a square wave with input phase from 0 to 1.
 * @param t The time in phase from 0 to 1.
 * @returns The square output from -1 to 1.
 */
export const square: OscillatorFunction = (t: number): number => (t % 1.0 < 0.5 ? 1 : -1);

/**
 * Returns a sawtooth wave with input phase from 0 to 1.
 * @param t The time in phase from 0 to 1.
 * @returns The sawtooth output from -1 to 1.
 */
export const sawtooth: OscillatorFunction = (t: number): number => 2 * (t % 1) - 1;

/**
 * Returns a triangle wave with input phase from 0 to 1.
 * @param t The time in phase from 0 to 1.
 * @returns The triangle output from -1 to 1.
 */
export const triangle: OscillatorFunction = (t: number): number => Math.abs(4 * (t % 1) - 2) - 1;

/**
 * Returns a white noise sample.
 * @returns The white noise output from -1 to 1.
 */
export const whiteNoise = (): number => symmetricRandom();

/**
 * Returns the ADSR envelope amplitude for the current time t.
 *
 * ADSR envelope has four stages:
 *   1) Attack is the time taken for initial run-up of level from nil to peak, beginning when the key is pressed.
 *   2) Decay is the time taken for the subsequent run down from the attack level to the designated sustain level.
 *   3) Sustain is the level during the main sequence of the sound's duration, until the key is released.
 *   4) Release is the time taken for the level to decay from the sustain level to zero after the key is released.
 *
 *          Attack    Decay Sustain    Release
 *          [--------][----][---------][-----]
 *     max |-----------\
 *   A     |            \
 *   m     |             \
 *   p     |              \
 *   l     |               \-----------\
 *   i     |                            \
 *   t     |                             \
 *   u     |                              \
 *   d     |                               \
 *   e   0 +----------------------------------> time
 *
 * While attack, decay, and release refer to time, sustain refers to level.
 *
 * Since we are operating on predetermined notes, we use "duration" rather than key press and key release.
 *
 * From t=0 to t=a (attack period), the volume increases from 0.0 to 1.0.
 * From t=a to t=d (decay period), the volume decreases from 1.0 to s (sustain).
 * From t=d to t=du (sustain period), the volume stays constant at s (sustain).
 * From t=du to t=du+r (release period), the volume decreases from s (sustain) to 0.0.
 * After that, the volume is 0.0.
 *
 * See more: https://en.wikipedia.org/wiki/Envelope_(music)
 *
 * @param a Attack
 * @param d Decay
 * @param s Sustain
 * @param r Release
 * @param du Duration
 * @param t Current time
 */
const envelope = (a: number, d: number, s: number, r: number, du: number, t: number): number =>
  t < a // From t=0 to t=a (attack period)
    ? t / a // the volume increases from 0.0 to 1.0
    : t < a + d // From t=a to t=d (decay period)
      ? 1.0 - ((t - a) / d) * (1 - s) // the volume decreases from 1.0 to s (sustain)
      : t < du // From t=d to t=du (sustain period)
        ? s // the volume stays constant at s (sustain)
        : t < du + r // From t=du to t=du+r (release period)
          ? (1.0 - (t - du) / r) * s // release
          : 0.0; // After that, the volume is 0.0.

/**
 * Returns the frequency of a MIDI note.
 * @param note - The MIDI note number.
 * @returns The frequency of the note.
 */
export const getFreq = (note: number): number => 440 * 2 ** ((note - 69) / 12);

/**
 * Creates a new voice state.
 * @param ratio The ratio of this voice to the primary voice. 1.0 is the primary voice.
 * @param firstMidi The initial MIDI note number.
 * @returns Voice state.
 */
const createVoice = (ratio: number, pan = 0.5): Voice => ({
  ratio,
  pan,
  frequency: 0,
  phi: unitRandom(),
});

/**
 * Adds a note to the output audio buffer.
 * @param data The output audio buffer.
 * @param instr The instrument definition.
 * @param voice The voice state.
 * @param start The start time.
 * @param duration The note duration.
 * @param baseFrequency The base frequency of the note.
 * @param volume Optional volume.
 * @param glide Optional glide.
 */
const addNote = (
  data: Float32Array[],
  instr: Instrument,
  voice: Voice,
  start: number,
  duration: number,
  baseFrequency: number,
  volume: number,
  glide = 0
): void => {
  const [frequencyFunc, oscillatorFunc, attack, decay, sustain, release, filter, filterFreqFunc, filterResFunc] = instr;
  const end = ((start + duration + release) * SAMPLE_RATE) | 0;
  let i = (start * SAMPLE_RATE) | 0;
  let low = 0;
  let band = 0;
  const glideRate = 1 / ((glide / 20) * SAMPLE_RATE + 1);

  while (i < end) {
    const t = Math.max(0, i / SAMPLE_RATE - start);
    const targetFreq = frequencyFunc(baseFrequency, t) * voice.ratio;

    // If this is the first note, then set the frequency directly
    voice.frequency = voice.frequency || targetFreq;

    // Glide the frequency
    voice.frequency = glideRate * targetFreq + (1 - glideRate) * voice.frequency;
    voice.phi += voice.frequency / SAMPLE_RATE;

    let sample = oscillatorFunc(voice.phi /* % 1 */);

    if (filterFreqFunc && filterResFunc) {
      const filterFreq = filterFreqFunc(baseFrequency, t);
      const filterRes = filterResFunc(baseFrequency, t);
      const f = 1.5 * Math.sin((filterFreq * Math.PI) / SAMPLE_RATE);
      low += f * band;
      const high = filterRes * (sample - band) - low;
      band += f * high;
      switch (filter) {
        case FILTER_HIPASS:
          sample = high;
          break;
        case FILTER_LOPASS:
          sample = low;
          break;
        case FILTER_BANDPASS:
          sample = band;
          break;
        case FILTER_NOTCH:
          sample = low + high;
          break;
      }
    }

    sample *= envelope(attack, decay, sustain, release, duration, t);
    data[0][i] += Math.sin((voice.pan * Math.PI) / 2) * volume * sample;
    data[1][i] += Math.cos((voice.pan * Math.PI) / 2) * volume * sample;
    i++;
  }
};

// This is super janky last minute hack for a unified progress bar
// Before we showed a progress bar per sound, but that looked weird
// The total notes count here was determined by running the game
// So now we have a single global counter and single progress bar
// This number does not need to be accurate, it's just for the progress bar
const totalNotes = 600;
let currentNote = 0;

const generateAudioBuffer = async (
  soundDefinition: SoundDefinition,
  callback?: AudioGeneratorCallback
): Promise<AudioBuffer> => {
  const sequences = soundDefinition[0];
  const duration = soundDefinition[1];

  // First pass to determine the end time and total notes
  let endTime = duration ?? 0;
  for (const sequence of sequences) {
    const instrument = sequence[0];
    const notes = sequence[1];
    for (const note of notes) {
      const start = note[1];
      const duration = note[2];
      const release = instrument[5];
      endTime = Math.max(endTime, start + duration + release);
    }
  }

  // And now the second pass to generate the audio buffer
  const audioBuffer = createAudioBuffer(endTime);
  const data = getAudioBufferData(audioBuffer);
  for (const sequence of sequences) {
    const instrument = sequence[0];
    const notes = sequence[1];
    const unison = (instrument as MultiVoiceInstrument)[9] ?? 1;
    const detune = (instrument as MultiVoiceInstrument)[10] ?? 0;
    const volume = 1 / unison;
    const voices = [createVoice(1)];
    for (let i = 1; i < unison / 2; i++) {
      voices.push(createVoice(1 + i * detune, unitRandom()));
      voices.push(createVoice(1 / (1 + i * detune), unitRandom()));
    }
    for (const [baseFrequency, start, duration, glide] of notes) {
      addVoicedNote(data, instrument, voices, start, duration, baseFrequency, volume, glide);
      currentNote++;
      if (currentNote % 50 === 0) {
        if (callback) {
          callback(currentNote / totalNotes);
        }
        await sleep();
      }
    }
  }
  soundDefinition[1] = endTime;
  return audioBuffer;
};

const addVoicedNote = (
  data: Float32Array[],
  instr: Instrument,
  voices: Voice[],
  start: number,
  duration: number,
  midi: number,
  volume: number,
  glide: number | undefined
): void => {
  for (const voice of voices) {
    addNote(data, instr, voice, start, duration, midi, volume, glide);
  }
};

const createSourceNode = (audioBuffer: AudioBuffer, loop?: boolean): AudioBufferSourceNode => {
  const source = audioCtx.createBufferSource();
  source.buffer = audioBuffer;
  source.loop = !!loop;
  return source;
};

const createGainNode = (source: AudioBufferSourceNode): GainNode => {
  const gainNode = audioCtx.createGain();
  source.connect(gainNode);
  return gainNode;
};

const connectNode = (source: AudioBufferSourceNode | GainNode, reverb?: boolean): void => {
  source.connect(masterGainNode);
  if (reverb) {
    source.connect(reverbConvolver);
  }
};

export class Sound {
  readonly definition: SoundDefinition;
  audioBuffer?: AudioBuffer;
  source?: AudioBufferSourceNode;
  gainNode?: GainNode;
  playing?: boolean;

  constructor(definition: SoundDefinition) {
    this.definition = definition;
  }

  async init(callback: AudioGeneratorCallback): Promise<void> {
    this.audioBuffer = await generateAudioBuffer(this.definition, callback);
  }

  playOnce(): void {
    const source = createSourceNode(this.audioBuffer as AudioBuffer);
    connectNode(source);
    source.start();
  }

  startPlaying(): void {
    if (this.playing) {
      return;
    }

    this.source = createSourceNode(this.audioBuffer as AudioBuffer, this.definition[2]);
    this.gainNode = createGainNode(this.source);
    connectNode(this.gainNode, true);
    this.source.start();
    this.playing = true;
  }

  stopPlaying(): void {
    if (this.source) {
      this.source.stop(this.source.context.currentTime + 0.1);
      this.source = undefined;
    }

    if (this.gainNode) {
      this.gainNode.gain.linearRampToValueAtTime(0, this.gainNode.context.currentTime + 0.1);
      this.gainNode = undefined;
    }

    this.playing = false;
  }

  togglePlaying(): void {
    if (this.playing) {
      this.stopPlaying();
    } else {
      this.startPlaying();
    }
  }
}
