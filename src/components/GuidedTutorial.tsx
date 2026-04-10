import { motion } from "framer-motion";
import type { SelectionState } from "../types/music";

interface TutorialExample {
  title: string;
  source: SelectionState;
  target: SelectionState;
  note: string;
}

interface GuidedTutorialProps {
  onApplyExample: (source: SelectionState, target: SelectionState) => void;
}

const EXAMPLES: TutorialExample[] = [
  {
    title: "C Jonio -> A Eolio",
    source: { family: "major", tonic: "C", modeIndex: 0 },
    target: { family: "major", tonic: "A", modeIndex: 5 },
    note: "A mesma colecao de C maior muda o repouso para A sem mudar as notas."
  },
  {
    title: "D Dorico -> C Jonio",
    source: { family: "major", tonic: "D", modeIndex: 1 },
    target: { family: "major", tonic: "C", modeIndex: 0 },
    note: "O modo menor com sexta natural reaponta o centro para o maior luminoso."
  },
  {
    title: "F Lidio -> C Jonio",
    source: { family: "major", tonic: "F", modeIndex: 3 },
    target: { family: "major", tonic: "C", modeIndex: 0 },
    note: "O brilho do #4 em F Lidio volta para a gravidade classica de C Jonio."
  }
];

export function GuidedTutorial({ onApplyExample }: GuidedTutorialProps) {
  return (
    <section className="glass-panel rounded-[28px] p-4 md:p-5">
      <div className="flex flex-col gap-4">
        <div>
          <p className="panel-label mb-2">Tutorial Guiado</p>
          <h3 className="text-xl font-semibold text-white">Tres atalhos classicos para sentir a relatividade modal</h3>
          <p className="mt-2 max-w-3xl text-sm text-slate-300">
            Cada exemplo ajusta o foco principal e o comparador livre para um contraste pedagogico imediato.
          </p>
        </div>

        <div className="grid gap-3 xl:grid-cols-3">
          {EXAMPLES.map((example) => (
            <motion.button
              key={example.title}
              whileHover={{ y: -4 }}
              className="rounded-[24px] border border-white/10 bg-slate-950/45 p-4 text-left transition hover:border-cyan-400/40 hover:bg-cyan-400/5"
              onClick={() => onApplyExample(example.source, example.target)}
            >
              <div className="panel-label mb-2">Exemplo guiado</div>
              <div className="text-lg font-semibold text-white">{example.title}</div>
              <div className="mt-2 text-sm text-slate-300">{example.note}</div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
