import { Volume2, Sparkles, Telescope, Waves, RotateCcw, SplitSquareVertical } from "lucide-react";
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
  audioEnabled: boolean;
  onEnableAudio: () => void;
  onPlayMode: () => void;
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
  audioEnabled,
  onEnableAudio,
  onPlayMode
}: ControlBarProps) {
  const familyModes = FAMILIES[selection.family].modes;

  return (
    <header className="glass-panel rounded-[32px] px-5 py-5 md:px-7 md:py-6">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl">
            <p className="panel-label mb-2">Constelacao Tonal</p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 md:text-5xl">
              Mesma colecao, novo sol.
            </h1>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-300 md:text-xl">
              Veja a geometria permanecer enquanto a tonica redefine repouso, funcao, tensao e cor modal.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 text-xs text-slate-300 md:grid-cols-2 2xl:grid-cols-4">
            <div className="data-chip">Hover nas notas revela grau, intervalo e funcao.</div>
            <div className="data-chip">Autoplay desliza a gravidade tonal pela mesma colecao.</div>
            <div className="data-chip">Comparacao mostra o que permanece e o que muda.</div>
            <div className="data-chip">Audio torna a nova tonica audivel junto da nova geometria.</div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <label className="flex flex-col gap-1">
            <span className="panel-label">Familia</span>
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
            <span className="panel-label">Tonica</span>
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

          <button className="soft-button flex items-center justify-center gap-2" onClick={onToggleAutoplay}>
            <Sparkles size={16} />
            {autoplay ? "Autoplay ativo" : "Autoplay modal"}
          </button>

          <button className="soft-button flex items-center justify-center gap-2" onClick={onToggleAnimations}>
            <Waves size={16} />
            {animations ? "Animacoes on" : "Animacoes off"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {VIEW_OPTIONS.map((option) => (
            <button
              key={option.id}
              className={`soft-button ${view === option.id ? "border-cyan-400/70 text-white shadow-neon" : ""}`}
              onClick={() => onViewChange(option.id as ViewId)}
              title={option.hint}
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
            {compare ? "Comparacao ligada" : "Comparar modos"}
          </button>
          <button
            className={`soft-button flex items-center gap-2 ${
              highlightCharacteristic ? "border-cyan-400/70 text-white" : ""
            }`}
            onClick={onToggleCharacteristic}
          >
            <Telescope size={16} />
            {highlightCharacteristic ? "Graus caracteristicos em foco" : "Destacar grau caracteristico"}
          </button>
          <button className="soft-button flex items-center gap-2" onClick={audioEnabled ? onPlayMode : onEnableAudio}>
            <Volume2 size={16} />
            {audioEnabled ? "Ouvir modo atual" : "Ativar audio"}
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
