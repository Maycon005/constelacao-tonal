import type { FamilyDefinition } from "../types/music";

export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const VIEW_OPTIONS = [
  { id: "orbit", label: "Orbit View", hint: "Estrutura geometrica da colecao" },
  { id: "constellation", label: "Constellation View", hint: "Mesma constelacao, novo sol" },
  { id: "gravity", label: "Gravity View", hint: "Repouso, atracao e centro tonal" },
  { id: "function", label: "Function View", hint: "Graus, tensoes e funcao intervalar" },
  { id: "harmony", label: "Harmony View", hint: "Campo harmonico e progressoes" }
] as const;

export const FUNCTION_COLORS = {
  rest: "#8df7c6",
  stable: "#76d7ff",
  color: "#c39bff",
  tension: "#ffd071",
  unstable: "#ff8bc7"
} as const;

export const FAMILIES: Record<FamilyDefinition["id"], FamilyDefinition> = {
  major: {
    id: "major",
    name: "Escala Maior / Modos Gregos",
    signature: "Halo azul eletrico, clareza editorial e arquitetura diatonica",
    accent: "#6992ff",
    background: "from-blue-500/20 via-cyan-400/10 to-transparent",
    basePattern: [0, 2, 4, 5, 7, 9, 11],
    modes: [
      {
        name: "Jonio",
        shortName: "Ionian",
        mood: "luminoso, estavel, expansivo",
        characteristic: "7",
        chordColor: "maj7",
        microcopy: "A sensivel empurra de volta para casa com maxima estabilidade."
      },
      {
        name: "Dorico",
        shortName: "Dorian",
        mood: "menor com impulso, movel, sofisticado",
        characteristic: "6",
        chordColor: "m7",
        microcopy: "A sexta natural clareia um modo menor sem dissolver sua gravidade."
      },
      {
        name: "Frigio",
        shortName: "Phrygian",
        mood: "sombrio, comprimido, tenso",
        characteristic: "b2",
        chordColor: "m7",
        microcopy: "A segunda menor cria friccao imediata com a tonica."
      },
      {
        name: "Lidio",
        shortName: "Lydian",
        mood: "etereo, suspenso, cintilante",
        characteristic: "#4",
        chordColor: "maj7#11",
        microcopy: "A quarta aumentada remove o peso subdominante e abre o ceu harmonico."
      },
      {
        name: "Mixolidio",
        shortName: "Mixolydian",
        mood: "dominante, terroso, aberto",
        characteristic: "b7",
        chordColor: "7",
        microcopy: "A setima menor enfraquece a sensivel e desloca a gravidade."
      },
      {
        name: "Eolio",
        shortName: "Aeolian",
        mood: "melancolico, familiar, menor natural",
        characteristic: "b6",
        chordColor: "m7",
        microcopy: "A sexta menor reforca a sombra modal do centro."
      },
      {
        name: "Locrio",
        shortName: "Locrian",
        mood: "instavel, rarefeito, sem chao",
        characteristic: "b5",
        chordColor: "m7b5",
        microcopy: "A quinta diminuta retira o apoio estrutural da tonica."
      }
    ],
    progressionMap: {
      0: ["Imaj7 - VIm7 - IIm7 - V7", "Imaj7 - IVmaj7 - IIIm7 - V7"],
      1: ["Im7 - IV7 - bVIImaj7 - Im7", "Im7 - bIIImaj7 - IV7 - Im7"],
      2: ["Im7 - bIImaj7 - bVII7 - Im7", "Im7 - bVImaj7 - bIImaj7 - Im7"],
      3: ["Imaj7 - II7 - Vmaj7 - Imaj7", "Imaj7 - II7 - Imaj7 - VIIm7"],
      4: ["I7 - bVIImaj7 - IVmaj7 - I7", "I7 - Vm7 - IVmaj7 - I7"],
      5: ["Im7 - bVImaj7 - bVII7 - Im7", "Im7 - bIIImaj7 - bVII7 - Im7"],
      6: ["Im7b5 - bIImaj7 - bVm7 - Im7b5", "Im7b5 - bVIm7 - bIImaj7 - Im7b5"]
    }
  },
  harmonicMinor: {
    id: "harmonicMinor",
    name: "Menor Harmonica",
    signature: "Magenta dramatico, sensivel elevada e contraste teatral",
    accent: "#cb7cff",
    background: "from-fuchsia-500/20 via-violet-500/10 to-transparent",
    basePattern: [0, 2, 3, 5, 7, 8, 11],
    modes: [
      {
        name: "Menor Harmonica",
        shortName: "Harmonic Minor",
        mood: "dramatico, tonal, intenso",
        characteristic: "7",
        chordColor: "m(maj7)",
        microcopy: "A sensivel elevada cria uma gravidade tonal muito clara sobre um chao menor."
      },
      {
        name: "Locrio #6",
        shortName: "Locrian #6",
        mood: "fragil, misterioso, angular",
        characteristic: "#6",
        chordColor: "m7b5",
        microcopy: "A sexta elevada aparece dentro de uma estrutura ainda instavel."
      },
      {
        name: "Jonio #5",
        shortName: "Ionian #5",
        mood: "maior cintilante, expandido",
        characteristic: "#5",
        chordColor: "maj7#5",
        microcopy: "A quinta aumentada desloca a sensacao de estabilidade do modo maior."
      },
      {
        name: "Dorico #4",
        shortName: "Dorian #4",
        mood: "menor suspenso, elastico",
        characteristic: "#4",
        chordColor: "m7",
        microcopy: "A quarta aumentada injeta tensao aerea num corpo menor."
      },
      {
        name: "Frigio Dominante",
        shortName: "Phrygian Dominant",
        mood: "ardente, dominante, exotico",
        characteristic: "3 / b2",
        chordColor: "7",
        microcopy: "Terca maior e segunda menor convivem num eixo de altissima identidade."
      },
      {
        name: "Lidio #2",
        shortName: "Lydian #2",
        mood: "flutuante, cromatico, brilhante",
        characteristic: "#2",
        chordColor: "maj7#11",
        microcopy: "A segunda aumentada empurra o modo para um brilho pouco terrestre."
      },
      {
        name: "Superlocrio bb7",
        shortName: "Super Locrian bb7",
        mood: "maxima instabilidade, friccao extrema",
        characteristic: "bb7",
        chordColor: "dim7",
        microcopy: "Quase tudo tensiona a tonica: a gravidade existe, mas e turbulenta."
      }
    ],
    progressionMap: {
      0: ["Im(maj7) - IIm7b5 - V7 - Im(maj7)", "Im(maj7) - bVImaj7 - IVm7 - V7"],
      1: ["Im7b5 - bIImaj7 - bVII7 - Im7b5", "Im7b5 - bIIImaj7#5 - bIImaj7 - Im7b5"],
      2: ["Imaj7#5 - IVm(maj7) - VIm7 - Imaj7#5", "Imaj7#5 - II7 - IVm(maj7) - Imaj7#5"],
      3: ["Im7 - II7 - bIIImaj7#5 - Im7", "Im7 - VIm7b5 - II7 - Im7"],
      4: ["I7 - bIImaj7 - Vm(maj7) - I7", "I7 - bVII7 - bIImaj7 - I7"],
      5: ["Imaj7#11 - VIm7b5 - II7 - Imaj7#11", "Imaj7#11 - #IIm7b5 - VIm7b5 - Imaj7#11"],
      6: ["Idim7 - bII7 - bIVm7 - Idim7", "Idim7 - bVmaj7 - bII7 - Idim7"]
    }
  },
  melodicMinor: {
    id: "melodicMinor",
    name: "Menor Melodica",
    signature: "Ciano frio, sofisticacao moderna e tensao elegante",
    accent: "#58ddff",
    background: "from-cyan-500/20 via-blue-500/10 to-transparent",
    basePattern: [0, 2, 3, 5, 7, 9, 11],
    modes: [
      {
        name: "Menor Melodica",
        shortName: "Melodic Minor",
        mood: "menor moderno, refinado, flexivel",
        characteristic: "6 / 7",
        chordColor: "m(maj7)",
        microcopy: "A sexta e a setima naturais modernizam o eixo menor."
      },
      {
        name: "Dorico b2",
        shortName: "Dorian b2",
        mood: "escuro, movel, sofisticado",
        characteristic: "b2",
        chordColor: "m7",
        microcopy: "A segunda menor muda a entrada do modo, mas preserva mobilidade interna."
      },
      {
        name: "Lidio Aumentado",
        shortName: "Lydian Augmented",
        mood: "suspenso, luxuoso, cintilante",
        characteristic: "#4 / #5",
        chordColor: "maj7#5",
        microcopy: "Duas expansoes simultaneas mudam radicalmente a cor do maior."
      },
      {
        name: "Lidio Dominante",
        shortName: "Lydian Dominant",
        mood: "dominante luminoso, aberto",
        characteristic: "#4 / b7",
        chordColor: "7#11",
        microcopy: "A tensao dominante convive com um horizonte lidio."
      },
      {
        name: "Mixolidio b6",
        shortName: "Mixolydian b6",
        mood: "dominante escurecido, denso",
        characteristic: "b6",
        chordColor: "7",
        microcopy: "A sexta menor muda o perfume dominante sem retirar sua funcao."
      },
      {
        name: "Locrio #2",
        shortName: "Locrian #2",
        mood: "instavel com respiro, nervoso",
        characteristic: "#2",
        chordColor: "m7b5",
        microcopy: "O chao segue quebrado, mas a segunda maior abre uma fresta de clareza."
      },
      {
        name: "Alterado",
        shortName: "Altered",
        mood: "alta tensao, maxima friccao",
        characteristic: "b9 / #9 / b5 / #5",
        chordColor: "7alt",
        microcopy: "E uma orbita de instabilidade controlada em torno de um dominante."
      }
    ],
    progressionMap: {
      0: ["Im(maj7) - IIm7 - V7 - Im(maj7)", "Im(maj7) - IV7 - bVIImaj7#5 - V7"],
      1: ["Im7 - bIImaj7#5 - IV7 - Im7", "Im7 - bVII7 - bIImaj7#5 - Im7"],
      2: ["Imaj7#5 - II7 - III7 - Imaj7#5", "Imaj7#5 - VIm7b5 - III7 - Imaj7#5"],
      3: ["I7#11 - IIIm7b5 - VIm7 - I7#11", "I7#11 - bVIImaj7#5 - IIm7 - I7#11"],
      4: ["I7 - IIm7b5 - IVm(maj7) - I7", "I7 - bVImaj7#5 - IIm7b5 - I7"],
      5: ["Im7b5 - bII7 - IVm(maj7) - Im7b5", "Im7b5 - bVmaj7#5 - bII7 - Im7b5"],
      6: ["I7alt - bIImaj7#5 - IVm(maj7) - I7alt", "I7alt - bVmaj7#5 - bII7 - I7alt"]
    }
  }
};
