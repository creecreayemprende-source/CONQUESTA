export type NivelSopa = "Explorador" | "Descubridor" | "Experto";

export interface Celda {
  fila: number;
  col: number;
}

type Direccion = { dr: number; dc: number };

const DIRECCIONES: Record<string, Direccion> = {
  E: { dr: 0, dc: 1 },
  O: { dr: 0, dc: -1 },
  S: { dr: 1, dc: 0 },
  N: { dr: -1, dc: 0 },
  SE: { dr: 1, dc: 1 },
  NO: { dr: -1, dc: -1 },
  SO: { dr: 1, dc: -1 },
  NE: { dr: -1, dc: 1 },
};

/** Config de cada nivel: cuántas palabras, tiempo, y qué direcciones se
 * permiten al colocarlas — Explorador solo horizontal/vertical "hacia
 * adelante"; Descubridor suma diagonales; Experto suma las 4 direcciones
 * invertidas (palabras "al revés"). */
export const SOPA_NIVELES: Record<NivelSopa, { cantidad: number; segundos: number; direcciones: (keyof typeof DIRECCIONES)[] }> = {
  Explorador: { cantidad: 5, segundos: 90, direcciones: ["E", "S"] },
  Descubridor: { cantidad: 7, segundos: 80, direcciones: ["E", "S", "SE", "SO"] },
  Experto: { cantidad: 10, segundos: 80, direcciones: ["E", "S", "SE", "SO", "O", "N", "NO", "NE"] },
};

/** Ordena de más corta a más larga y recorta a la cantidad del nivel — así el
 * nivel fácil siempre trabaja con las palabras (y la rejilla) más chicas. */
export function palabrasPorNivel(palabras: string[], nivel: NivelSopa): string[] {
  return [...palabras].sort((a, b) => a.length - b.length).slice(0, SOPA_NIVELES[nivel].cantidad);
}

export interface SopaGenerada {
  grid: string[][];
  tamano: number;
  posiciones: Record<string, Celda[]>;
}

const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function rangoValido(largo: number, tamano: number, delta: number): { min: number; max: number } {
  if (delta === 0) return { min: 0, max: tamano - 1 };
  if (delta === 1) return { min: 0, max: tamano - largo };
  return { min: largo - 1, max: tamano - 1 };
}

function intentarColocar(
  grid: (string | null)[][],
  palabra: string,
  direcciones: (keyof typeof DIRECCIONES)[],
  tamano: number
): Celda[] | null {
  for (let intento = 0; intento < 300; intento++) {
    const dirKey = direcciones[Math.floor(Math.random() * direcciones.length)];
    const { dr, dc } = DIRECCIONES[dirKey];
    const rf = rangoValido(palabra.length, tamano, dr);
    const rc = rangoValido(palabra.length, tamano, dc);
    if (rf.max < rf.min || rc.max < rc.min) continue;

    const filaIni = rf.min + Math.floor(Math.random() * (rf.max - rf.min + 1));
    const colIni = rc.min + Math.floor(Math.random() * (rc.max - rc.min + 1));

    const celdas: Celda[] = [];
    let cabe = true;
    for (let i = 0; i < palabra.length; i++) {
      const fila = filaIni + dr * i;
      const col = colIni + dc * i;
      const actual = grid[fila][col];
      if (actual !== null && actual !== palabra[i]) {
        cabe = false;
        break;
      }
      celdas.push({ fila, col });
    }
    if (!cabe) continue;

    celdas.forEach((c, i) => {
      grid[c.fila][c.col] = palabra[i];
    });
    return celdas;
  }
  return null;
}

/** Genera la rejilla: coloca las palabras más largas primero (empacan mejor),
 * reintentando con una rejilla más grande si alguna no logra ubicarse. */
export function generarSopa(palabras: string[], nivel: NivelSopa): SopaGenerada {
  const direcciones = SOPA_NIVELES[nivel].direcciones;
  const masLarga = Math.max(...palabras.map((p) => p.length));
  const ordenadas = [...palabras].sort((a, b) => b.length - a.length);

  for (let intentoGrid = 0; intentoGrid < 25; intentoGrid++) {
    const tamano = Math.min(15, Math.max(masLarga + 2, 9) + Math.floor(intentoGrid / 4));
    const grid: (string | null)[][] = Array.from({ length: tamano }, () => Array(tamano).fill(null));
    const posiciones: Record<string, Celda[]> = {};
    let ok = true;

    for (const palabra of ordenadas) {
      const celdas = intentarColocar(grid, palabra, direcciones, tamano);
      if (!celdas) {
        ok = false;
        break;
      }
      posiciones[palabra] = celdas;
    }

    if (ok) {
      for (let f = 0; f < tamano; f++) {
        for (let c = 0; c < tamano; c++) {
          if (!grid[f][c]) grid[f][c] = ALFABETO[Math.floor(Math.random() * ALFABETO.length)];
        }
      }
      return { grid: grid as string[][], tamano, posiciones };
    }
  }
  throw new Error("No se pudo generar la sopa de letras con estas palabras");
}

/** Celdas en línea recta entre dos puntos (incluidos ambos extremos) — null
 * si no forman una línea horizontal, vertical o diagonal válida. */
export function celdasEntre(inicio: Celda, fin: Celda): Celda[] | null {
  const dr = fin.fila - inicio.fila;
  const dc = fin.col - inicio.col;
  if (dr === 0 && dc === 0) return null;
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;

  const pasos = Math.max(Math.abs(dr), Math.abs(dc));
  const sdr = Math.sign(dr);
  const sdc = Math.sign(dc);
  const celdas: Celda[] = [];
  for (let i = 0; i <= pasos; i++) {
    celdas.push({ fila: inicio.fila + sdr * i, col: inicio.col + sdc * i });
  }
  return celdas;
}

/** ¿La selección del jugador (en cualquiera de los dos sentidos) coincide con
 * dónde se colocó esta palabra? Así no importa desde qué extremo empiece a
 * tocar, incluso si la palabra quedó "al revés" en la rejilla. */
export function coincideSeleccion(seleccion: Celda[], posicionPalabra: Celda[]): boolean {
  if (seleccion.length !== posicionPalabra.length) return false;
  const igualDirecto = seleccion.every((c, i) => c.fila === posicionPalabra[i].fila && c.col === posicionPalabra[i].col);
  if (igualDirecto) return true;
  const invertida = [...posicionPalabra].reverse();
  return seleccion.every((c, i) => c.fila === invertida[i].fila && c.col === invertida[i].col);
}
