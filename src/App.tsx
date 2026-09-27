import { startTransition, useEffect, useState } from "react";
import { ComparisonPanel } from "./components/ComparisonPanel";
import { ControlBar } from "./components/ControlBar";
import { InfoPanel } from "./components/InfoPanel";
import { ModalVisualizer } from "./components/ModalVisualizer";
import { RelativeLab } from "./components/RelativeLab";
import { Tooltip } from "./components/Tooltip";
import { StudyStudio } from "./components/StudyStudio";
import { MotionConfig } from "framer-motion";
import { playChord, playModeSweep, playNote, playProgression, stopAudio } from "./lib/audio";
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
  const [workspace, setWorkspace] = useState<"explore" | "learn">("explore");
  const [selection, setSelection] = useState<SelectionState>(DEFAULT_SELECTION);
  const [pairedSelection, setPairedSelection] = useState<SelectionState>(DEFAULT_COMPARE);
  const [compareSelection, setCompareSelection] = useState<SelectionState>(DEFAULT_COMPARE);
  const [view, setView] = useState<ViewId>("gravity");
  const [compare, setCompare] = useState(true);
  const [animations, setAnimations] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [highlightCharacteristic, setHighlightCharacteristic] = useState(true);
  const [pinnedNote, setPinnedNote] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [hoveredChord, setHoveredChord] = useState<HarmonicChord | null>(null);
  const [autoplay, setAutoplay] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const context = buildModalContext(selection);
  const pairedContext = buildModalContext(pairedSelection);
  const compareContext = buildModalContext(compareSelection);

  useEffect(() => {
    if (!autoplay) return undefined;

    const timer = window.setInterval(() => {
      startTransition(() => {
        setSelection((current) => {
          const next = nextRelativeSelection(current);
          return next;
        });
      });
    }, audioEnabled ? 3200 : 2200);

    return () => window.clearInterval(timer);
  }, [autoplay, animations, audioEnabled]);

  useEffect(() => {
    if (autoplay && audioEnabled) void playModeSweep(buildModalContext(selection));
  }, [selection, autoplay, audioEnabled]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space" && !event.repeat && !(event.target instanceof HTMLElement && event.target.closest("input, select, textarea, button, a, [contenteditable]"))) {
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

  const applyTopSelection = (next: SelectionState) => {
    startTransition(() => {
      setSelection(next);
      setPairedSelection(featuredPairSelection(next));
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
    <MotionConfig reducedMotion={animations ? "user" : "always"}>
    <div className="relative min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex max-w-[1920px] flex-col gap-5">
        <nav className="workspace-nav" aria-label="Navegação principal">
          <a href="#main-content" className="text-sm tracking-widest text-cyan-100">CONSTELAÇÃO TONAL <span className="version-badge">2.0</span></a>
          <div className="flex flex-wrap gap-2">
            <button className="soft-button" aria-pressed={workspace === "explore"} onClick={() => setWorkspace("explore")}>Explorar a roda</button>
            <button className="soft-button" aria-pressed={workspace === "learn"} onClick={() => { setWorkspace("learn"); setAutoplay(false); stopAudio(); }}>Aprender do zero</button>
            <button className="soft-button" onClick={() => { setAutoplay(false); stopAudio(); }}>Parar som</button>
          </div>
        </nav>
        <main id="main-content">
        {workspace === "learn" ? <StudyStudio onExplore={next => { applyTopSelection(next); setWorkspace("explore"); }} /> : <div className="flex flex-col gap-5">
        <ControlBar
          selection={selection}
          onSelectionChange={applyTopSelection}
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
            stopAudio();
            setSelection(DEFAULT_SELECTION);
            setPairedSelection(DEFAULT_COMPARE);
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
            pairedContext={pairedContext}
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
            compareSelection={compareSelection}
            onCompareRelativeIndexChange={(modeIndex) =>
              applyCompareSelection(selectionFromRelativeIndex(compareSelection, modeIndex))
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
          pairedContext={pairedContext}
          selection={selection}
          pairedSelection={pairedSelection}
          onSelectionChange={applySelection}
          onPairedSelectionChange={setPairedSelection}
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
        </div>}
        </main>

        <footer className="glass-panel rounded-[28px] px-5 py-4 text-sm text-slate-300">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p className="max-w-4xl">
              <span className="text-slate-100">Constelacao Tonal</span> traduz relatividade modal em geometria,
              gravidade, funcao e escuta. O desenho pode permanecer identico enquanto a percepcao harmonica muda profundamente.
            </p>

            <div className="inline-flex items-center gap-3 self-start rounded-full border border-cyan-400/20 bg-slate-950/55 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300 shadow-[0_0_30px_rgba(34,211,238,0.08)]">
              <span className="whitespace-nowrap text-white">By Maycon</span>
              <span className="h-1 w-1 rounded-full bg-cyan-300/80" />
              <span className="text-cyan-200">para Artistas do Futuro</span>
            </div>
          </div>
        </footer>
      </div>

      <Tooltip tooltip={tooltip} />
    </div>
    </MotionConfig>
  );
}

export default App;
