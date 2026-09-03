import type { Categoria } from "./onboarding-data";
import { TOTAL_ETAPAS_POR_PAIS, categoriasDelPais, PAISES_AMERICA } from "./countries-data";
import type { RondaId } from "./trivia-bank";
import { RONDAS } from "./trivia-bank";
import { RUTAS_AMERICA, rutaDelPais, type Ruta } from "./rutas-data";
import { hasFullAccess, type MembershipStatus } from "./membership-fsm";

export interface RondaEstado {
  completado: boolean;
  aciertos: number;
  total: number;
}

export interface ProgresoCategoria {
  rondas: Record<RondaId, RondaEstado>;
}

export interface ProgresoPais {
  categorias: Record<Categoria, ProgresoCategoria>;
  retoFinalCompletado: boolean;
}

export interface Reto {
  id: string;
  rival: string;
  pais: string;
  estado: "pendiente_tu_turno" | "esperando_rival" | "ganaste" | "perdiste";
  puntajeRival?: number;
  puntajeTuyo?: number;
}

/** Ayudas compradas en la tienda, pendientes de usar en un reto. */
export interface Inventario {
  cincuenta: number; // elimina 2 opciones incorrectas
  tiempoExtra: number; // +10 segundos al cronómetro
  pista: number; // resalta la respuesta correcta
}

export interface AppState {
  v: 8;
  nombre: string;
  coins: number;
  gems: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveOn: string | null;
  progresoPorPais: Record<string, ProgresoPais>;
  retos: Reto[];
  inventario: Inventario;
  insigniasGanadas: string[]; // ids de Ruta cuya insignia ya se ganó
  categoriasFavoritas: Categoria[]; // elegidas en el onboarding, para personalizar el orden de categorías
  trialInicioFecha: string | null; // fecha (YYYY-MM-DD) en que activó la prueba Pro de 7 días
  musicaSilenciada: boolean; // preferencia guardada del loop ambiental de fondo
  // Membresía real (Sesión 6): estos 3 campos solo los escribe el webhook de
  // Hotmart en el servidor — el navegador nunca los puede editar (columnas
  // bloqueadas por permiso en la base de datos, ver 0003_hotmart_membership.sql).
  membershipStatus: MembershipStatus;
  accessUntil: string | null; // ISO — hasta cuándo vale el acceso si canceló
  graceEndsAt: string | null; // ISO — hasta cuándo hay gracia si el pago falló
}

const KEY = "conquesta_app_state_v8";

function rondaVacia(): RondaEstado {
  return { completado: false, aciertos: 0, total: 0 };
}

function categoriaVacia(): ProgresoCategoria {
  return { rondas: { Explorador: rondaVacia(), Descubridor: rondaVacia(), Experto: rondaVacia() } };
}

export function progresoPaisVacio(): ProgresoPais {
  const categorias = {} as Record<Categoria, ProgresoCategoria>;
  categoriasDelPais().forEach((c) => {
    categorias[c] = categoriaVacia();
  });
  return { categorias, retoFinalCompletado: false };
}

// Estado limpio de verdad — antes venía con 75 monedas y la ronda Explorador de
// Geografía ya "completada" de fábrica (para que las demos se vieran bonitas).
// Ahora que el onboarding es el que de verdad otorga las primeras monedas y el
// primer sello (ver aplicarRecompensaOnboarding), un progreso falso pre-cargado
// quedaría inconsistente con lo que el usuario en verdad jugó.
function estadoInicial(): AppState {
  return {
    v: 8,
    nombre: "Sofía",
    coins: 0,
    gems: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveOn: null,
    progresoPorPais: {},
    // Los retos 1 a 1 contra amigos necesitan backend real (Supabase, Sesión 6)
    // para sincronizar turnos entre dos personas — hasta entonces, sin datos de
    // mentira que aparenten una función que no existe todavía.
    retos: [],
    inventario: { cincuenta: 0, tiempoExtra: 0, pista: 0 },
    insigniasGanadas: [],
    categoriasFavoritas: [],
    trialInicioFecha: null,
    musicaSilenciada: false,
    membershipStatus: "free",
    accessUntil: null,
    graceEndsAt: null,
  };
}

export function loadAppState(): AppState {
  if (typeof window === "undefined") return estadoInicial();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return estadoInicial();
    const parsed = JSON.parse(raw);
    if (parsed?.v !== 8) return estadoInicial();
    return parsed as AppState;
  } catch {
    return estadoInicial();
  }
}

export function saveAppState(state: AppState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(state));
}

export function progresoDePais(state: AppState, pais: string): ProgresoPais {
  return state.progresoPorPais[pais] ?? progresoPaisVacio();
}

/** Una categoría está al 100% solo cuando completó las 3 rondas (Explorador→Descubridor→Experto). */
export function categoriaCompleta100(progreso: ProgresoCategoria): boolean {
  return progreso.rondas.Explorador.completado && progreso.rondas.Descubridor.completado && progreso.rondas.Experto.completado;
}

export function todasLasCategoriasCompletas(progresoPais: ProgresoPais): boolean {
  return categoriasDelPais().every((c) => categoriaCompleta100(progresoPais.categorias[c]));
}

/** Ronda desbloqueada: Explorador siempre; las demás requieren la anterior completada. */
export function rondaDesbloqueada(progresoCategoria: ProgresoCategoria, ronda: RondaId): boolean {
  if (ronda === "Explorador") return true;
  if (ronda === "Descubridor") return progresoCategoria.rondas.Explorador.completado;
  return progresoCategoria.rondas.Descubridor.completado;
}

const UMBRAL_APROBACION = 0.8; // 80% de aciertos para aprobar una ronda

export function rondaAprobada(aciertos: number, total: number): boolean {
  return total > 0 && aciertos / total >= UMBRAL_APROBACION;
}

/** ¿Este país ya está desbloqueado dentro de su ruta? El primer país de la ruta
 * siempre está abierto; los demás requieren que el país anterior de la ruta
 * haya conquistado su Reto Final (desbloqueo secuencial: Colombia → Perú → Chile). */
export function paisDesbloqueadoEnRuta(state: AppState, pais: string): boolean {
  const ruta = rutaDelPais(pais);
  if (!ruta) return false;
  // El primer país de una Ruta no está automáticamente desbloqueado si la
  // Ruta en sí sigue bloqueada (requiere la insignia de la Ruta anterior) —
  // antes esto no se validaba aquí, así que Brasil/México (primeros países
  // de Rutas 2/3, aún bloqueadas) se calculaban como "desbloqueados".
  if (!rutaDesbloqueada(state, ruta)) return false;
  const posicion = ruta.paises.indexOf(pais);
  if (posicion <= 0) return true;
  const paisAnterior = ruta.paises[posicion - 1];
  return progresoDePais(state, paisAnterior).retoFinalCompletado;
}

/** ¿Esta ruta está desbloqueada? La primera ruta del continente siempre está abierta;
 * las siguientes requieren haber ganado la insignia de la ruta anterior. */
export function rutaDesbloqueada(state: AppState, ruta: Ruta): boolean {
  const posicion = RUTAS_AMERICA.indexOf(ruta);
  if (posicion <= 0) return true;
  const rutaAnterior = RUTAS_AMERICA[posicion - 1];
  return state.insigniasGanadas.includes(rutaAnterior.id);
}

/** Una ruta está completa cuando los 3 países que la componen conquistaron su Reto Final. */
export function rutaCompleta(state: AppState, ruta: Ruta): boolean {
  return ruta.paises.every((p) => progresoDePais(state, p).retoFinalCompletado);
}

/** Progreso 0-100 de una ruta: promedio del % de cada uno de sus 3 países. */
export function pctRuta(state: AppState, ruta: Ruta): number {
  const total = ruta.paises.reduce((acc, p) => acc + pctPais(progresoDePais(state, p)), 0);
  return Math.round(total / ruta.paises.length);
}

/** Si al conquistar `pais` se completó su ruta, otorga la insignia (idempotente). */
export function otorgarInsigniaSiCorresponde(state: AppState, pais: string): AppState {
  const ruta = rutaDelPais(pais);
  if (!ruta || state.insigniasGanadas.includes(ruta.id)) return state;
  if (!rutaCompleta(state, ruta)) return state;
  return { ...state, insigniasGanadas: [...state.insigniasGanadas, ruta.id] };
}

export function pctPais(progreso: ProgresoPais): number {
  let etapas = 0;
  categoriasDelPais().forEach((c) => {
    const r = progreso.categorias[c].rondas;
    if (r.Explorador.completado) etapas++;
    if (r.Descubridor.completado) etapas++;
    if (r.Experto.completado) etapas++;
  });
  if (progreso.retoFinalCompletado) etapas++;
  return Math.round((etapas / TOTAL_ETAPAS_POR_PAIS) * 100);
}

function diferenciaDias(a: string, b: string): number {
  const msPorDia = 1000 * 60 * 60 * 24;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPorDia);
}

export function registrarActividad(state: AppState, hoy: string): AppState {
  if (state.lastActiveOn === hoy) return state;
  if (state.lastActiveOn === null) {
    return { ...state, currentStreak: 1, longestStreak: Math.max(1, state.longestStreak), lastActiveOn: hoy };
  }
  const dias = diferenciaDias(state.lastActiveOn, hoy);
  if (dias === 1) {
    const nueva = state.currentStreak + 1;
    return { ...state, currentStreak: nueva, longestStreak: Math.max(nueva, state.longestStreak), lastActiveOn: hoy };
  }
  return { ...state, currentStreak: 1, lastActiveOn: hoy };
}

/** Aplica al estado REAL de la app lo que el usuario ganó/eligió durante el
 * onboarding (monedas del "hook" inicial, categorías favoritas, primer día de
 * racha) — antes el onboarding vivía en su propio localStorage aislado y nunca
 * tocaba el `AppState` real, así que sus recompensas no se sentían de verdad
 * cuando el usuario llegaba al Mapa. */
export function aplicarRecompensaOnboarding(
  state: AppState,
  { monedasGanadas, categoriasFavoritas }: { monedasGanadas: number; categoriasFavoritas: Categoria[] }
): AppState {
  const hoy = new Date().toISOString().slice(0, 10);
  const conRacha = registrarActividad(state, hoy);
  return { ...conRacha, coins: conRacha.coins + monedasGanadas, categoriasFavoritas };
}

const DURACION_TRIAL_DIAS = 7;

/** Día actual del trial (1-indexado) o null si nunca lo activó. No se topa en 7 —
 * un valor >7 significa que el trial ya venció (lo usa `estaEnTrial` para cortar). */
export function diaDeTrial(state: AppState): number | null {
  if (!state.trialInicioFecha) return null;
  const hoy = new Date().toISOString().slice(0, 10);
  return diferenciaDias(state.trialInicioFecha, hoy) + 1;
}

export function estaEnTrial(state: AppState): boolean {
  const dia = diaDeTrial(state);
  return dia !== null && dia >= 1 && dia <= DURACION_TRIAL_DIAS;
}

/** ¿Tiene acceso Pro por una membresía REAL de Hotmart? (`membershipStatus` solo
 * lo escribe el webhook, nunca el navegador — ver `apply_hotmart_event`). */
export function tieneAccesoProReal(state: AppState): boolean {
  const now = new Date();
  const accessUntil = state.accessUntil ? new Date(state.accessUntil) : null;
  const graceEndsAt = state.graceEndsAt ? new Date(state.graceEndsAt) : null;
  return hasFullAccess(state.membershipStatus, now, accessUntil, graceEndsAt);
}

/** Pro = trial local de 7 días (gancho de onboarding) O membresía real pagada
 * por Hotmart. Cualquiera de las dos basta. */
export function esPro(state: AppState): boolean {
  return estaEnTrial(state) || tieneAccesoProReal(state);
}

/** Activa la prueba Pro de 7 días (idempotente: si ya estaba activada, no la reinicia). */
export function iniciarTrial(state: AppState): AppState {
  if (state.trialInicioFecha) return state;
  return { ...state, trialInicioFecha: new Date().toISOString().slice(0, 10) };
}

/** ¿Se puede jugar este país AHORA? Combina las 2 reglas reales: el desbloqueo
 * secuencial de su Ruta (`paisDesbloqueadoEnRuta`) y si requiere Pro (`esGratis`
 * en `countries-data.ts`) cuando el usuario no está en trial/Pro. */
export function puedeJugarPais(state: AppState, pais: string): boolean {
  if (!paisDesbloqueadoEnRuta(state, pais)) return false;
  const info = PAISES_AMERICA.find((p) => p.nombre === pais);
  if (!info) return false;
  return info.esGratis || esPro(state);
}

/** Reordena las categorías de un país poniendo primero las favoritas del
 * usuario — la personalización real que el onboarding le prometió. */
export function categoriasOrdenadasPorFavoritas(categorias: Categoria[], favoritas: Categoria[]): Categoria[] {
  if (favoritas.length === 0) return categorias;
  return [...categorias].sort((a, b) => {
    const fa = favoritas.includes(a) ? 0 : 1;
    const fb = favoritas.includes(b) ? 0 : 1;
    return fa - fb;
  });
}

export { RONDAS };
