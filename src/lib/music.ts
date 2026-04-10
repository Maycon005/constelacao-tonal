import { FAMILIES, FUNCTION_COLORS, NOTES } from "../data/modalFamilies";
import type {
  DegreeInfo,
  FamilyId,
  FunctionKind,
  HarmonicChord,
  ModalContext,
  SelectionState
} from "../types/music";

const MAJOR_REFERENCE = [0, 2, 4, 5, 7, 9, 11];
const DEGREE_NAMES = ["1", "2", "3", "4", "5", "6", "7"];

const mod = (value: number, divisor: number) => ((value % divisor) + divisor) % divisor;

export const noteToPc = (note: string) => NOTES.indexOf(note);
export const pcToNote = (pc: number) => NOTES[mod(pc, 12)];

function rotate<T>(items: T[], index: number) {
  return items.slice(index).concat(items.slice(0, index));
}

function modeSemitones(basePattern: number[], modeIndex: number) {
  const origin = basePattern[modeIndex];
  return rotate(basePattern, modeIndex).map((step) => mod(step - origin, 12));
}

function degreeLabel(semitone: number, degreeIndex: number) {
  const base = MAJOR_REFERENCE[degreeIndex];
  let diff = mod(semitone - base, 12);
  if (diff > 6) diff -= 12;
  const accidental =
    diff === 0 ? "" : diff === -1 ? "b" : diff === 1 ? "#" : diff === -2 ? "bb" : diff === 2 ? "##" : "";
  return `${accidental}${DEGREE_NAMES[degreeIndex]}`;
}

function intervalName(semitone: number) {
  const table: Record<number, string> = {
    0: "unissono",
    1: "2m",
    2: "2M",
    3: "3m",
    4: "3M",
    5: "4J",
    6: "tritono",
    7: "5J",
    8: "6m",
    9: "6M",
    10: "7m",
    11: "7M"
  };
  return table[semitone];
}

function chordQualityTriad(intervals: number[]) {
  const signature = intervals.join(",");
  const table: Record<string, string> = {
    "0,4,7": "",
    "0,3,7": "m",
    "0,3,6": "dim",
    "0,4,8": "aug",
    "0,2,7": "sus2",
    "0,5,7": "sus4"
  };
  return table[signature] ?? "?";
}

function chordQualityTetrad(intervals: number[]) {
  const signature = intervals.join(",");
  const table: Record<string, string> = {
    "0,4,7,11": "maj7",
    "0,4,7,10": "7",
    "0,3,7,10": "m7",
    "0,3,6,10": "m7b5",
    "0,3,6,9": "dim7",
    "0,3,7,11": "m(maj7)",
    "0,4,8,11": "maj7#5",
    "0,4,8,10": "7#5",
    "0,4,6,10": "7b5",
    "0,4,6,11": "maj7b5"
  };
  return table[signature] ?? "?";
}

function numeralLabel(degree: number) {
  return ["I", "II", "III", "IV", "V", "VI", "VII"][degree];
}

function functionOfDegree(index: number, label: string): FunctionKind {
  if (index === 0) return "rest";
  if (label.includes("b2") || label.includes("#4") || label.includes("b5") || label.includes("bb7")) return "unstable";
  if (label.includes("7") || label.includes("b6") || label.includes("#5") || label.includes("#2")) return "tension";
  if (index === 2 || index === 5) return "color";
  return "stable";
}

function chordFunction(index: number) {
  if (index === 0) return "centro";
  if (index === 4) return "dominante";
  if (index === 1 || index === 3) return "pre-dominante";
  return "cor modal";
}

function characteristicDegrees(modeCharacteristic: string) {
  return modeCharacteristic
    .replace(/\s/g, "")
    .split("/")
    .filter(Boolean);
}

function buildHarmonicField(modeNotes: string[], modeSteps: number[], size: 3 | 4): HarmonicChord[] {
  return modeNotes.map((root, index) => {
    const pickedIndexes = size === 3 ? [0, 2, 4] : [0, 2, 4, 6];
    const noteIndexes = pickedIndexes.map((offset) => (index + offset) % 7);
    const notes = noteIndexes.map((noteIndex) => modeNotes[noteIndex]);
    const intervals = pickedIndexes
      .map((offset) => mod(modeSteps[(index + offset) % 7] - modeSteps[index], 12))
      .sort((a, b) => a - b);

    const quality = size === 3 ? chordQualityTriad(intervals) : chordQualityTetrad(intervals);
    return {
      numeral: numeralLabel(index),
      symbol: quality === "" ? root : `${root}${quality}`,
      root,
      notes,
      quality,
      functionLabel: chordFunction(index)
    };
  });
}

export function collectionForSelection(selection: SelectionState) {
  const family = FAMILIES[selection.family];
  const tonicPc = noteToPc(selection.tonic);
  const motherRootPc = mod(tonicPc - family.basePattern[selection.modeIndex], 12);
  const collectionPcs = family.basePattern.map((step) => mod(motherRootPc + step, 12));
  return {
    family,
    tonicPc,
    motherRootPc,
    collectionPcs,
    collectionNotes: collectionPcs.map(pcToNote)
  };
}

export function buildModalContext(selection: SelectionState): ModalContext {
  const family = FAMILIES[selection.family];
  const tonicPc = noteToPc(selection.tonic);
  const mode = family.modes[selection.modeIndex];
  const { motherRootPc, collectionPcs, collectionNotes } = collectionForSelection(selection);
  const relativeSteps = modeSemitones(family.basePattern, selection.modeIndex);
  const modeNotes = relativeSteps.map((step) => pcToNote(tonicPc + step));
  const intervalLabels = relativeSteps.map((step, index) => degreeLabel(step, index));
  const intervalNames = relativeSteps.map(intervalName);
  const characteristic = characteristicDegrees(mode.characteristic);

  const degrees: DegreeInfo[] = modeNotes.map((note, index) => ({
    note,
    degree: index + 1,
    degreeLabel: intervalLabels[index],
    intervalName: intervalNames[index],
    functionKind: functionOfDegree(index, intervalLabels[index]),
    semitone: relativeSteps[index]
  }));

  return {
    family,
    mode,
    tonic: selection.tonic,
    tonicPc,
    motherRoot: pcToNote(motherRootPc),
    motherRootPc,
    modeIndex: selection.modeIndex,
    collectionPcs,
    collectionNotes,
    modeNotes,
    modeSemitones: relativeSteps,
    intervalLabels,
    intervalNames,
    formula: intervalLabels.join(" - "),
    degrees,
    characteristicDegrees: characteristic,
    triads: buildHarmonicField(modeNotes, relativeSteps, 3),
    tetrads: buildHarmonicField(modeNotes, relativeSteps, 4),
    progressions: family.progressionMap[selection.modeIndex] ?? [],
    relativeMajor: pcToNote(motherRootPc),
    relativeMinor: pcToNote(collectionPcs[5])
  };
}

export function sameCollection(a: ModalContext, b: ModalContext) {
  return a.family.id === b.family.id && a.collectionNotes.join(",") === b.collectionNotes.join(",");
}

export function nextRelativeSelection(selection: SelectionState): SelectionState {
  const context = buildModalContext(selection);
  const nextModeIndex = (selection.modeIndex + 1) % 7;
  return {
    ...selection,
    modeIndex: nextModeIndex,
    tonic: context.collectionNotes[nextModeIndex]
  };
}

export function selectionFromRelativeIndex(selection: SelectionState, nextModeIndex: number): SelectionState {
  const context = buildModalContext(selection);
  return {
    ...selection,
    modeIndex: nextModeIndex,
    tonic: context.collectionNotes[nextModeIndex]
  };
}

export function functionColor(kind: FunctionKind) {
  return FUNCTION_COLORS[kind];
}

export function familyList(): { id: FamilyId; label: string }[] {
  return (Object.keys(FAMILIES) as FamilyId[]).map((id) => ({ id, label: FAMILIES[id].name }));
}

export function collectionModeSelections(selection: SelectionState): SelectionState[] {
  const collection = collectionForSelection(selection).collectionNotes;
  return collection.map((tonic, modeIndex) => ({
    family: selection.family,
    tonic,
    modeIndex
  }));
}

export function relativeMinorSelection(selection: SelectionState): SelectionState {
  const family = FAMILIES[selection.family];
  const collection = collectionForSelection(selection).collectionNotes;
  const targetModeIndex = family.id === "major" ? 5 : 0;
  return {
    family: selection.family,
    tonic: collection[targetModeIndex],
    modeIndex: targetModeIndex
  };
}

export function midiFromNote(note: string, octave = 4) {
  return 12 * (octave + 1) + noteToPc(note);
}
