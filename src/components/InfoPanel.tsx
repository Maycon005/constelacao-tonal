import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { functionColor } from "../lib/music";
import type { HarmonicChord, ModalContext } from "../types/music";

interface InfoPanelProps {
  context: ModalContext;
  pinnedNote: string | null;
  hoveredChord: HarmonicChord | null;
  onChordHover: (chord: HarmonicChord | null) => void;
  onChordPlay: (chord: HarmonicChord) => void;
  onModePlay: () => void;
}

export function InfoPanel({
  context,
  pinnedNote,
  hoveredChord,
  onChordHover,
  onChordPlay,
  onModePlay
}: InfoPanelProps) {
  const pinnedDegree = pinnedNote ? context.degrees.find((degree) => degree.note === pinnedNote) : null;

  return (
    <aside className="glass-panel rounded-[28px] p-4 md:p-5">
      <motion.div
        key={`${context.tonic}-${context.mode.name}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="space-y-4"
      >
        <section>
          <p className="panel-label mb-1">Modo Atual</p>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {context.tonic} {context.mode.name}
              </h2>
              <p className="mt-2 text-sm text-slate-300">{context.mode.microcopy}</p>
            </div>
            <button className="soft-button flex items-center gap-2 px-3 py-2 text-xs" onClick={onModePlay}>
              <Play size={14} />
              Ouvir
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-2 text-sm">
          <div className="data-chip">
            <div className="panel-label mb-1">Familia</div>
            <div>{context.family.name}</div>
          </div>
          <div className="data-chip">
            <div className="panel-label mb-1">Escala-mae</div>
            <div>
              {context.motherRoot} {context.family.modes[0].name}
            </div>
          </div>
          <div className="data-chip">
            <div className="panel-label mb-1">Formula</div>
            <div>{context.formula}</div>
          </div>
          <div className="data-chip">
            <div className="panel-label mb-1">Acorde caracteristico</div>
            <div>
              {context.tonic}
              {context.mode.chordColor}
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
          <div className="panel-label mb-2">Camada funcional</div>
          <div className="grid gap-2 md:grid-cols-2">
            {context.degrees.map((degree) => (
              <div
                key={`${degree.note}-${degree.degree}`}
                className="rounded-2xl border px-3 py-2 text-xs"
                style={{
                  borderColor: `${functionColor(degree.functionKind)}55`,
                  backgroundColor: `${functionColor(degree.functionKind)}12`
                }}
              >
                <div className="font-medium text-white">{degree.note}</div>
                <div className="text-slate-300">
                  {degree.degreeLabel} - {degree.intervalName}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
          <div className="panel-label mb-2">Colecao compartilhada</div>
          <div className="text-sm text-slate-100">{context.collectionNotes.join(" - ")}</div>
          <div className="mt-2 text-sm text-slate-300">
            A geometria permanece. O centro tonal muda para {context.tonic}.
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
          <div className="panel-label mb-2">Campo harmonico em triades</div>
          <div className="flex flex-wrap gap-2">
            {context.triads.map((chord) => (
              <button
                key={`${chord.numeral}-${chord.symbol}-triad`}
                className="soft-button flex items-center gap-2 text-left text-xs"
                onMouseEnter={() => onChordHover(chord)}
                onMouseLeave={() => onChordHover(null)}
                onClick={() => onChordPlay(chord)}
              >
                <Play size={12} />
                {chord.numeral} - {chord.symbol}
              </button>
            ))}
          </div>

          <div className="panel-label mb-2 mt-4">Campo harmonico em tetrades</div>
          <div className="flex flex-wrap gap-2">
            {context.tetrads.map((chord) => (
              <button
                key={`${chord.numeral}-${chord.symbol}-tetrad`}
                className="soft-button flex items-center gap-2 text-left text-xs"
                onMouseEnter={() => onChordHover(chord)}
                onMouseLeave={() => onChordHover(null)}
                onClick={() => onChordPlay(chord)}
              >
                <Play size={12} />
                {chord.numeral} - {chord.symbol}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-3 text-xs text-slate-300">
            {hoveredChord ? (
              <>
                <div className="font-medium text-cyan-100">{hoveredChord.symbol}</div>
                <div className="mt-1">Notas: {hoveredChord.notes.join(" - ")}</div>
                <div className="mt-1">Funcao: {hoveredChord.functionLabel}</div>
              </>
            ) : (
              "Passe o cursor ou clique num acorde para ver e ouvir sua formacao."
            )}
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
          <div className="panel-label mb-2">Progressoes sugeridas</div>
          <div className="space-y-2 text-sm text-slate-200">
            {context.progressions.map((progression) => (
              <div key={progression} className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
                {progression}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
          <div className="panel-label mb-2">Leitura didatica</div>
          <div className="space-y-2 text-sm text-slate-300">
            <p>Mesma colecao, novo centro tonal.</p>
            <p>A nova tonica redefine a funcao de cada grau.</p>
            <p>A cor modal nasce da nova gravidade.</p>
            <p>
              {pinnedDegree
                ? `${pinnedDegree.note} agora funciona como ${pinnedDegree.degreeLabel} (${pinnedDegree.intervalName}).`
                : "Clique numa nota para congelar o seu papel dentro do modo atual."}
            </p>
          </div>
        </section>
      </motion.div>
    </aside>
  );
}
