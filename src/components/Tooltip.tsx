import { motion, AnimatePresence } from "framer-motion";
import type { TooltipState } from "../types/music";

interface TooltipProps {
  tooltip: TooltipState | null;
}

export function Tooltip({ tooltip }: TooltipProps) {
  return (
    <AnimatePresence>
      {tooltip ? (
        <motion.div
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className="pointer-events-none fixed z-50 max-w-xs rounded-2xl border border-cyan-400/25 bg-slate-950/90 px-4 py-3 text-xs text-slate-100 shadow-neon backdrop-blur-xl"
          style={{ left: tooltip.x + 18, top: tooltip.y + 18 }}
        >
          <div className="mb-1 text-sm font-medium text-white">{tooltip.title}</div>
          <div className="space-y-1 text-slate-300">
            {tooltip.lines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
