import { startTransition, useEffect, useState } from "react";
import { ComparisonPanel } from "./components/ComparisonPanel";
import { ControlBar } from "./components/ControlBar";
import { InfoPanel } from "./components/InfoPanel";
import { ModalVisualizer } from "./components/ModalVisualizer";
import { RelativeLab } from "./components/RelativeLab";
import { Tooltip } from "./components/Tooltip";
import { playChord, playModeSweep, playNote, playProgression } from "./lib/audio";
import {
  buildModalContext,
  featuredPairSelection,
  nextRelativeSelection,
  progressionPlayback,
  selectionFromRelativeIndex
} from "./lib/music";
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
  const [view, setView] = useState<ViewId>("gravity");
  const [compare, setCompare] = useState(true);
  const [animations, setAnimations] = useState(true);
  const [highlightCharacteristic, setHighlightCharacteristic] = useState(true);
  const [pinnedNote, setPinnedNote] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredChord, setHoveredChord] = useState<HarmonicChord | null>(null);
  const [autoplay, setAutoplay] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const context = buildModalContext(selection);
  const compareContext = buildModalContext(compareSelection);

  useEffect(() => {
    if (!autoplay) return undefined;

    const timer = window.setInterval(() => {
      startTransition(() => {
        setSelection((current) => {
          const next = nextRelativeSelection(current);
          if (audioEnabled) {
            void playModeSweep(buildModalContext(next));
          }
          return next;
        });
      });
    }, animations ? 1800 : 1250);

    return () => window.clearInterval(timer);
  }, [autoplay, animations, audioEnabled]);

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

  useEffect(() => {
    const featuredPair = featuredPairSelection(selection);
    setCompareSelection((current) => {
      if (
        current.family === featuredPair.family &&
        current.tonic === featuredPair.tonic &&
        current.modeIndex === featuredPair.modeIndex
      ) {
        return current;
      }
      return featuredPair;
    });
  }, [selection.family, selection.modeIndex, selection.tonic]);

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

  const enableAudio = async () => {
    setAudioEnabled(true);
    await playModeSweep(context);
  };

  const handlePlayMode = async () => {
    setAudioEnabled(true);
    await playModeSweep(context);
  };

  const handlePlaySelection = async (target: SelectionState) => {
    setAudioEnabled(true);
    await playModeSweep(buildModalContext(target));
  };

  const handlePlayChord = async (chord: HarmonicChord) => {
    setAudioEnabled(true);
    await playChord(chord);
  };

  const handlePlayProgression = async (progression: string) => {
    setAudioEnabled(true);
    await playProgression(progressionPlayback(context, progression));
  };

  const handlePlayNote = async (note: string) => {
    setAudioEnabled(true);
    await playNote(note);
  };

  return (
    <div className="relative min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-5">
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
            setView("gravity");
            setPinnedNote(null);
            setTooltip(null);
            setHoveredChord(null);
            setAutoplay(false);
            setHighlightCharacteristic(true);
          }}
          audioEnabled={audioEnabled}
          onEnableAudio={enableAudio}
          onPlayMode={handlePlayMode}
        />

        <div className="grid gap-5 xl:grid-cols-[1.55fr_0.85fr]">
          <ModalVisualizer
            context={context}
            compareContext={compareContext}
            compare={compare}
            view={view}
            animations={animations}
            highlightCharacteristic={highlightCharacteristic}
            pinnedNote={pinnedNote}
            relativeIndex={selection.modeIndex}
            onPinNote={setPinnedNote}
            onTooltipChange={setTooltip}
            onPlayNote={handlePlayNote}
            onRelativeIndexChange={(modeIndex) =>
              applySelection(selectionFromRelativeIndex(selection, modeIndex))
            }
          />

          <InfoPanel
            context={context}
            pinnedNote={pinnedNote}
            hoveredChord={hoveredChord}
            onChordHover={setHoveredChord}
            onChordPlay={handlePlayChord}
            onModePlay={handlePlayMode}
            onProgressionPlay={handlePlayProgression}
          />
        </div>

        <RelativeLab
          context={context}
          selection={selection}
          compareSelection={compareSelection}
          onSelectionChange={applySelection}
          onCompareSelectionChange={applyCompareSelection}
          onPlaySelection={handlePlaySelection}
        />

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
          <span className="text-slate-100">Constelacao Tonal</span> traduz relatividade modal em geometria,
          gravidade, funcao e escuta. O desenho pode permanecer identico enquanto a percepcao harmonica muda profundamente.
        </footer>
      </div>

      <Tooltip tooltip={tooltip} />
    </div>
  );
}

export default App;
