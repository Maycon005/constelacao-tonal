import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { functionColor, sameCollection } from "../lib/music";
import type { ModalContext, TooltipState, ViewId } from "../types/music";

interface ModalVisualizerProps {
  context: ModalContext;
  compareContext: ModalContext;
  compare: boolean;
  view: ViewId;
  animations: boolean;
  highlightCharacteristic: boolean;
  pinnedNote: string | null;
  onPinNote: (note: string | null) => void;
  onTooltipChange: (tooltip: TooltipState | null) => void;
}

interface Position {
  x: number;
  y: number;
}

const SVG_SIZE = 1000;
const CENTER = 500;
const RING_RADIUS = 340;
const INNER_RADIUS = 210;

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
  compareContext,
  compare,
  view,
  animations,
  highlightCharacteristic,
  pinnedNote,
  onPinNote,
  onTooltipChange
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

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: 0.25 + Math.random() * 0.95,
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
        particle.phase += (animations ? 0.04 : 0.008) * particle.z;
        particle.y += 0.00045 * particle.z;
        if (particle.y > 1.04) particle.y = -0.04;

        const x = particle.x * canvas.width;
        const y = particle.y * canvas.height;
        const radius = (1.1 + Math.sin(particle.phase + frame) * 0.7) * particle.z * window.devicePixelRatio;
        const alpha = 0.15 + ((Math.sin(particle.phase + frame) + 1) / 2) * 0.24;

        ctx.beginPath();
        ctx.arc(x, y, Math.max(0.6, radius), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(215,231,255,${alpha.toFixed(3)})`;
        ctx.fill();

        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius * 4);
        glow.addColorStop(0, `${context.family.accent}55`);
        glow.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.arc(x, y, Math.max(2, radius * 4), 0, Math.PI * 2);
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
    if (view !== "constellation") return null;
    const activeNodes = context.collectionPcs.map((pc) => outerPositions[pc]);
    const links: JSX.Element[] = [];

    activeNodes.forEach((from, fromIndex) => {
      activeNodes.slice(fromIndex + 1).forEach((to, toIndex) => {
        const key = `${fromIndex}-${toIndex}`;
        const distance = Math.hypot(from.x - to.x, from.y - to.y);
        const alpha = Math.max(0.12, 0.3 - distance / 2200);
        links.push(
          <line
            key={key}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke={`rgba(116,221,255,${alpha.toFixed(3)})`}
            strokeWidth={1}
          />
        );
      });
    });

    return links;
  };

  const renderGravity = () => {
    if (view !== "gravity") return null;
    const tonicNode = outerPositions[context.tonicPc];

    return (
      <>
        <circle
          cx={tonicNode.x}
          cy={tonicNode.y}
          r={animations ? 168 : 154}
          fill="rgba(122, 247, 207, 0.08)"
        />
        {context.collectionPcs
          .filter((pc) => pc !== context.tonicPc)
          .map((pc) => {
            const point = outerPositions[pc];
            const controlX = (point.x + tonicNode.x) / 2 + (point.y - tonicNode.y) * 0.08;
            const controlY = (point.y + tonicNode.y) / 2 - (point.x - tonicNode.x) * 0.08;
            return (
              <path
                key={`grav-${pc}`}
                d={`M ${point.x} ${point.y} Q ${controlX} ${controlY} ${tonicNode.x} ${tonicNode.y}`}
                fill="none"
                stroke="rgba(142, 249, 198, 0.16)"
                strokeWidth={1.2}
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
                stroke="rgba(105,146,255,0.12)"
                strokeWidth={1}
              />
              <circle
                cx={point.x}
                cy={point.y}
                r={isCenter ? 26 : 20}
                fill={isCenter ? "rgba(141,247,198,0.16)" : "rgba(105,146,255,0.10)"}
                stroke={isCenter ? "rgba(141,247,198,0.65)" : "rgba(105,146,255,0.38)"}
              />
              <text x={point.x} y={point.y - 2} textAnchor="middle" fontSize={9} fill="#f8fbff">
                {chord.numeral}
              </text>
              <text x={point.x} y={point.y + 11} textAnchor="middle" fontSize={8} fill="#98a7d8">
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
      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-80" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(88,221,255,0.08),transparent_55%)]" />

      <motion.svg
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        className="relative z-10 h-[560px] w-full lg:h-[700px]"
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
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={CENTER} cy={CENTER} r={430} fill="rgba(82,121,255,0.05)" />
        <circle cx={CENTER} cy={CENTER} r={RING_RADIUS} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={2} />
        <circle cx={CENTER} cy={CENTER} r={RING_RADIUS - 40} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={1} />

        {renderConstellationLinks()}
        {renderGravity()}

        <path
          d={polygonPath(outerPositions, context.collectionPcs)}
          fill="rgba(105,146,255,0.09)"
          stroke="url(#polygon-gradient)"
          strokeWidth={3.2}
          filter="url(#soft-glow)"
        />

        {compare ? (
          <path
            d={polygonPath(outerPositions, compareContext.collectionPcs)}
            fill="rgba(203,124,255,0.05)"
            stroke={collectionShared ? "rgba(203,124,255,0.72)" : "rgba(255,139,199,0.7)"}
            strokeDasharray="8 6"
            strokeWidth={2.2}
          />
        ) : null}

        {renderHarmonyView()}

        {outerPositions.map((position, pc) => {
          const note = context.collectionNotes.find((value) => value === context.collectionNotes[context.collectionPcs.indexOf(pc)]) ?? "";
          const noteName = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][pc];
          const degree = context.degrees.find((item) => item.note === noteName);
          const inCollection = context.collectionPcs.includes(pc);
          const isTonic = context.tonicPc === pc;
          const isCompareTonic = compareContext.tonicPc === pc;
          const isPinned = pinnedNote === noteName;
          const isCharacteristic =
            highlightCharacteristic &&
            Boolean(degree && context.characteristicDegrees.some((target) => degree.degreeLabel === target));

          const radius = isTonic ? 18 : isPinned ? 15 : isCharacteristic ? 13 : inCollection ? 11 : 7;
          const nodeStroke =
            view === "function" && degree ? functionColor(degree.functionKind) : isCharacteristic ? "#ffd071" : "#8ab6ff";
          const nodeFill =
            view === "function" && degree
              ? `${functionColor(degree.functionKind)}66`
              : isTonic
                ? "rgba(141,247,198,0.22)"
                : inCollection
                  ? "rgba(105,146,255,0.16)"
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
                  lines: [`Grau ${degree.degreeLabel}`, degree.intervalName, `Função: ${degree.functionKind}`]
                });
              }}
              onMouseLeave={() => onTooltipChange(null)}
              onClick={() => onPinNote(isPinned ? null : noteName)}
            >
              {isTonic ? (
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={radius + (animations ? 18 : 14)}
                  fill="rgba(141,247,198,0.08)"
                />
              ) : null}
              {compare && isCompareTonic ? (
                <circle
                  cx={position.x}
                  cy={position.y}
                  r={radius + 12}
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
                strokeWidth={isTonic ? 2.4 : 1.6}
              />
              <text
                x={position.x}
                y={position.y + 4}
                textAnchor="middle"
                fontSize={12}
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
            y={position.y - 24}
            textAnchor="middle"
            fontSize={9}
            fill="rgba(176,188,221,0.52)"
          >
            {index}
          </text>
        ))}

        <g transform={`translate(${CENTER}, ${CENTER})`}>
          <circle r={86} fill="rgba(10,16,32,0.84)" stroke="rgba(255,255,255,0.12)" />
          <text y={-16} textAnchor="middle" fontSize={15} fill="#f8fbff" letterSpacing={1.1}>
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
          <div className="panel-label mb-1">Coleção</div>
          <div>{context.collectionNotes.join(" - ")}</div>
        </div>
        <div className="data-chip">
          <div className="panel-label mb-1">Diagnóstico modal</div>
          <div>
            {compare && collectionShared
              ? "A geometria permaneceu; a hierarquia mudou."
              : `O repouso atual orbita em torno de ${context.tonic}.`}
          </div>
        </div>
        <div className="data-chip">
          <div className="panel-label mb-1">Microexplicação</div>
          <div>
            {view === "gravity"
              ? "A aura e os fluxos mostram para onde o sistema quer resolver."
              : view === "function"
                ? "As mesmas notas recebem novos papéis quando o centro tonal muda."
                : view === "harmony"
                  ? "O campo harmônico traduz a coleção em centros de função."
                  : "A constelação fixa ajuda a ver a relatividade modal com os olhos."}
          </div>
        </div>
      </div>
    </section>
  );
}
