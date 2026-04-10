import type { HarmonicChord, ModalContext } from "../types/music";
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
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  oscillator.type = "sawtooth";
  oscillator.frequency.setValueAtTime(frequency, when);
  oscillator.detune.setValueAtTime(-4 + Math.random() * 8, when);

  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2200, when);
  filter.Q.value = 2;

  gain.gain.setValueAtTime(0.0001, when);
  gain.gain.exponentialRampToValueAtTime(gainValue, when + 0.03);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, gainValue * 0.6), when + duration * 0.45);
  gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  oscillator.start(when);
  oscillator.stop(when + duration + 0.02);
}

export async function ensureAudioReady() {
  const ctx = getAudioContext();
  if (ctx.state === "suspended") {
    await ctx.resume();
  }
  return ctx;
}

export async function playNote(note: string, octave = 4, duration = 0.9) {
  const ctx = await ensureAudioReady();
  const now = ctx.currentTime + 0.02;
  createVoice(ctx, midiToFrequency(midiFromNote(note, octave)), now, duration, 0.08);
  createVoice(ctx, midiToFrequency(midiFromNote(note, octave + 1)), now, duration * 0.85, 0.04);
}

export async function playChord(chord: HarmonicChord, duration = 1.35) {
  const ctx = await ensureAudioReady();
  const now = ctx.currentTime + 0.02;

  chord.notes.forEach((note, index) => {
    createVoice(ctx, midiToFrequency(midiFromNote(note, index === 0 ? 3 : 4)), now + index * 0.01, duration, 0.06);
  });
}

export async function playModeSweep(context: ModalContext) {
  const ctx = await ensureAudioReady();
  const now = ctx.currentTime + 0.02;

  context.modeNotes.forEach((note, index) => {
    createVoice(ctx, midiToFrequency(midiFromNote(note, 4 + (index > 4 ? 1 : 0))), now + index * 0.18, 0.28, 0.045);
  });

  createVoice(ctx, midiToFrequency(midiFromNote(context.tonic, 3)), now, 1.65, 0.06);
}
