import { startTransition, useEffect, useState } from "react";
import { ComparisonPanel } from "./components/ComparisonPanel";
import { ControlBar } from "./components/ControlBar";
import { InfoPanel } from "./components/InfoPanel";
import { ModalVisualizer } from "./components/ModalVisualizer";
import { Tooltip } from "./components/Tooltip";
import { buildModalContext, nextRelativeSelection, selectionFromRelativeIndex } from "./lib/music";
import type { HarmonicChord, SelectionState, TooltipState, ViewId } from "./types/music";

const DEFAULT_SELECTION: SelectionState = {
  family: "major",
  tonic: "C",
  modeIndex: 0
};

const DEFAULT_COMPARE: SelectionState = {
  family: "major",
  tonic: "A",
  modeIndex: 5
};

function App() {
  const [selection, setSelection] = useState<SelectionState>(DEFAULT_SELECTION);
  const [compareSelection, setCompareSelection] = useState<SelectionState>(DEFAULT_COMPARE);
  const [view, setView] = useState<ViewId>("orbit");
  const [compare, setCompare] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [highlightCharacteristic, setHighlightCharacteristic] = useState(true);
  const [pinnedNote, setPinnedNote] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredChord, setHoveredChord] = useState<HarmonicChord | null>(null);
  const [autoplay, setAutoplay] = useState(false);

  const context = buildModalContext(selection);
  const compareContext = buildModalContext(compareSelection);

  useEffect(() => {
    if (!autoplay) return undefined;

    const timer = window.setInterval(() => {
      startTransition(() => {
        setSelection((current) => nextRelativeSelection(current));
      });
    }, animations ? 1800 : 1250);

    return () => window.clearInterval(timer);
  }, [autoplay, animations]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setAutoplay((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const applySelection = (next: SelectionState) => {
    startTransition(() => {
      setSelection(next);
    });
  };

  const applyCompareSelection = (next: SelectionState) => {
    startTransition(() => {
      setCompareSelection(next);
    });
  };

  return (
    <div className="relative min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-5">
        <ControlBar
          selection={selection}
          onSelectionChange={applySelection}
          view={view}
          onViewChange={setView}
          animations={animations}
          onToggleAnimations={() => setAnimations((current) => !current)}
          compare={compare}
          onToggleCompare={() => setCompare((current) => !current)}
          autoplay={autoplay}
          onToggleAutoplay={() => setAutoplay((current) => !current)}
          highlightCharacteristic={highlightCharacteristic}
          onToggleCharacteristic={() => setHighlightCharacteristic((current) => !current)}
          onReset={() => {
            setSelection(DEFAULT_SELECTION);
            setCompareSelection(DEFAULT_COMPARE);
            setView("orbit");
            setPinnedNote(null);
            setTooltip(null);
            setHoveredChord(null);
            setAutoplay(false);
            setHighlightCharacteristic(true);
          }}
          onRelativeModeSlide={(modeIndex) => applySelection(selectionFromRelativeIndex(selection, modeIndex))}
        />

        <div className="grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
          <ModalVisualizer
            context={context}
            compareContext={compareContext}
            compare={compare}
            view={view}
            animations={animations}
            highlightCharacteristic={highlightCharacteristic}
            pinnedNote={pinnedNote}
            onPinNote={setPinnedNote}
            onTooltipChange={setTooltip}
          />

          <InfoPanel
            context={context}
            pinnedNote={pinnedNote}
            hoveredChord={hoveredChord}
            onChordHover={setHoveredChord}
          />
        </div>

        {compare ? (
          <ComparisonPanel
            left={context}
            right={compareContext}
            selection={selection}
            compareSelection={compareSelection}
            onCompareSelectionChange={applyCompareSelection}
          />
        ) : null}

        <footer className="glass-panel rounded-[28px] px-5 py-4 text-sm text-slate-300">
          <span className="text-slate-100">Constelação Tonal</span> traduz relatividade modal em geometria,
          gravidade e função. O desenho pode permanecer idêntico enquanto a percepção harmônica muda
          profundamente.
        </footer>
      </div>

      <Tooltip tooltip={tooltip} />
    </div>
  );
}

export default App;
