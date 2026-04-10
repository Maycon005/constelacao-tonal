import { motion } from "framer-motion";
import { functionColor } from "../lib/music";
import type { HarmonicChord, ModalContext } from "../types/music";

interface InfoPanelProps {
  context: ModalContext;
  pinnedNote: string | null;
  hoveredChord: HarmonicChord | null;
  onChordHover: (chord: HarmonicChord | null) => void;
}

export function InfoPanel({ context, pinnedNote, hoveredChord, onChordHover }: InfoPanelProps) {
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
          <h2 className="text-2xl font-semibold text-white">
            {context.tonic} {context.mode.name}
          </h2>
          <p className="mt-2 text-sm text-slate-300">{context.mode.microcopy}</p>
        </section>

        <section className="grid grid-cols-2 gap-2 text-sm">
          <div className="data-chip">
            <div className="panel-label mb-1">Família</div>
            <div>{context.family.name}</div>
          </div>
          <div className="data-chip">
            <div className="panel-label mb-1">Escala-mãe</div>
            <div>
              {context.motherRoot} {context.family.modes[0].name}
            </div>
          </div>
          <div className="data-chip">
            <div className="panel-label mb-1">Fórmula</div>
            <div>{context.formula}</div>
          </div>
          <div className="data-chip">
            <div className="panel-label mb-1">Acorde característico</div>
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
                  {degree.degreeLabel} · {degree.intervalName}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
          <div className="panel-label mb-2">Coleção compartilhada</div>
          <div className="text-sm text-slate-100">{context.collectionNotes.join(" - ")}</div>
          <div className="mt-2 text-sm text-slate-300">
            A geometria permanece. O centro tonal muda para {context.tonic}.
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
          <div className="panel-label mb-2">Campo harmônico em tríades</div>
          <div className="flex flex-wrap gap-2">
            {context.triads.map((chord) => (
              <button
                key={`${chord.numeral}-${chord.symbol}-triad`}
                className="soft-button text-left text-xs"
                onMouseEnter={() => onChordHover(chord)}
                onMouseLeave={() => onChordHover(null)}
              >
                {chord.numeral} · {chord.symbol}
              </button>
            ))}
          </div>

          <div className="panel-label mb-2 mt-4">Campo harmônico em tétrades</div>
          <div className="flex flex-wrap gap-2">
            {context.tetrads.map((chord) => (
              <button
                key={`${chord.numeral}-${chord.symbol}-tetrad`}
                className="soft-button text-left text-xs"
                onMouseEnter={() => onChordHover(chord)}
                onMouseLeave={() => onChordHover(null)}
              >
                {chord.numeral} · {chord.symbol}
              </button>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-3 text-xs text-slate-300">
            {hoveredChord ? (
              <>
                <div className="font-medium text-cyan-100">{hoveredChord.symbol}</div>
                <div className="mt-1">Notas: {hoveredChord.notes.join(" - ")}</div>
                <div className="mt-1">Função: {hoveredChord.functionLabel}</div>
              </>
            ) : (
              "Passe o cursor sobre um acorde para ver formação e função."
            )}
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
          <div className="panel-label mb-2">Progressões sugeridas</div>
          <div className="space-y-2 text-sm text-slate-200">
            {context.progressions.map((progression) => (
              <div key={progression} className="rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2">
                {progression}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
          <div className="panel-label mb-2">Leitura didática</div>
          <div className="space-y-2 text-sm text-slate-300">
            <p>Mesma coleção, novo centro tonal.</p>
            <p>A nova tônica redefine a função de cada grau.</p>
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
