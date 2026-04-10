import { Sparkles, Telescope, Waves, RotateCcw, SplitSquareVertical } from "lucide-react";
import { FAMILIES, NOTES, VIEW_OPTIONS } from "../data/modalFamilies";
import type { FamilyId, SelectionState, ViewId } from "../types/music";

interface ControlBarProps {
  selection: SelectionState;
  onSelectionChange: (next: SelectionState) => void;
  view: ViewId;
  onViewChange: (view: ViewId) => void;
  animations: boolean;
  onToggleAnimations: () => void;
  compare: boolean;
  onToggleCompare: () => void;
  autoplay: boolean;
  onToggleAutoplay: () => void;
  highlightCharacteristic: boolean;
  onToggleCharacteristic: () => void;
  onReset: () => void;
  onRelativeModeSlide: (modeIndex: number) => void;
}

export function ControlBar({
  selection,
  onSelectionChange,
  view,
  onViewChange,
  animations,
  onToggleAnimations,
  compare,
  onToggleCompare,
  autoplay,
  onToggleAutoplay,
  highlightCharacteristic,
  onToggleCharacteristic,
  onReset,
  onRelativeModeSlide
}: ControlBarProps) {
  const familyModes = FAMILIES[selection.family].modes;

  return (
    <header className="glass-panel rounded-[28px] px-4 py-4 md:px-6 md:py-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <p className="panel-label mb-2">Constelação Tonal</p>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-4xl">
              Mesma coleção, novo sol.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 md:text-base">
              Veja a geometria permanecer enquanto a tônica redefine repouso, função e cor modal.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 md:grid-cols-4">
            <div className="data-chip">Hover nas notas revela grau, intervalo e função.</div>
            <div className="data-chip">Autoplay desliza a gravidade tonal pela mesma coleção.</div>
            <div className="data-chip">Comparação mostra o que permanece e o que muda.</div>
            <div className="data-chip">Produto usa apenas sustenidos para consistência visual.</div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <label className="flex flex-col gap-1">
            <span className="panel-label">Família</span>
            <select
              className="soft-input"
              value={selection.family}
              onChange={(event) =>
                onSelectionChange({
                  family: event.target.value as FamilyId,
                  tonic: selection.tonic,
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
          </label>

          <label className="flex flex-col gap-1">
            <span className="panel-label">Tônica</span>
            <select
              className="soft-input"
              value={selection.tonic}
              onChange={(event) => onSelectionChange({ ...selection, tonic: event.target.value })}
            >
              {NOTES.map((note) => (
                <option key={note} value={note}>
                  {note}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="panel-label">Modo</span>
            <select
              className="soft-input"
              value={selection.modeIndex}
              onChange={(event) =>
                onSelectionChange({ ...selection, modeIndex: Number(event.target.value) })
              }
            >
              {familyModes.map((mode, index) => (
                <option key={mode.name} value={index}>
                  {index + 1}. {mode.name}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2">
            <span className="panel-label">Percurso Relativo</span>
            <input
              type="range"
              min={0}
              max={6}
              step={1}
              value={selection.modeIndex}
              onChange={(event) => onRelativeModeSlide(Number(event.target.value))}
            />
          </label>

          <button className="soft-button flex items-center justify-center gap-2" onClick={onToggleAutoplay}>
            <Sparkles size={16} />
            {autoplay ? "Autoplay ativo" : "Autoplay modal"}
          </button>

          <button className="soft-button flex items-center justify-center gap-2" onClick={onToggleAnimations}>
            <Waves size={16} />
            {animations ? "Animações on" : "Animações off"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {VIEW_OPTIONS.map((option) => (
            <button
              key={option.id}
              className={`soft-button ${view === option.id ? "border-cyan-400/70 text-white shadow-neon" : ""}`}
              onClick={() => onViewChange(option.id as ViewId)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className={`soft-button flex items-center gap-2 ${compare ? "border-cyan-400/70 text-white" : ""}`}
            onClick={onToggleCompare}
          >
            <SplitSquareVertical size={16} />
            {compare ? "Comparação ligada" : "Comparar modos"}
          </button>
          <button
            className={`soft-button flex items-center gap-2 ${
              highlightCharacteristic ? "border-cyan-400/70 text-white" : ""
            }`}
            onClick={onToggleCharacteristic}
          >
            <Telescope size={16} />
            {highlightCharacteristic ? "Graus característicos em foco" : "Destacar grau característico"}
          </button>
          <button className="soft-button flex items-center gap-2" onClick={onReset}>
            <RotateCcw size={16} />
            Reset elegante
          </button>
        </div>
      </div>
    </header>
  );
}
