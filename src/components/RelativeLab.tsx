import { motion } from "framer-motion";
import { collectionModeSelections, featuredPairSelection } from "../lib/music";
import type { ModalContext, SelectionState } from "../types/music";

interface RelativeLabProps {
  context: ModalContext;
  selection: SelectionState;
  compareSelection: SelectionState;
  onSelectionChange: (next: SelectionState) => void;
  onCompareSelectionChange: (next: SelectionState) => void;
  onPlaySelection: (selection: SelectionState) => void;
}

export function RelativeLab({
  context,
  selection,
  compareSelection,
  onSelectionChange,
  onCompareSelectionChange,
  onPlaySelection
}: RelativeLabProps) {
  const relatives = collectionModeSelections(selection);
  const featuredPair = featuredPairSelection(selection);

  return (
    <section className="glass-panel rounded-[28px] p-4 md:p-5">
      <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <div>
            <p className="panel-label mb-2">Laboratorio de Relativos</p>
            <h3 className="text-xl font-semibold text-white">Mesma colecao, sete hierarquias possiveis</h3>
            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Arraste os sliders para reapontar a tonica sem mudar as notas. A geometria continua; a funcao e a progressao mudam.
            </p>
          </div>

          <div className="rounded-[24px] border border-cyan-400/15 bg-cyan-400/5 p-4">
            <div className="panel-label mb-1">Modo A pela mesma colecao</div>
            <div className="mb-3 text-sm text-slate-300">
              Percorra os 7 modos da colecao {context.collectionNotes.join(" - ")}.
            </div>
            <input
              className="w-full"
              type="range"
              min={0}
              max={6}
              step={1}
              value={selection.modeIndex}
              onChange={(event) => onSelectionChange(relatives[Number(event.target.value)])}
            />
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Atual: {selection.tonic} {context.mode.name}</span>
              <button className="soft-button px-3 py-1 text-xs" onClick={() => onPlaySelection(selection)}>
                Ouvir modo A
              </button>
            </div>
          </div>

          <div className="rounded-[24px] border border-fuchsia-400/15 bg-fuchsia-400/5 p-4">
            <div className="panel-label mb-1">Modo B pela mesma colecao</div>
            <div className="mb-3 text-sm text-slate-300">
              Controle a comparacao pela mesma colecao para enxergar o deslocamento da gravidade tonal.
            </div>
            <input
              className="w-full"
              type="range"
              min={0}
              max={6}
              step={1}
              value={compareSelection.modeIndex}
              onChange={(event) => onCompareSelectionChange(relatives[Number(event.target.value)])}
            />
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
              <span>Comparando: {compareSelection.tonic}</span>
              <button className="soft-button px-3 py-1 text-xs" onClick={() => onPlaySelection(compareSelection)}>
                Ouvir modo B
              </button>
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
            <div className="panel-label mb-1">Atalho didatico</div>
            <div className="text-sm text-slate-300">
              Par de destaque nesta colecao:{" "}
              <button
                className="font-medium text-cyan-200 underline decoration-cyan-400/40 underline-offset-4"
                onClick={() => onSelectionChange(featuredPair)}
              >
                {featuredPair.tonic} {context.family.modes[featuredPair.modeIndex].name}
              </button>
            </div>
            <div className="mt-2 text-xs text-slate-400">
              O alvo destacado busca o contraste pedagogico mais forte dentro da mesma colecao.
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {relatives.map((relative, index) => {
            const mode = context.family.modes[index];
            const active = relative.tonic === selection.tonic && relative.modeIndex === selection.modeIndex;
            return (
              <motion.button
                key={`${relative.tonic}-${relative.modeIndex}`}
                whileHover={{ y: -3 }}
                className={`rounded-[24px] border p-4 text-left transition ${
                  active
                    ? "border-cyan-400/60 bg-cyan-400/8 shadow-neon"
                    : "border-white/10 bg-slate-950/45 hover:border-cyan-400/35"
                }`}
                onClick={() => onSelectionChange(relative)}
              >
                <div className="panel-label mb-2">Modo {index + 1}</div>
                <div className="text-lg font-semibold text-white">
                  {relative.tonic} {mode.name}
                </div>
                <div className="mt-2 text-sm text-slate-300">{mode.mood}</div>
                <div className="mt-3 text-xs text-slate-400">Caracteristico: {mode.characteristic}</div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
