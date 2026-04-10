import type { FamilyDefinition } from "../types/music";

export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const VIEW_OPTIONS = [
  { id: "orbit", label: "Orbit View", hint: "Estrutura geométrica da coleção" },
  { id: "constellation", label: "Constellation View", hint: "Mesma constelação, novo sol" },
  { id: "gravity", label: "Gravity View", hint: "Repouso, atração e centro tonal" },
  { id: "function", label: "Function View", hint: "Graus, tensões e função intervalar" },
  { id: "harmony", label: "Harmony View", hint: "Campo harmônico e progressões" }
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
    signature: "Halo azul elétrico, clareza editorial e arquitetura diatônica",
    accent: "#6992ff",
    background: "from-blue-500/20 via-cyan-400/10 to-transparent",
    basePattern: [0, 2, 4, 5, 7, 9, 11],
    modes: [
      {
        name: "Jônio",
        shortName: "Ionian",
        mood: "luminoso, estável, expansivo",
        characteristic: "7",
        chordColor: "maj7",
        microcopy: "A sensível empurra de volta para casa com máxima estabilidade."
      },
      {
        name: "Dórico",
        shortName: "Dorian",
        mood: "menor com impulso, móvel, sofisticado",
        characteristic: "6",
        chordColor: "m7",
        microcopy: "A sexta natural clareia um modo menor sem dissolver sua gravidade."
      },
      {
        name: "Frígio",
        shortName: "Phrygian",
        mood: "sombrio, comprimido, tenso",
        characteristic: "b2",
        chordColor: "m7",
        microcopy: "A segunda menor cria fricção imediata com a tônica."
      },
      {
        name: "Lídio",
        shortName: "Lydian",
        mood: "etéreo, suspenso, cintilante",
        characteristic: "#4",
        chordColor: "maj7#11",
        microcopy: "A quarta aumentada remove o peso subdominante e abre o céu harmônico."
      },
      {
        name: "Mixolídio",
        shortName: "Mixolydian",
        mood: "dominante, terroso, aberto",
        characteristic: "b7",
        chordColor: "7",
        microcopy: "A sétima menor enfraquece a sensível e desloca a gravidade."
      },
      {
        name: "Eólio",
        shortName: "Aeolian",
        mood: "melancólico, familiar, menor natural",
        characteristic: "b6",
        chordColor: "m7",
        microcopy: "A sexta menor reforça a sombra modal do centro."
      },
      {
        name: "Lócrio",
        shortName: "Locrian",
        mood: "instável, rarefeito, sem chão",
        characteristic: "b5",
        chordColor: "m7b5",
        microcopy: "A quinta diminuta retira o apoio estrutural da tônica."
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
    name: "Menor Harmônica",
    signature: "Magenta dramático, sensível elevada e contraste teatral",
    accent: "#cb7cff",
    background: "from-fuchsia-500/20 via-violet-500/10 to-transparent",
    basePattern: [0, 2, 3, 5, 7, 8, 11],
    modes: [
      {
        name: "Menor Harmônica",
        shortName: "Harmonic Minor",
        mood: "dramático, tonal, intenso",
        characteristic: "7",
        chordColor: "m(maj7)",
        microcopy: "A sensível elevada cria uma gravidade tonal muito clara sobre um chão menor."
      },
      {
        name: "Lócrio #6",
        shortName: "Locrian #6",
        mood: "frágil, misterioso, angular",
        characteristic: "#6",
        chordColor: "m7b5",
        microcopy: "A sexta elevada aparece dentro de uma estrutura ainda instável."
      },
      {
        name: "Jônio #5",
        shortName: "Ionian #5",
        mood: "maior cintilante, expandido",
        characteristic: "#5",
        chordColor: "maj7#5",
        microcopy: "A quinta aumentada desloca a sensação de estabilidade do modo maior."
      },
      {
        name: "Dórico #4",
        shortName: "Dorian #4",
        mood: "menor suspenso, elástico",
        characteristic: "#4",
        chordColor: "m7",
        microcopy: "A quarta aumentada injeta tensão aérea num corpo menor."
      },
      {
        name: "Frígio Dominante",
        shortName: "Phrygian Dominant",
        mood: "ardente, dominante, exótico",
        characteristic: "3 / b2",
        chordColor: "7",
        microcopy: "Terça maior e segunda menor convivem num eixo de altíssima identidade."
      },
      {
        name: "Lídio #2",
        shortName: "Lydian #2",
        mood: "flutuante, cromático, brilhante",
        characteristic: "#2",
        chordColor: "maj7#11",
        microcopy: "A segunda aumentada empurra o modo para um brilho pouco terrestre."
      },
      {
        name: "Superlócrio bb7",
        shortName: "Super Locrian bb7",
        mood: "máxima instabilidade, fricção extrema",
        characteristic: "bb7",
        chordColor: "dim7",
        microcopy: "Quase tudo tensiona a tônica: a gravidade existe, mas é turbulenta."
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
    name: "Menor Melódica",
    signature: "Ciano frio, sofisticação moderna e tensão elegante",
    accent: "#58ddff",
    background: "from-cyan-500/20 via-blue-500/10 to-transparent",
    basePattern: [0, 2, 3, 5, 7, 9, 11],
    modes: [
      {
        name: "Menor Melódica",
        shortName: "Melodic Minor",
        mood: "menor moderno, refinado, flexível",
        characteristic: "6 / 7",
        chordColor: "m(maj7)",
        microcopy: "A sexta e a sétima naturais modernizam o eixo menor."
      },
      {
        name: "Dórico b2",
        shortName: "Dorian b2",
        mood: "escuro, móvel, sofisticado",
        characteristic: "b2",
        chordColor: "m7",
        microcopy: "A segunda menor muda a entrada do modo, mas preserva mobilidade interna."
      },
      {
        name: "Lídio Aumentado",
        shortName: "Lydian Augmented",
        mood: "suspenso, luxuoso, cintilante",
        characteristic: "#4 / #5",
        chordColor: "maj7#5",
        microcopy: "Duas expansões simultâneas mudam radicalmente a cor do maior."
      },
      {
        name: "Lídio Dominante",
        shortName: "Lydian Dominant",
        mood: "dominante luminoso, aberto",
        characteristic: "#4 / b7",
        chordColor: "7#11",
        microcopy: "A tensão dominante convive com um horizonte lídio."
      },
      {
        name: "Mixolídio b6",
        shortName: "Mixolydian b6",
        mood: "dominante escurecido, denso",
        characteristic: "b6",
        chordColor: "7",
        microcopy: "A sexta menor muda o perfume dominante sem retirar sua função."
      },
      {
        name: "Lócrio #2",
        shortName: "Locrian #2",
        mood: "instável com respiro, nervoso",
        characteristic: "#2",
        chordColor: "m7b5",
        microcopy: "O chão segue quebrado, mas a segunda maior abre uma fresta de clareza."
      },
      {
        name: "Alterado",
        shortName: "Altered",
        mood: "alta tensão, máxima fricção",
        characteristic: "b9 / #9 / b5 / #5",
        chordColor: "7alt",
        microcopy: "É uma órbita de instabilidade controlada em torno de um dominante."
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
