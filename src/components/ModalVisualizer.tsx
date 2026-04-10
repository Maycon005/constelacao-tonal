import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { functionColor, sameCollection } from "../lib/music";
import type { ModalContext, SelectionState, TooltipState, ViewId } from "../types/music";

interface ModalVisualizerProps {
  context: ModalContext;
  pairedContext: ModalContext;
  compareContext: ModalContext;
  compareSelection: SelectionState;
  compare: boolean;
  view: ViewId;
  animations: boolean;
  highlightCharacteristic: boolean;
  pinnedNote: string | null;
  relativeIndex: number;
  onPinNote: (note: string | null) => void;
  onTooltipChange: (tooltip: TooltipState | null) => void;
  onPlayNote: (note: string) => void;
  onRelativeIndexChange: (modeIndex: number) => void;
  onCompareRelativeIndexChange: (modeIndex: number) => void;
}

interface Position {
  x: number;
  y: number;
}

const SVG_SIZE = 1000;
const CENTER = 500;
const RING_RADIUS = 395;
const INNER_RADIUS = 235;

function positions() {
  const list: Position[] = [];
  for (let i = 0; i < 12; i += 1) {
    const angle = ((-90 + i * 30) * Math.PI) / 180;
    list.push({
      x: CENTER + Math.cos(angle) * RING_RADIUS,
      y: CENTER + Math.sin(angle) * RING_RADIUS
    });
  }
  return list;
}

function polygonPath(nodePositions: Position[], pcs: number[]) {
  return pcs
    .map((pc, index) => {
      const point = nodePositions[pc];
      return `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
    })
    .join(" ")
    .concat(" Z");
}

function innerHarmonyPositions() {
  const list: Position[] = [];
  for (let i = 0; i < 7; i += 1) {
    const angle = ((-90 + i * (360 / 7)) * Math.PI) / 180;
    list.push({
      x: CENTER + Math.cos(angle) * INNER_RADIUS,
      y: CENTER + Math.sin(angle) * INNER_RADIUS
    });
  }
  return list;
}

export function ModalVisualizer({
  context,
  pairedContext,
  compareContext,
  compareSelection,
  compare,
  view,
  animations,
  highlightCharacteristic,
  pinnedNote,
  relativeIndex,
  onPinNote,
  onTooltipChange,
  onPlayNote,
  onRelativeIndexChange,
  onCompareRelativeIndexChange
}: ModalVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const outerPositions = positions();
  const harmonyPositions = innerHarmonyPositions();
  const collectionShared = sameCollection(context, compareContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles = Array.from({ length: 110 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.2 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2
    }));

    let frame = 0;
    let raf = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * window.devicePixelRatio);
      canvas.height = Math.floor(rect.height * window.devicePixelRatio);
    };

    const draw = () => {
      frame += animations ? 0.012 : 0.003;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const particle of particles) {
        particle.phase += (animations ? 0.04 : 0.01) * particle.z;
        particle.y += 0.00042 * particle.z;
        if (particle.y > 1.04) particle.y = -0.04;

        const x = particle.x * canvas.width;
        const y = particle.y * canvas.height;
        const radius = (1.2 + Math.sin(particle.phase + frame) * 0.8) * particle.z * window.devicePixelRatio;
        const alpha = 0.12 + ((Math.sin(particle.phase + frame) + 1) / 2) * 0.24;

        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.4, radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215,231,255,${alpha.toFixed(3)})`;
        ctx.fill();

        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 5);
        glow.addColorStop(0, `${context.family.accent}55`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(x, y, Math.max(2, radius * 5), 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [animations, context.family.accent]);

  const renderConstellationLinks = () => {
    const activeNodes = context.collectionPcs.map((pc) => outerPositions[pc]);
    const links: JSX.Element[] = [];

    activeNodes.forEach((from, fromIndex) => {
      activeNodes.slice(fromIndex + 1).forEach((to, toIndex) => {
        const key = `${fromIndex}-${toIndex}`;
        const distance = Math.hypot(from.x - to.x, from.y - to.y);
        const alpha = view === "constellation" ? Math.max(0.15, 0.34 - distance / 2300) : 0.08;
        links.push(
          <line
            key={key}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={`rgba(116,221,255,${alpha.toFixed(3)})`}
            strokeWidth={view === "constellation" ? 1.25 : 0.7}
          />
        );
      });
    });

    return links;
  };

  const renderGravity = () => {
    const tonicNode = outerPositions[context.tonicPc];
    if (view !== "gravity") return null;

    return (
      <>
        <motion.ellipse
          cx={tonicNode.x}
          cy={tonicNode.y}
          rx={260}
          ry={220}
          fill="rgba(122,247,207,0.035)"
          animate={animations ? { rx: [248, 268, 248], ry: [212, 228, 212] } : undefined}
          transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx={tonicNode.x}
          cy={tonicNode.y}
          r={240}
          fill="rgba(122,247,207,0.05)"
          animate={animations ? { r: [228, 246, 228], opacity: [0.06, 0.11, 0.06] } : undefined}
          transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx={tonicNode.x}
          cy={tonicNode.y}
          r={176}
          fill="rgba(122,247,207,0.07)"
          animate={animations ? { r: [166, 184, 166], opacity: [0.08, 0.13, 0.08] } : undefined}
          transition={{ duration: 2.9, repeat: Infinity, ease: "easeInOut" }}
        />
        <circle cx={tonicNode.x} cy={tonicNode.y} r={116} fill="rgba(122,247,207,0.08)" />
        <path
          d={`M ${tonicNode.x - 220} ${tonicNode.y - 110} C ${tonicNode.x - 80} ${tonicNode.y - 210}, ${tonicNode.x + 60} ${tonicNode.y - 210}, ${tonicNode.x + 210} ${tonicNode.y - 90}`}
          fill="none"
          stroke="rgba(122,247,207,0.10)"
          strokeWidth={1.4}
        />
        <path
          d={`M ${tonicNode.x - 210} ${tonicNode.y + 90} C ${tonicNode.x - 30} ${tonicNode.y + 200}, ${tonicNode.x + 100} ${tonicNode.y + 190}, ${tonicNode.x + 220} ${tonicNode.y + 70}`}
          fill="none"
          stroke="rgba(122,247,207,0.08)"
          strokeWidth={1.2}
        />
        {context.collectionPcs
          .filter((pc) => pc !== context.tonicPc)
          .map((pc) => {
            const point = outerPositions[pc];
            const controlX = (point.x + tonicNode.x) / 2 + (point.y - tonicNode.y) * 0.12;
            const controlY = (point.y + tonicNode.y) / 2 - (point.x - tonicNode.x) * 0.12;
            return (
              <path
                key={`grav-${pc}`}
                d={`M ${point.x} ${point.y} Q ${controlX} ${controlY} ${tonicNode.x} ${tonicNode.y}`}
                fill="none"
                stroke="rgba(142,249,198,0.18)"
                strokeWidth={1.35}
              />
            );
          })}
      </>
    );
  };

  const renderHarmonyView = () => {
    if (view !== "harmony") return null;

    return (
      <>
        <circle cx={CENTER} cy={CENTER} r={INNER_RADIUS} fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.1)" />
        {context.tetrads.map((chord, index) => {
          const point = harmonyPositions[index];
          const isCenter = index === 0;
          return (
            <g key={`${chord.symbol}-harmony`}>
              <line
                x1={CENTER}
                y1={CENTER}
                x2={point.x}
                y2={point.y}
                stroke="rgba(105,146,255,0.14)"
                strokeWidth={1}
              />
              <circle
                cx={point.x}
                cy={point.y}
                r={isCenter ? 36 : 28}
                fill={isCenter ? "rgba(141,247,198,0.2)" : "rgba(105,146,255,0.12)"}
                stroke={isCenter ? "rgba(141,247,198,0.72)" : "rgba(105,146,255,0.42)"}
              />
              <text x={point.x} y={point.y - 5} textAnchor="middle" fontSize={12} fill="#f8fbff">
                {chord.numeral}
              </text>
              <text x={point.x} y={point.y + 14} textAnchor="middle" fontSize={11} fill="#98a7d8">
                {chord.root}
              </text>
            </g>
          );
        })}
      </>
    );
  };

  return (
    <section className="glass-panel relative overflow-hidden rounded-[32px] p-4">
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-85" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,221,255,0.09),transparent_58%)]" />

      <div className="relative z-10 mb-3 rounded-[24px] border border-cyan-400/15 bg-slate-950/45 px-4 py-3">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="panel-label mb-1">Percurso do foco principal sobre a roda</div>
              <div className="text-sm text-slate-300">
                Deslize aqui e observe a mesma constelacao ganhar outro centro tonal em tempo real.
              </div>
            </div>
            <div className="min-w-[320px] flex-1 lg:max-w-[520px]">
              <input
                className="w-full accent-cyan-400"
                type="range"
                min={0}
                max={6}
                step={1}
                value={relativeIndex}
                onChange={(event) => onRelativeIndexChange(Number(event.target.value))}
              />
            </div>
          </div>

          {compare ? (
            <div className="flex flex-col gap-3 border-t border-white/10 pt-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="panel-label mb-1 text-fuchsia-200/80">Comparador livre sobre a roda</div>
                <div className="text-sm text-slate-300">
                  {compareContext.family.name} · {compareSelection.tonic} {compareContext.mode.name}
                </div>
              </div>
              <div className="min-w-[320px] flex-1 lg:max-w-[520px]">
                <input
                  className="w-full accent-fuchsia-400"
                  type="range"
                  min={0}
                  max={6}
                  step={1}
                  value={compareSelection.modeIndex}
                  onChange={(event) => onCompareRelativeIndexChange(Number(event.target.value))}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <motion.svg
        viewBox={`40 40 920 920`}
        className="relative z-10 h-[680px] w-full lg:h-[820px] xl:h-[900px]"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
      >
        <defs>
          <linearGradient id="polygon-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={context.family.accent} />
            <stop offset="100%" stopColor="#58ddff" />
          </linearGradient>
          <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={CENTER} cy={CENTER} r={455} fill="rgba(82,121,255,0.04)" />
        <circle cx={CENTER} cy={CENTER} r={RING_RADIUS + 30} fill="rgba(105,146,255,0.035)" />
        <circle cx={CENTER} cy={CENTER} r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
        <circle cx={CENTER} cy={CENTER} r={RING_RADIUS - 46} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />

        {view !== "harmony" ? renderConstellationLinks() : null}
        {renderGravity()}

        <path
          d={polygonPath(outerPositions, context.collectionPcs)}
          fill="rgba(105,146,255,0.10)"
          stroke="url(#polygon-gradient)"
          strokeWidth={4}
          filter="url(#soft-glow)"
        />

        {compare ? (
          <path
            d={polygonPath(outerPositions, compareContext.collectionPcs)}
            fill="rgba(203,124,255,0.05)"
            stroke={collectionShared ? "rgba(203,124,255,0.78)" : "rgba(255,139,199,0.74)"}
            strokeDasharray="8 6"
            strokeWidth={2.4}
            filter="url(#soft-glow)"
          />
        ) : null}

        {renderHarmonyView()}

        {outerPositions.map((position, pc) => {
          const noteName = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][pc];
          const degree = context.degrees.find((item) => item.note === noteName);
          const inCollection = context.collectionPcs.includes(pc);
          const isTonic = context.tonicPc === pc;
          const isCompareTonic = compareContext.tonicPc === pc;
          const isPinned = pinnedNote === noteName;
          const isCharacteristic =
            highlightCharacteristic &&
            Boolean(degree && context.characteristicDegrees.some((target) => degree.degreeLabel === target));

          const radius = isTonic ? 20 : isPinned ? 16 : isCharacteristic ? 14 : inCollection ? 11.5 : 7.5;
          const nodeStroke =
            view === "function" && degree ? functionColor(degree.functionKind) : isCharacteristic ? "#ffd071" : "#8ab6ff";
          const nodeFill =
            view === "function" && degree
              ? `${functionColor(degree.functionKind)}66`
              : isTonic
                ? "rgba(141,247,198,0.24)"
                : inCollection
                  ? "rgba(105,146,255,0.20)"
                  : "rgba(124,132,162,0.12)";

          return (
            <g
              key={noteName}
              style={{ cursor: "pointer" }}
              onMouseMove={(event) => {
                if (!degree) {
                  onTooltipChange(null);
                  return;
                }
                onTooltipChange({
                  x: event.clientX,
                  y: event.clientY,
                  title: noteName,
                  lines: [`Grau ${degree.degreeLabel}`, degree.intervalName, `Funcao: ${degree.functionKind}`]
                });
              }}
              onMouseLeave={() => onTooltipChange(null)}
              onClick={() => {
                onPinNote(isPinned ? null : noteName);
                onPlayNote(noteName);
              }}
            >
              {isTonic ? (
                <>
                  <circle cx={position.x} cy={position.y} r={radius + 28} fill="rgba(141,247,198,0.08)" />
                  <circle cx={position.x} cy={position.y} r={radius + 84} fill="rgba(141,247,198,0.04)" />
                </>
              ) : null}
              {compare && isCompareTonic ? (
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={radius + 16}
                  fill="rgba(203,124,255,0.08)"
                  stroke="rgba(203,124,255,0.66)"
                  strokeWidth={1.4}
                />
              ) : null}
              <circle
                cx={position.x}
                cy={position.y}
                r={radius}
                fill={nodeFill}
                stroke={nodeStroke}
                strokeWidth={isTonic ? 2.7 : 1.8}
              />
              <text
                x={position.x}
                y={position.y + 4}
                textAnchor="middle"
                fontSize={view === "harmony" ? 18 : 13}
                fontWeight={700}
                fill={inCollection ? "#f8fbff" : "#7080a8"}
              >
                {noteName}
              </text>
            </g>
          );
        })}

        {outerPositions.map((position, index) => (
          <text
            key={`pc-${index}`}
            x={position.x}
            y={position.y - 26}
            textAnchor="middle"
            fontSize={view === "harmony" ? 16 : 11}
            fill="rgba(176,188,221,0.56)"
          >
            {index}
          </text>
        ))}

        <g transform={`translate(${CENTER}, ${CENTER})`}>
          <circle r={94} fill="rgba(10,16,32,0.86)" stroke="rgba(255,255,255,0.12)" />
          <text y={-16} textAnchor="middle" fontSize={16} fill="#f8fbff" letterSpacing={1.1}>
            {context.tonic} {context.mode.name}
          </text>
          <text y={8} textAnchor="middle" fontSize={11} fill="#98a7d8">
            {context.family.name}
          </text>
          <text y={28} textAnchor="middle" fontSize={10} fill="#8df7c6">
            Centro tonal: {context.tonic}
          </text>
        </g>
      </motion.svg>

      <div className="relative z-10 mt-3 grid gap-3 lg:grid-cols-3">
        <div className="data-chip">
          <div className="panel-label mb-1">Colecao</div>
          <div>{context.collectionNotes.join(" - ")}</div>
        </div>
        <div className="data-chip">
          <div className="panel-label mb-1">Diagnostico modal</div>
          <div>
            {compare && collectionShared
              ? "A geometria permaneceu; a hierarquia mudou."
              : `O repouso atual orbita em torno de ${context.tonic}.`}
          </div>
        </div>
        <div className="data-chip">
          <div className="panel-label mb-1">Microexplicacao</div>
          <div>
            {view === "gravity"
              ? "A aura e os fluxos mostram para onde o sistema quer resolver."
              : view === "function"
                ? "As mesmas notas recebem novos papeis quando o centro tonal muda."
                : view === "harmony"
                  ? "O campo harmonico traduz a colecao em centros de funcao."
                  : "A constelacao fixa ajuda a ver a relatividade modal com os olhos."}
          </div>
        </div>
      </div>

      {compare ? (
        <div className="relative z-10 mt-3 grid gap-3 lg:grid-cols-2">
          <div className="data-chip border-cyan-400/25">
            <div className="panel-label mb-1 text-cyan-200/80">Camada principal</div>
            <div>{context.tonic} {context.mode.name} - {context.modeNotes.join(" - ")}</div>
          </div>
          <div className="data-chip border-fuchsia-400/25">
            <div className="panel-label mb-1 text-fuchsia-200/80">Comparador livre</div>
            <div>{compareContext.tonic} {compareContext.mode.name} - {compareContext.modeNotes.join(" - ")}</div>
          </div>
        </div>
      ) : null}

      <div className="relative z-10 mt-3 grid gap-3 lg:grid-cols-2">
        <div className="data-chip border-cyan-400/20">
          <div className="panel-label mb-1 text-cyan-200/80">Par de destaque da colecao</div>
          <div>{pairedContext.tonic} {pairedContext.mode.name} - {pairedContext.modeNotes.join(" - ")}</div>
        </div>
        <div className="data-chip">
          <div className="panel-label mb-1">Legenda visual</div>
          <div>Linha solida azul = foco principal. Traco magenta = comparador livre.</div>
        </div>
      </div>
    </section>
  );
}
