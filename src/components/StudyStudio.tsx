import { useState } from "react";
import { NOTES } from "../data/modalFamilies";
import { buildModalContext, selectionFromRelativeIndex } from "../lib/music";
import { playModeSweep, playNote, playChord, stopAudio } from "../lib/audio";
import type { SelectionState } from "../types/music";

const lessons = [
  { title: "Notas e distâncias", text: "Uma escala é uma seleção de notas. Cada passo entre vizinhos no teclado cromático vale um semitom. Dois passos formam um tom. Clique nas notas e observe os espaços.", question: "De E até F existe…", options: ["1 semitom", "2 semitons", "3 semitons"], answer: 0, why: "E e F são vizinhos: não há uma tecla entre eles. B e C também são vizinhos." },
  { title: "O desenho da escala", text: "A escala maior segue 2 · 2 · 1 · 2 · 2 · 2 · 1 semitons. Experimente outra tônica: os nomes mudam, mas o padrão de distâncias se repete.", question: "Ao transpor uma escala maior, o que permanece?", options: ["Os nomes das notas", "O padrão de distâncias", "A tônica"], answer: 1, why: "Transpor desloca todas as notas pela mesma distância. A estrutura intervalar permanece." },
  { title: "Uma nova casa", text: "Agora mantenha as sete notas e escolha outra nota como casa. O slider troca o centro sem trocar a coleção. Ouça a nota grave sustentada e a escala: começar por outra nota, sozinho, não estabelece um modo.", question: "C Jônio e A Eólio compartilham…", options: ["A mesma tônica", "As mesmas funções", "As mesmas notas"], answer: 2, why: "C D E F G A B e A B C D E F G contêm as mesmas notas. O repouso e os intervalos em relação à tônica mudam." },
  { title: "A cor de cada grau", text: "Grau é a posição de uma nota em relação à tônica. Compare a mesma nota nos diferentes modos: em C Jônio, B é o grau 7; em A Eólio, B é o grau 2. As cores são pistas visuais, não regras universais de emoção.", question: "No modo D Dórico, a nota C é…", options: ["A tônica", "A sétima menor", "A terça maior"], answer: 1, why: "Contando a partir de D: D E F G A B C. C ocupa o sétimo grau, a 10 semitons de D." },
  { title: "Da escala aos acordes", text: "Escolha uma nota, pule a próxima, escolha outra, pule novamente: 1 · 3 · 5 forma uma tríade. Acrescente o grau 7 e temos uma tétrade. Clique nos acordes para ouvir as notas juntas.", question: "A tríade de C maior contém…", options: ["C D E", "C E G", "C F A"], answer: 1, why: "Empilhar terças na escala de C maior seleciona C, E e G. Acrescentar B produz Cmaj7." }
];
const initial: SelectionState = { family: "major", tonic: "C", modeIndex: 0 };

export function StudyStudio({ onExplore }: { onExplore: (selection: SelectionState) => void }) {
  const [step, setStep] = useState(0);
  const [selection, setSelection] = useState(initial);
  const [answer, setAnswer] = useState<number | null>(null);
  const [completed, setCompleted] = useState<number[]>(() => {
    try { const saved: unknown = JSON.parse(localStorage.getItem("tonal-study-v2") ?? "[]"); return Array.isArray(saved) ? saved.filter(value => Number.isInteger(value) && value >= 0 && value < 5) : []; } catch { return []; }
  });
  const [soundError, setSoundError] = useState(false);
  const context = buildModalContext(selection);
  const lesson = lessons[step];
  const submitAnswer = (index: number) => {
    setAnswer(index);
    if (index === lesson.answer) {
      const next = [...new Set([...completed, step])]; setCompleted(next);
      try { localStorage.setItem("tonal-study-v2", JSON.stringify(next)); } catch { /* Study remains available without storage. */ }
    }
  };
  const listen = (action: Promise<unknown>) => { setSoundError(false); void action.catch(() => setSoundError(true)); };
  const changeStep = (index: number) => { stopAudio(); setStep(index); setAnswer(null); setSelection(initial); };

  return <section className="study-studio" aria-label="Estúdio de aprendizagem">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div><p className="panel-label">Aprender fazendo / {completed.length} de 5 descobertas</p><h2 className="mt-2 text-3xl font-semibold">Da primeira nota à relatividade modal.</h2></div>
      <button className="soft-button" onClick={stopAudio}>Parar áudio</button>
    </div>
    <nav className="my-6 flex flex-wrap gap-2" aria-label="Etapas de estudo">{lessons.map((item, index) => <button key={item.title} aria-current={step === index ? "step" : undefined} onClick={() => changeStep(index)} className={`lesson-tab ${step === index ? "lesson-active" : ""}`}>{completed.includes(index) ? "✓" : index + 1} · {item.title}</button>)}</nav>
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div><p className="panel-label">Descoberta 0{step + 1}</p><h3 className="my-3 text-2xl text-cyan-100">{lesson.title}</h3><p className="text-base leading-7 text-slate-300">{lesson.text}</p>
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5"><p className="font-medium">{lesson.question}</p><div className="mt-4 flex flex-col gap-2">{lesson.options.map((option, index) => <button className={`soft-button text-left ${answer === index ? "border-cyan-300" : ""}`} key={option} onClick={() => submitAnswer(index)}>{option}</button>)}</div><p className="mt-4 text-sm leading-6 text-cyan-100" aria-live="polite">{answer === null ? "Experimente no painel de notas antes de responder." : answer === lesson.answer ? `Isso mesmo. ${lesson.why}` : `Observe mais uma vez. ${lesson.why}`}</p></div>
      </div>
      <div className="rounded-3xl border border-cyan-300/20 bg-cyan-950/10 p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="text-2xl">{context.tonic} {context.mode.name}</h3><button className="soft-button" onClick={() => listen(playModeSweep(context))}>Ouvir com nota de repouso</button></div>
        {step === 0 ? <div className="mt-5"><p className="mb-3 text-sm text-slate-400">As 12 notas: cada vizinho está a um semitom. Depois de B, voltamos a C na próxima oitava.</p><div className="grid grid-cols-6 gap-1.5 sm:grid-cols-12">{NOTES.map(note => <button className={`rounded-lg border py-5 text-sm ${note.includes("#") ? "border-white/10 bg-black text-slate-300" : "border-cyan-200/40 bg-cyan-50 text-slate-950"}`} key={note} onClick={() => listen(playNote(note, 3))}>{note}</button>)}</div><p className="mt-3 text-xs text-slate-400">C = Dó · D = Ré · E = Mi · F = Fá · G = Sol · A = Lá · B = Si. # eleva a nota em um semitom.</p></div> : null}
        {step === 1 ? <label className="mt-5 block text-sm">Transpor a escala <select className="soft-input ml-3" value={selection.tonic} onChange={event => setSelection({ ...initial, tonic: event.target.value })}>{["C", "D", "E", "F", "G", "A", "B"].map(note => <option key={note}>{note}</option>)}</select></label> : null}
        {step >= 2 ? <label className="mt-6 block text-sm text-cyan-100">Mesmas notas, escolha outra casa: {context.tonic}<input aria-label="Centro tonal do experimento" className="my-4 w-full" type="range" min="0" max="6" value={selection.modeIndex} onChange={event => setSelection(selectionFromRelativeIndex(selection, Number(event.target.value)))} /></label> : null}
        <div className="my-6 grid grid-cols-7 gap-1.5">{context.degrees.map(degree => <button key={degree.note} onClick={() => listen(playNote(degree.note, 3))} className={`note-tile ${degree.degree === 1 ? "note-home" : ""}`}><span className="text-lg font-semibold md:text-2xl">{degree.note}</span><span className="mt-2 text-xs">{degree.degree === 1 ? "casa" : `grau ${degree.degree}`}</span>{step >= 3 ? <span className="mt-2 text-xs">{degree.intervalName}</span> : null}</button>)}</div>
        <p className="panel-label">Distâncias entre notas consecutivas, até a oitava</p><div className="my-3 grid grid-cols-7 gap-1.5">{context.modeSemitones.map((distance, index) => <span className="rounded-lg bg-white/5 py-3 text-center text-sm text-cyan-200" key={index}>{(context.modeSemitones[index + 1] ?? 12) - distance}</span>)}</div>
        <p className="text-sm leading-6 text-slate-400">Cada número representa semitons. A soma sempre fecha a oitava: 12. As posições cromáticas da roda permanecem fixas durante a exploração relativa.</p>
        {step === 4 ? <div className="mt-5 flex flex-wrap gap-2">{context.triads.map(chord => <button className="soft-button" key={chord.symbol} onClick={() => listen(playChord(chord))}>{chord.symbol} · {chord.notes.join(" ")}</button>)}</div> : null}
        {soundError ? <p role="alert">Não foi possível iniciar o áudio. Tente clicar em Ouvir novamente.</p> : null}
        <button className="soft-button mt-6 border-cyan-400/50" onClick={() => { stopAudio(); onExplore(selection); }}>Levar este exemplo para a roda →</button>
      </div>
    </div>
    <div className="mt-7 flex items-center justify-between"><button className="soft-button" disabled={step === 0} onClick={() => changeStep(step - 1)}>Anterior</button><span className="text-sm text-slate-400">{step + 1} / 5</span><button className="soft-button" disabled={step === 4} onClick={() => changeStep(step + 1)}>Próxima descoberta</button></div>
  </section>;
}

