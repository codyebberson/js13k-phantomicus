# audio

This is a heavily modified version of [sonant-x](https://github.com/nicolas-van/sonant-x), probably beyond the point of recognition. The original library was created by [Nicolas Vanhoren](https://github.com/nicolas-van).

Key changes:

- Changed fixed oscillators to instrument-specified oscillators
- Changed all data types to fixed-length arrays
- Use `Float32Array` and floats rather than `Uint8Array` and integers
- Added unison and detune to oscillators for richer sound
