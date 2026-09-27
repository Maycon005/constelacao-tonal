import { useState } from "react";
import { NOTES } from "../data/modalFamilies";
import { buildModalContext, selectionFromRelativeIndex } from "../lib/music";
import {
  playModeSweep,
  playNote,
  playChord,
  playMidiNotes,
} from "../lib/audio";
import type { SelectionState } from "../types/music";
const experiments = [
  {
    title: "Medir o som",
    action: "Deslize a distância e ouça duas notas.",
    body: "Semitom é a distância entre casas vizinhas no violão. Um tom são duas casas. A oitava chega depois de 12 semitons.",
  },
  {
    title: "Mover o desenho",
    action: "Mude a tônica e acompanhe os espaços.",
    body: "Transpor é mover todas as notas pela mesma distância. O desenho de tons e semitons da escala maior não muda.",
  },
  {
    title: "Mudar a casa",
    action: "Mantenha as notas; desloque o repouso.",
    body: "Os mesmos sons ganham funções diferentes. A nota grave sustentada ajuda a ouvir o novo centro. Apenas começar a escala em outra nota não basta para estabelecer um modo.",
  },
  {
    title: "Construir acordes",
    action: "Empilhe uma nota sim, outra não.",
    body: "Uma tríade reúne os graus 1, 3 e 5. Adicionar o grau 7 forma uma tétrade. Veja a seleção acontecer antes de ouvir o conjunto.",
  },
];
export function StudyStudio({
  onExplore,
}: {
  onExplore: (s: SelectionState) => void;
}) {
  const [scene, setScene] = useState(0);
  const [distance, setDistance] = useState(7);
  const [root, setRoot] = useState(0);
  const [mode, setMode] = useState(0);
  const [layers, setLayers] = useState(3);
  const [message, setMessage] = useState("");
  const base: SelectionState = {
    family: "major",
    tonic: NOTES[root],
    modeIndex: 0,
  };
  const selection = scene === 2 ? selectionFromRelativeIndex(base, mode) : base;
  const context = buildModalContext(selection);
  const play = (job: Promise<unknown>) => {
    void job.catch(() => setMessage("Toque novamente para iniciar o áudio."));
  };
  const chosen = [0, 2, 4, 6].slice(0, layers);
  return (
    <section className="instrument-studio discovery-studio">
      <div className="studio-heading">
        <div>
          <p className="panel-label">Descobrir / um gesto, uma transformação</p>
          <h1>A teoria acontece na sua mão.</h1>
          <p>
            Explore relações. Escute diferenças. Leve a descoberta para o
            instrumento.
          </p>
        </div>
      </div>
      <nav className="discovery-nav" aria-label="Experimentos">
        {experiments.map((e, i) => (
          <button
            key={e.title}
            aria-pressed={scene === i}
            onClick={() => {
              setScene(i);
              setMessage("");
            }}
          >
            <small>0{i + 1}</small>
            {e.title}
          </button>
        ))}
      </nav>
      <div className="discovery-layout">
        <div className="discovery-copy">
          <p className="panel-label">Experimente agora</p>
          <h2>{experiments[scene].action}</h2>
          <p>{experiments[scene].body}</p>
          <div className="live-insight" aria-live="polite">
            {scene === 0
              ? `${distance} semitons = ${distance === 12 ? "uma oitava" : distance === 2 ? "um tom" : distance === 1 ? "um semitom" : `${distance / 2} tons`}. No violão, são ${distance} casas.`
              : scene === 1
                ? "Os espaços 2 · 2 · 1 · 2 · 2 · 2 · 1 permanecem. Os nomes das notas mudam."
                : scene === 2
                  ? `A coleção continua ${context.collectionNotes.join(" · ")}. Agora ${context.tonic} é casa.`
                  : `Selecionadas: ${chosen.map((i) => context.modeNotes[i]).join(" · ")}. ${layers === 3 ? "Três notas, uma tríade." : "Quatro notas, uma tétrade."}`}
          </div>
          <p className="studio-help">
            C D E F G A B = Dó Ré Mi Fá Sol Lá Si. # significa um semitom acima.
          </p>
        </div>
        <div className="experiment-surface">
          {scene === 0 ? (
            <>
              <div className="interval-rail">
                {Array.from({ length: 13 }, (_, i) => (
                  <button
                    key={i}
                    className={
                      i === 0 || i === distance
                        ? "rail-selected"
                        : i < distance
                          ? "rail-between"
                          : ""
                    }
                    onClick={() => {
                      setDistance(i);
                      play(playNote(NOTES[i % 12], i === 12 ? 4 : 3));
                    }}
                  >
                    <strong>{NOTES[i % 12]}</strong>
                    <small>{i}</small>
                  </button>
                ))}
              </div>
              <label>
                Distância a partir de C
                <input
                  aria-label="Distância em semitons"
                  type="range"
                  min="0"
                  max="12"
                  value={distance}
                  onChange={(e) => setDistance(+e.target.value)}
                />
              </label>
              <button
                className="soft-button"
                onClick={() => play(playMidiNotes([48, 48 + distance]))}
              >
                Ouvir as duas notas
              </button>
            </>
          ) : (
            <>
              <div className="scale-steps">
                {context.modeNotes.map((note, i) => (
                  <button
                    key={note}
                    className={
                      (scene === 3 ? chosen.includes(i) : i === 0)
                        ? "step-active"
                        : ""
                    }
                    onClick={() => play(playNote(note, 3))}
                  >
                    <small>
                      {scene === 3
                        ? `grau ${i + 1}`
                        : i === 0
                          ? "repouso"
                          : `grau ${i + 1}`}
                    </small>
                    <strong>{note}</strong>
                    <span>{context.intervalNames[i]}</span>
                  </button>
                ))}
              </div>
              {scene !== 3 && (
                <div className="distance-ribbon">
                  {context.modeSemitones.map((n, i) => (
                    <span
                      style={{ flex: (context.modeSemitones[i + 1] ?? 12) - n }}
                      key={i}
                    >
                      {(context.modeSemitones[i + 1] ?? 12) - n} st
                    </span>
                  ))}
                </div>
              )}
              {scene === 1 && (
                <label>
                  Transpor: {NOTES[root]}
                  <input
                    aria-label="Transpor experimento"
                    type="range"
                    min="0"
                    max="11"
                    value={root}
                    onChange={(e) => setRoot(+e.target.value)}
                  />
                </label>
              )}
              {scene === 2 && (
                <label>
                  Centro: {context.tonic} {context.mode.name}
                  <input
                    aria-label="Centro do experimento"
                    type="range"
                    min="0"
                    max="6"
                    value={mode}
                    onChange={(e) => setMode(+e.target.value)}
                  />
                </label>
              )}
              {scene === 3 && (
                <label>
                  Empilhar: {layers === 3 ? "tríade" : "tétrade"}
                  <input
                    aria-label="Quantidade de notas do acorde"
                    type="range"
                    min="3"
                    max="4"
                    value={layers}
                    onChange={(e) => setLayers(+e.target.value)}
                  />
                </label>
              )}
              <div className="studio-controls">
                <button
                  onClick={() =>
                    play(
                      scene === 3
                        ? playChord(
                            layers === 3
                              ? context.triads[0]
                              : context.tetrads[0],
                          )
                        : playModeSweep(context),
                    )
                  }
                >
                  Ouvir a construção
                </button>
                <button onClick={() => onExplore(selection)}>
                  Explorar na roda →
                </button>
              </div>
            </>
          )}
          <p role="status">{message}</p>
        </div>
      </div>
    </section>
  );
}
