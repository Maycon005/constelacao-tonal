import { build } from "esbuild";
import assert from "node:assert/strict";

const bundle = await build({
  entryPoints: ["src/lib/music.ts"],
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
});
const music = await import(
  `data:text/javascript;base64,${Buffer.from(bundle.outputFiles[0].text).toString("base64")}`
);
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let cases = 0;
for (const family of ["major", "harmonicMinor", "melodicMinor"]) {
  for (const tonic of notes)
    for (let modeIndex = 0; modeIndex < 7; modeIndex++) {
      const selection = { family, tonic, modeIndex };
      const context = music.buildModalContext(selection);
      assert.equal(new Set(context.modeNotes).size, 7);
      assert.equal(context.modeNotes[0], tonic);
      assert.ok(
        context.modeSemitones.every(
          (value, index, values) => index === 0 || value > values[index - 1],
        ),
      );
      for (let relative = 0; relative < 7; relative++)
        assert.ok(
          music.sameCollection(
            context,
            music.buildModalContext(
              music.selectionFromRelativeIndex(selection, relative),
            ),
          ),
        );
      assert.ok(
        music.sameCollection(
          context,
          music.buildModalContext(music.featuredPairSelection(selection)),
        ),
      );
      for (const chord of [...context.triads, ...context.tetrads]) {
        assert.ok(!chord.symbol.includes("?"), chord.symbol);
        assert.ok(
          chord.notes.every((note) => context.modeNotes.includes(note)),
        );
      }
      for (const progression of context.progressions) {
        const played = music.progressionPlayback(context, progression);
        assert.equal(played.chords.length, 4);
        assert.equal(
          progression,
          played.chords
            .map((chord) => chord.numeral + chord.quality)
            .join(" - "),
        );
      }
      cases++;
    }
}
assert.deepEqual(
  music.featuredPairSelection({ family: "major", tonic: "A", modeIndex: 5 }),
  { family: "major", tonic: "C", modeIndex: 0 },
);
assert.deepEqual(
  music.selectionFromRelativeIndex(
    { family: "major", tonic: "C", modeIndex: 0 },
    1,
  ),
  { family: "major", tonic: "D", modeIndex: 1 },
);
console.log(
  `PASS: ${cases} contexts, all relative rotations, chord membership and written/audio progression consistency.`,
);
const guitarBundle = await build({
  entryPoints: ["src/lib/guitar.ts"],
  bundle: true,
  write: false,
  platform: "node",
  format: "esm",
});
const guitar = await import(
  `data:text/javascript;base64,${Buffer.from(guitarBundle.outputFiles[0].text).toString("base64")}`
);
for (const tonic of notes)
  for (const kind of ["major", "minor"]) {
    const pcs = guitar.pentatonic(tonic, kind);
    for (let box = 0; box < 5; box++) {
      const shape = guitar.pentatonicBox(tonic, kind, box);
      shape.forEach((row, string) =>
        row.forEach((fret) =>
          assert.ok(
            pcs.includes((guitar.TUNING[string] + fret) % 12),
            `${tonic} ${kind} box ${box}`,
          ),
        ),
      );
    }
  }
for (const tonic of notes) {
  const context = music.buildModalContext({
    family: "major",
    tonic,
    modeIndex: 0,
  });
  for (const chord of guitar.chordCatalog(context.collectionPcs)) {
    assert.ok(chord.pcs.every((pc) => context.collectionPcs.includes(pc)));
    for (const shape of guitar.chordVoicings(chord)) {
      const played = shape.flatMap((f, i) =>
        f < 0 ? [] : [(guitar.TUNING[i] + f) % 12],
      );
      assert.ok(chord.pcs.every((pc) => played.includes(pc)));
      assert.ok(played.every((pc) => chord.pcs.includes(pc)));
      assert.ok(shape.filter((f) => f > 0).length <= 4);
    }
  }
}
console.log(
  "PASS: 120 pentatonic boxes and all generated voicings in 12 major collections.",
);
