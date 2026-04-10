import { sameCollection } from "../lib/music";
import type { ModalContext, SelectionState } from "../types/music";
import { FAMILIES, NOTES } from "../data/modalFamilies";

interface ComparisonPanelProps {
  left: ModalContext;
  right: ModalContext;
  selection: SelectionState;
  compareSelection: SelectionState;
  onCompareSelectionChange: (next: SelectionState) => void;
}

export function ComparisonPanel({
  left,
  right,
  selection,
  compareSelection,
  onCompareSelectionChange
}: ComparisonPanelProps) {
  const shared = sameCollection(left, right);
  const compareModes = FAMILIES[compareSelection.family].modes;

  return (
    <section className="glass-panel rounded-[28px] p-4 md:p-5">
      <div className="flex flex-col gap-4">
        <div>
          <p className="panel-label mb-2">Modo Comparacao</p>
          <div className="rounded-[24px] border border-cyan-400/20 bg-cyan-400/5 p-4 text-sm text-slate-200">
            {shared
              ? "Mesma colecao detectada: a forma permanece, mas a hierarquia muda."
              : "Colecoes diferentes: aqui a propria geometria ja muda junto com a gravidade tonal."}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <select
            className="soft-input"
            value={compareSelection.family}
            onChange={(event) =>
              onCompareSelectionChange({
                family: event.target.value as SelectionState["family"],
                tonic: compareSelection.tonic,
                modeIndex: 0
              })
            }
          >
            {Object.values(FAMILIES).map((family) => (
              <option key={family.id} value={family.id}>
                {family.name}
              </option>
            ))}
          </select>

          <select
            className="soft-input"
            value={compareSelection.tonic}
            onChange={(event) =>
              onCompareSelectionChange({
                ...compareSelection,
                tonic: event.target.value
              })
            }
          >
            {NOTES.map((note) => (
              <option key={note} value={note}>
                {note}
              </option>
            ))}
          </select>

          <select
            className="soft-input"
            value={compareSelection.modeIndex}
            onChange={(event) =>
              onCompareSelectionChange({
                ...compareSelection,
                modeIndex: Number(event.target.value)
              })
            }
          >
            {compareModes.map((mode, index) => (
              <option key={mode.name} value={index}>
                {index + 1}. {mode.name}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-[24px] border border-fuchsia-400/15 bg-fuchsia-400/5 p-4">
          <div className="panel-label mb-1">Slider rapido do modo B</div>
          <input
            className="w-full accent-fuchsia-400"
            type="range"
            min={0}
            max={6}
            step={1}
            value={compareSelection.modeIndex}
            onChange={(event) =>
              onCompareSelectionChange({
                ...compareSelection,
                modeIndex: Number(event.target.value)
              })
            }
          />
          <div className="mt-2 text-xs text-slate-400">
            Arraste para reapontar o centro tonal do modo B rapidamente.
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {[{ title: "Modo A", context: left, tonic: selection.tonic }, { title: "Modo B", context: right, tonic: compareSelection.tonic }].map(
            ({ title, context, tonic }) => (
              <div key={title} className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4">
                <div className="panel-label mb-2">{title}</div>
                <div className="text-lg font-semibold text-white">
                  {tonic} {context.mode.name}
                </div>
                <div className="mt-2 text-sm text-slate-300">Intervalos: {context.intervalLabels.join(" - ")}</div>
                <div className="mt-2 text-sm text-slate-300">Grau caracteristico: {context.mode.characteristic}</div>
                <div className="mt-2 text-sm text-slate-300">Sensacao: {context.mode.mood}</div>
                <div className="mt-2 text-sm text-slate-300">Centro de repouso: {context.tonic}</div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
