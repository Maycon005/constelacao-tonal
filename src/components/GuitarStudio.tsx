import { useMemo, useState } from "react";
import {
  TUNING,
  chordCatalog,
  chordVoicings,
  pentatonic,
  pentatonicBox,
} from "../lib/guitar";
import { pcToNote } from "../lib/music";
import { playNote, playMidiNotes } from "../lib/audio";
import type { ModalContext } from "../types/music";

export function GuitarStudio({
  context,
  catalog = false,
}: {
  context: ModalContext;
  catalog?: boolean;
}) {
  const [kind, setKind] = useState<"scale" | "major" | "minor">("scale");
  const [box, setBox] = useState(-1);
  const [degrees, setDegrees] = useState(false);
  const [region, setRegion] = useState(-1);
  const [selected, setSelected] = useState("");
  const [shapeIndex, setShapeIndex] = useState(0);
  const [heard, setHeard] = useState(
    "Clique numa nota para ouvir e localizar sua altura.",
  );
  const chords = useMemo(
    () => chordCatalog(context.collectionPcs),
    [context.collectionPcs.join(",")],
  );
  const chord = chords.find((c) => c.symbol === selected) ?? chords[0];
  const shapes = useMemo(() => chordVoicings(chord), [chord.symbol]);
  const activeShape = shapeIndex % Math.max(1, shapes.length);
  const shape = shapes[activeShape];
  const pcs =
    kind === "scale" ? context.collectionPcs : pentatonic(context.tonic, kind);
  const pattern =
    kind !== "scale" && box >= 0
      ? pentatonicBox(context.tonic, kind, box)
      : null;
  const compatible = pcs.every((pc) => context.collectionPcs.includes(pc));
  const firstFret = pattern
    ? Math.max(0, Math.min(...pattern.flat()) - 1)
    : region >= 0
      ? region
      : 0;
  const lastFret = pattern
    ? Math.max(...pattern.flat()) + 1
    : region >= 0
      ? region + 4
      : 15;
  const hear = (midi: number) => {
    const name = pcToNote(midi);
    setHeard(`${name} · oitava ${Math.floor(midi / 12) - 1}`);
    void playNote(name, Math.floor(midi / 12) - 1).catch(() =>
      setHeard("Áudio indisponível. Tente novamente."),
    );
  };
  return (
    <section className="instrument-studio">
      <div className="studio-heading">
        <div>
          <p className="panel-label">
            {catalog ? "Biblioteca harmônica" : "Atlas do braço"} / afinação E A
            D G B E
          </p>
          <h1>
            {catalog
              ? "Acordes que pertencem à escala."
              : "Um braço. Muitos caminhos."}
          </h1>
          <p>
            {context.tonic} {context.mode.name} ·{" "}
            {context.modeNotes.join(" · ")}
          </p>
        </div>
        <span className="studio-tag">
          {catalog ? `${chords.length} cifras compatíveis` : "Toque para ouvir"}
        </span>
      </div>
      {catalog ? (
        <div className="chord-workspace">
          <div>
            <p className="studio-help">
              Catálogo de 20 tipos: tríades, suspensos, quintas, sextas, sétimas
              e nonas. Só entram acordes com todas as notas na coleção. Não
              abrange toda combinação musical possível.
            </p>
            <div className="chord-picker">
              {chords.map((c) => (
                <button
                  aria-pressed={chord.symbol === c.symbol}
                  key={c.symbol}
                  onClick={() => {
                    setSelected(c.symbol);
                    setShapeIndex(0);
                  }}
                >
                  {c.symbol}
                </button>
              ))}
            </div>
          </div>
          <div className="voicing-card">
            <h2>{chord.symbol}</h2>
            <p>{chord.pcs.map(pcToNote).join(" · ")}</p>
            {shape ? (
              <>
                <svg
                  viewBox="0 0 240 245"
                  role="img"
                  aria-label={`${chord.symbol}, cordas graves para agudas: ${shape.map((f) => (f < 0 ? "abafada" : f)).join(", ")}`}
                >
                  {(() => {
                    const base = Math.max(
                      1,
                      Math.min(...shape.filter((f) => f > 0)),
                    );
                    return (
                      <>
                        {Array.from({ length: 6 }, (_, i) => (
                          <line
                            key={"s" + i}
                            x1={45 + i * 30}
                            x2={45 + i * 30}
                            y1="55"
                            y2="215"
                            stroke="#657583"
                          />
                        ))}
                        {Array.from({ length: 5 }, (_, i) => (
                          <line
                            key={"f" + i}
                            x1="45"
                            x2="195"
                            y1={55 + i * 40}
                            y2={55 + i * 40}
                            stroke="#657583"
                            strokeWidth={i === 0 && base === 1 ? 4 : 1}
                          />
                        ))}
                        <text x="8" y="82" fill="#cbd5e1" fontSize="12">
                          {base}ª
                        </text>
                        {shape.map((f, i) => (
                          <g key={i}>
                            <text
                              x={45 + i * 30}
                              y="35"
                              textAnchor="middle"
                              fill="#e2e8f0"
                            >
                              {f < 0 ? "×" : f === 0 ? "○" : ""}
                            </text>
                            {f > 0 && (
                              <>
                                <circle
                                  cx={45 + i * 30}
                                  cy={75 + (f - base) * 40}
                                  r="12"
                                  fill="#7ee0c3"
                                />
                                <text
                                  x={45 + i * 30}
                                  y={80 + (f - base) * 40}
                                  textAnchor="middle"
                                  fontSize="12"
                                  fill="#08131c"
                                >
                                  {f}
                                </text>
                              </>
                            )}
                            <text
                              x={45 + i * 30}
                              y="240"
                              textAnchor="middle"
                              fill="#94a3b8"
                              fontSize="11"
                            >
                              {pcToNote(TUNING[i])}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
                <p className="studio-help">
                  Números = casas, não dedos. × não tocar · ○ solta. Posições
                  calculadas; conforto e dedilhado dependem da sua mão. O baixo
                  pode ser uma inversão.
                </p>
                <label>
                  Posição {activeShape + 1} / {shapes.length}
                  <input
                    aria-label="Posição do acorde"
                    type="range"
                    min="0"
                    max={shapes.length - 1}
                    value={activeShape}
                    onChange={(e) => setShapeIndex(+e.target.value)}
                  />
                </label>
                <button
                  className="soft-button"
                  onClick={() => {
                    void playMidiNotes(
                      shape.flatMap((f, i) => (f < 0 ? [] : [TUNING[i] + f])),
                    ).catch(() => setHeard("Áudio indisponível"));
                  }}
                >
                  Ouvir acorde
                </button>
              </>
            ) : (
              <p>
                Nenhuma posição encontrada no limite de quatro casas e quatro
                cordas pressionadas.
              </p>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="studio-controls">
            {(["scale", "major", "minor"] as const).map((k) => (
              <button
                key={k}
                aria-pressed={kind === k}
                onClick={() => {
                  setKind(k);
                  setBox(-1);
                }}
              >
                {k === "scale"
                  ? "Escala completa"
                  : k === "major"
                    ? "Pentatônica maior"
                    : "Pentatônica menor"}
              </button>
            ))}
            <button aria-pressed={degrees} onClick={() => setDegrees(!degrees)}>
              {degrees ? "Mostrar notas" : "Mostrar intervalos"}
            </button>
          </div>
          {!compatible && (
            <p className="compatibility-note">
              Esta pentatônica tem notas fora do modo atual. Ela está sendo
              comparada, não apresentada como subconjunto da escala.
            </p>
          )}
          {kind !== "scale" && (
            <div className="studio-controls">
              <button aria-pressed={box === -1} onClick={() => setBox(-1)}>
                Braço inteiro
              </button>
              {[0, 1, 2, 3, 4].map((b) => (
                <button
                  key={b}
                  aria-pressed={box === b}
                  onClick={() => setBox(b)}
                >
                  Desenho {b + 1}
                </button>
              ))}
            </div>
          )}
          {kind === "scale" && (
            <div className="studio-controls">
              <button
                aria-pressed={region === -1}
                onClick={() => setRegion(-1)}
              >
                Braço inteiro
              </button>
              <label className="region-control">
                Janela de cinco casas:{" "}
                {region < 0 ? "todas" : `${region} a ${region + 4}`}
                <input
                  aria-label="Região do braço"
                  type="range"
                  min="0"
                  max="11"
                  value={Math.max(0, region)}
                  onChange={(e) => setRegion(+e.target.value)}
                />
              </label>
            </div>
          )}{" "}
          <p className="studio-help">
            Corda aguda em cima, grave embaixo. Verde = tônica. Cada casa sobe
            um semitom; a casa 12 repete a nota uma oitava acima. Desenhos
            numerados a partir da pentatônica menor relativa.
          </p>
          <div className="fretboard-scroll">
            <div
              className="fretboard"
              style={{
                gridTemplateColumns: `48px repeat(${lastFret - firstFret + 1}, minmax(48px,1fr))`,
              }}
            >
              <span />
              {Array.from({ length: lastFret - firstFret + 1 }, (_, i) => (
                <span className="fret-number" key={i}>
                  {firstFret + i === 0 ? "Solta" : firstFret + i}
                </span>
              ))}
              {[5, 4, 3, 2, 1, 0].map((s) => (
                <div className="string-row" key={s}>
                  <span className="string-label">
                    {6 - s} · {pcToNote(TUNING[s])}
                  </span>
                  {Array.from({ length: lastFret - firstFret + 1 }, (_, i) => {
                    const fret = firstFret + i;
                    const pc = (TUNING[s] + fret) % 12;
                    const active =
                      pcs.includes(pc) &&
                      (!pattern || pattern[s].includes(fret));
                    const interval = context.degrees.find(
                      (d) => d.note === pcToNote(pc),
                    );
                    return (
                      <button
                        key={fret}
                        className={`fret-cell ${active ? "in-scale" : ""} ${active && pc === context.tonicPc ? "root-note" : ""}`}
                        aria-label={`Corda ${6 - s}, casa ${fret}, ${pcToNote(pc)}${active ? ", na seleção" : ""}`}
                        onClick={() => hear(TUNING[s] + fret)}
                      >
                        <span>
                          {active
                            ? degrees
                              ? (interval?.degreeLabel ??
                                `${(pc - context.tonicPc + 12) % 12} st`)
                              : pcToNote(pc)
                            : "·"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
          <p aria-live="polite" className="heard-note">
            {heard}
          </p>
        </>
      )}
    </section>
  );
}
