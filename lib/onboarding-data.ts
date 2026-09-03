export type Categoria = "Geografía" | "Historia" | "Cultura" | "Gastronomía" | "Naturaleza" | "Deportes";

export const CATEGORIAS: Categoria[] = [
  "Geografía",
  "Historia",
  "Cultura",
  "Gastronomía",
  "Naturaleza",
  "Deportes",
];

export type Dificultad = "facil" | "medio" | "dificil" | "experto";

export interface PreguntaTrivia {
  categoria: Categoria;
  pregunta: string;
  opciones: string[];
  correctaIndex: number;
  fuente: string;
  dificultad: Dificultad;
}

// Preguntas de Geografía verificadas contra datos estructurados (patrón definitivo:
// REST Countries / Wikidata, ver ESTADO.md — este set es la semilla real para el onboarding,
// no un banco final).
export const PREGUNTAS_COLOMBIA_NIVEL1: PreguntaTrivia[] = [
  {
    categoria: "Geografía",
    pregunta: "¿Cuál es la capital de Colombia?",
    opciones: ["Medellín", "Bogotá", "Cali", "Cartagena"],
    correctaIndex: 1,
    fuente: "REST Countries API",
    dificultad: "facil",
  },
  {
    categoria: "Geografía",
    pregunta: "¿Cuál es el río más largo de Colombia?",
    opciones: ["Río Cauca", "Río Magdalena", "Río Orinoco", "Río Atrato"],
    correctaIndex: 1,
    fuente: "Wikidata",
    dificultad: "medio",
  },
  {
    categoria: "Geografía",
    pregunta: "¿Qué cordillera atraviesa gran parte de Colombia?",
    opciones: ["Los Andes", "Las Rocosas", "Los Alpes", "El Himalaya"],
    correctaIndex: 0,
    fuente: "Wikidata",
    dificultad: "facil",
  },
];

export type Motivacion = "viajar" | "mente" | "competir";

export interface OnboardingState {
  v: 2;
  hookAcertado?: boolean;
  monedasGanadas?: number;
  motivacion?: Motivacion;
  categoriasFavoritas?: Categoria[]; // exactamente 2
  minutosDia?: 3 | 5 | 10;
  horaRecordatorio?: string;
  recordatorioActivado?: boolean;
}

const KEY = "onboarding_state_v2";

export function loadOnboardingState(): OnboardingState {
  if (typeof window === "undefined") return { v: 2 };
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return { v: 2 };
    const parsed = JSON.parse(raw);
    if (parsed?.v !== 2) return { v: 2 };
    return parsed as OnboardingState;
  } catch {
    return { v: 2 };
  }
}

export function saveOnboardingState(state: OnboardingState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}
