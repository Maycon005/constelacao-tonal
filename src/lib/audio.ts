import type { HarmonicChord, ModalContext, ProgressionPlayback } from "../types/music";
import { midiFromNote } from "./music";

let audioContext: AudioContext | null = null;

function getAudioContext() {
  if (!audioContext) {
    audioContext = new window.AudioContext();
  }
  return audioContext;
}

function midiToFrequency(midi: number) {
  return 440 * Math.pow(2, (midi - 69) / 12);
}

function createVoice(ctx: AudioContext, frequency: number, when: number, duration: number, gainValue: number) {
  const oscA = ctx.createOscillator();
  const oscB = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  oscA.type = "triangle";
  oscB.type = "sine";
  oscA.frequency.setValueAtTime(frequency, when);
  oscB.frequency.setValueAtTime(frequency * 0.5, when);
  oscA.detune.setValueAtTime(-2, when);
  oscB.detune.setValueAtTime(2, when);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1400, when);
  filter.frequency.exponentialRampToValueAtTime(1900, when + duration * 0.35);
  filter.Q.value = 0.9;

  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(gainValue, when + 0.06);
  gain.gain.exponentialRampToValueAtTime(gainValue * 0.72, when + duration * 0.55);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  oscA.connect(filter);
  oscB.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  oscA.start(when);
  oscB.start(when);
  oscA.stop(when + duration + 0.05);
  oscB.stop(when + duration + 0.05);
}

export async function ensureAudioReady() {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  return ctx;
}

export async function playNote(note: string, octave = 4, duration = 1.0) {
  const ctx = await ensureAudioReady();
  const now = ctx.currentTime + 0.02;
  createVoice(ctx, midiToFrequency(midiFromNote(note, octave)), now, duration, 0.05);
  createVoice(ctx, midiToFrequency(midiFromNote(note, octave + 1)), now, duration * 0.8, 0.025);
}

export async function playChord(chord: HarmonicChord, duration = 1.55) {
  const ctx = await ensureAudioReady();
  const now = ctx.currentTime + 0.02;

  chord.notes.forEach((note, index) => {
    createVoice(ctx, midiToFrequency(midiFromNote(note, index === 0 ? 3 : 4)), now + index * 0.015, duration, 0.045);
  });
}

export async function playModeSweep(context: ModalContext) {
  const ctx = await ensureAudioReady();
  const now = ctx.currentTime + 0.02;

  createVoice(ctx, midiToFrequency(midiFromNote(context.tonic, 3)), now, 2, 0.04);

  context.modeNotes.forEach((note, index) => {
    createVoice(ctx, midiToFrequency(midiFromNote(note, 4 + (index > 4 ? 1 : 0))), now + index * 0.2, 0.44, 0.026);
  });
}

export async function playProgression(progress: ProgressionPlayback) {
  const ctx = await ensureAudioReady();
  const start = ctx.currentTime + 0.02;

  progress.chords.forEach((chord, index) => {
    const when = start + index * 0.72;
    chord.notes.forEach((note, noteIndex) => {
      createVoice(
        ctx,
        midiToFrequency(midiFromNote(note, noteIndex === 0 ? 3 : 4)),
        when + noteIndex * 0.012,
        0.7,
        0.038
      );
    });
  });
}
