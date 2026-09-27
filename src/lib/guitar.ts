import { noteToPc, pcToNote } from "./music";
export const TUNING = [40, 45, 50, 55, 59, 64]; // Low E to high E, standard tuning.
export const CHORD_TYPES = [
  ["", [0, 4, 7]],
  ["m", [0, 3, 7]],
  ["dim", [0, 3, 6]],
  ["aug", [0, 4, 8]],
  ["sus2", [0, 2, 7]],
  ["sus4", [0, 5, 7]],
  ["5", [0, 7]],
  ["6", [0, 4, 7, 9]],
  ["m6", [0, 3, 7, 9]],
  ["7", [0, 4, 7, 10]],
  ["maj7", [0, 4, 7, 11]],
  ["m7", [0, 3, 7, 10]],
  ["m(maj7)", [0, 3, 7, 11]],
  ["m7b5", [0, 3, 6, 10]],
  ["dim7", [0, 3, 6, 9]],
  ["add9", [0, 2, 4, 7]],
  ["madd9", [0, 2, 3, 7]],
  ["9", [0, 2, 4, 7, 10]],
  ["maj9", [0, 2, 4, 7, 11]],
  ["m9", [0, 2, 3, 7, 10]],
] as const;
export interface GuitarChord {
  symbol: string;
  pcs: number[];
  root: number;
}
export function chordCatalog(collection: number[]): GuitarChord[] {
  return collection.flatMap((root) =>
    CHORD_TYPES.flatMap(([quality, intervals]) => {
      const pcs = intervals.map((i) => (root + i) % 12);
      return pcs.every((pc) => collection.includes(pc))
        ? [{ symbol: pcToNote(root) + quality, pcs, root }]
        : [];
    }),
  );
}
// Bounded voicings: contiguous sounding strings, all chord tones, <=4 frets, <=4 stopped strings.
export function chordVoicings(chord: GuitarChord): number[][] {
  const found = new Map<string, number[]>();
  for (let start = 0; start <= 12; start++)
    for (let low = 0; low < 4; low++)
      for (let high = low + 2; high < 6; high++) {
        const options = TUNING.map((open) =>
          Array.from({ length: 4 }, (_, i) => start + i).filter(
            (f) => f <= 15 && chord.pcs.includes((open + f) % 12),
          ),
        );
        const visit = (string: number, frets: number[]) => {
          if (string > high) {
            const pcs = frets.flatMap((f, i) =>
              f < 0 ? [] : [(TUNING[i] + f) % 12],
            );
            if (
              chord.pcs.every((pc) => pcs.includes(pc)) &&
              frets.filter((f) => f > 0).length <= 4
            )
              found.set(frets.join(","), frets);
            return;
          }
          for (const fret of options[string]) {
            const next = [...frets];
            next[string] = fret;
            visit(string + 1, next);
          }
        };
        visit(low, Array(6).fill(-1));
      }
  const rank = (shape: number[]) => {
    const bass = shape.findIndex((f) => f >= 0);
    const inversion = (TUNING[bass] + shape[bass]) % 12 !== chord.root;
    return (
      (inversion ? 30 : 0) +
      Math.max(...shape) * 3 -
      shape.filter((f) => f >= 0).length * 2
    );
  };
  return [...found.values()].sort((a, b) => rank(a) - rank(b)).slice(0, 40);
}
export function pentatonic(tonic: string, kind: "major" | "minor") {
  return (kind === "major" ? [0, 2, 4, 7, 9] : [0, 3, 5, 7, 10]).map(
    (i) => (noteToPc(tonic) + i) % 12,
  );
}
export function pentatonicBox(
  tonic: string,
  kind: "major" | "minor",
  box: number,
): number[][] {
  const minorRoot = (noteToPc(tonic) + (kind === "major" ? 9 : 0)) % 12;
  const anchor = (minorRoot - 4 + 12) % 12;
  const shapes = [
    [
      [0, 3],
      [0, 2],
      [0, 2],
      [0, 2],
      [0, 3],
      [0, 3],
    ],
    [
      [3, 5],
      [2, 5],
      [2, 5],
      [2, 4],
      [3, 5],
      [3, 5],
    ],
    [
      [5, 7],
      [5, 7],
      [5, 7],
      [4, 7],
      [5, 8],
      [5, 7],
    ],
    [
      [7, 10],
      [7, 10],
      [7, 9],
      [7, 9],
      [8, 10],
      [7, 10],
    ],
    [
      [10, 12],
      [10, 12],
      [9, 12],
      [9, 12],
      [10, 12],
      [10, 12],
    ],
  ];
  const shape = shapes[box].map((row) => row.map((f) => f + anchor));
  const shift = Math.min(...shape.flat()) >= 12 ? 12 : 0;
  return shape.map((row) => row.map((f) => f - shift));
}
