export type FamilyId = "major" | "harmonicMinor" | "melodicMinor";

export type ViewId =
  | "orbit"
  | "constellation"
  | "gravity"
  | "function"
  | "harmony";

export type FunctionKind = "rest" | "stable" | "color" | "tension" | "unstable";

export interface ModeDescriptor {
  name: string;
  shortName: string;
  mood: string;
  characteristic: string;
  chordColor: string;
  microcopy: string;
}

export interface FamilyDefinition {
  id: FamilyId;
  name: string;
  signature: string;
  accent: string;
  background: string;
  basePattern: number[];
  modes: ModeDescriptor[];
  progressionMap: Record<number, string[]>;
}

export interface DegreeInfo {
  note: string;
  degree: number;
  degreeLabel: string;
  intervalName: string;
  functionKind: FunctionKind;
  semitone: number;
}

export interface HarmonicChord {
  numeral: string;
  symbol: string;
  root: string;
  notes: string[];
  quality: string;
  functionLabel: string;
}

export interface ModalContext {
  family: FamilyDefinition;
  mode: ModeDescriptor;
  tonic: string;
  tonicPc: number;
  motherRoot: string;
  motherRootPc: number;
  modeIndex: number;
  collectionPcs: number[];
  collectionNotes: string[];
  modeNotes: string[];
  modeSemitones: number[];
  intervalLabels: string[];
  intervalNames: string[];
  formula: string;
  degrees: DegreeInfo[];
  characteristicDegrees: string[];
  triads: HarmonicChord[];
  tetrads: HarmonicChord[];
  progressions: string[];
  relativeMajor: string;
  relativeMinor: string;
}

export interface SelectionState {
  family: FamilyId;
  tonic: string;
  modeIndex: number;
}

export interface TooltipState {
  x: number;
  y: number;
  title: string;
  lines: string[];
}
