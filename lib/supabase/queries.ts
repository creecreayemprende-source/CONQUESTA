import type { SupabaseClient } from "@supabase/supabase-js";
import type { Categoria } from "@/lib/onboarding-data";
import type { RondaId } from "@/lib/trivia-bank-types";
import {
  progresoPaisVacio,
  type AppState,
  type ProgresoCategoria,
  type ProgresoPais,
  type RondaEstado,
} from "@/lib/app-state";
import type { MembershipStatus } from "@/lib/membership-fsm";

interface ProfileRow {
  nombre: string;
  coins: number;
  gems: number;
  current_streak: number;
  longest_streak: number;
  last_active_on: string | null;
  categorias_favoritas: string[];
  trial_inicio_fecha: string | null;
  musica_silenciada: boolean;
  insignias_ganadas: string[];
  inventario_cincuenta: number;
  inventario_tiempo_extra: number;
  inventario_pista: number;
  membership_status: MembershipStatus;
  access_until: string | null;
  grace_ends_at: string | null;
  avatar_url: string | null;
  recordatorio_diario: boolean;
  hora_recordatorio: string | null;
  monedas_ganadas_total: number;
}

interface RondaRow {
  pais: string;
  categoria: string;
  ronda: string;
  completado: boolean;
  aciertos: number;
  total: number;
}

interface PaisRow {
  pais: string;
  reto_final_completado: boolean;
}

/** Trae el progreso real del jugador desde Supabase y lo arma con la misma
 * forma que `AppState` — así el resto de la app (pantallas, `useAppState`)
 * no necesita saber que ahora hay una base de datos real detrás. */
export async function fetchAppState(
  supabase: SupabaseClient,
  userId: string
): Promise<{ state: AppState; esNuevo: boolean }> {
  const [{ data: perfil }, { data: rondas }, { data: paises }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
    supabase.from("progreso_ronda").select("*").eq("user_id", userId),
    supabase.from("progreso_pais").select("*").eq("user_id", userId),
  ]);

  const progresoPorPais: Record<string, ProgresoPais> = {};

  ((paises ?? []) as PaisRow[]).forEach((p) => {
    progresoPorPais[p.pais] = {
      ...(progresoPorPais[p.pais] ?? progresoPaisVacio()),
      retoFinalCompletado: p.reto_final_completado,
    };
  });

  ((rondas ?? []) as RondaRow[]).forEach((r) => {
    const base = progresoPorPais[r.pais] ?? progresoPaisVacio();
    const categoria = r.categoria as Categoria;
    const catBase: ProgresoCategoria = base.categorias[categoria] ?? {
      rondas: {
        Explorador: { completado: false, aciertos: 0, total: 0 },
        Descubridor: { completado: false, aciertos: 0, total: 0 },
        Experto: { completado: false, aciertos: 0, total: 0 },
      },
    };
    progresoPorPais[r.pais] = {
      ...base,
      categorias: {
        ...base.categorias,
        [categoria]: {
          rondas: {
            ...catBase.rondas,
            [r.ronda as RondaId]: { completado: r.completado, aciertos: r.aciertos, total: r.total },
          },
        },
      },
    };
  });

  const p = perfil as ProfileRow | null;
  const esNuevo =
    !p ||
    (p.coins === 0 &&
      p.trial_inicio_fecha === null &&
      (rondas ?? []).length === 0 &&
      (paises ?? []).length === 0);

  const state: AppState = {
    v: 11,
    nombre: p?.nombre ?? "Explorador",
    avatarUrl: p?.avatar_url ?? null,
    recordatorioDiario: p?.recordatorio_diario ?? false,
    horaRecordatorio: p?.hora_recordatorio ?? null,
    coins: p?.coins ?? 0,
    monedasGanadasTotal: p?.monedas_ganadas_total ?? 0,
    gems: p?.gems ?? 0,
    currentStreak: p?.current_streak ?? 0,
    longestStreak: p?.longest_streak ?? 0,
    lastActiveOn: p?.last_active_on ?? null,
    progresoPorPais,
    retos: [],
    inventario: {
      cincuenta: p?.inventario_cincuenta ?? 0,
      tiempoExtra: p?.inventario_tiempo_extra ?? 0,
      pista: p?.inventario_pista ?? 0,
    },
    insigniasGanadas: p?.insignias_ganadas ?? [],
    categoriasFavoritas: (p?.categorias_favoritas ?? []) as Categoria[],
    trialInicioFecha: p?.trial_inicio_fecha ?? null,
    musicaSilenciada: p?.musica_silenciada ?? false,
    membershipStatus: p?.membership_status ?? "free",
    accessUntil: p?.access_until ?? null,
    graceEndsAt: p?.grace_ends_at ?? null,
  };

  return { state, esNuevo };
}

/** Guarda el AppState completo en Supabase: 1 update del perfil + upsert de
 * las filas de progreso que de verdad se han jugado (nunca filas vacías). */
export async function pushAppState(supabase: SupabaseClient, userId: string, state: AppState) {
  await supabase
    .from("profiles")
    .update({
      nombre: state.nombre,
      coins: state.coins,
      gems: state.gems,
      current_streak: state.currentStreak,
      longest_streak: state.longestStreak,
      last_active_on: state.lastActiveOn,
      categorias_favoritas: state.categoriasFavoritas,
      musica_silenciada: state.musicaSilenciada,
      insignias_ganadas: state.insigniasGanadas,
      inventario_cincuenta: state.inventario.cincuenta,
      inventario_tiempo_extra: state.inventario.tiempoExtra,
      inventario_pista: state.inventario.pista,
      avatar_url: state.avatarUrl,
      recordatorio_diario: state.recordatorioDiario,
      hora_recordatorio: state.horaRecordatorio,
      monedas_ganadas_total: state.monedasGanadasTotal,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId);

  const filasPais: { user_id: string; pais: string; reto_final_completado: boolean }[] = [];
  const filasRonda: {
    user_id: string;
    pais: string;
    categoria: string;
    ronda: string;
    completado: boolean;
    aciertos: number;
    total: number;
  }[] = [];

  Object.entries(state.progresoPorPais).forEach(([pais, progreso]) => {
    filasPais.push({ user_id: userId, pais, reto_final_completado: progreso.retoFinalCompletado });
    (Object.entries(progreso.categorias) as [Categoria, ProgresoCategoria][]).forEach(([categoria, cat]) => {
      (Object.entries(cat.rondas) as [RondaId, RondaEstado][]).forEach(([ronda, r]) => {
        if (!r.completado && r.total === 0) return;
        filasRonda.push({
          user_id: userId,
          pais,
          categoria,
          ronda,
          completado: r.completado,
          aciertos: r.aciertos,
          total: r.total,
        });
      });
    });
  });

  if (filasPais.length > 0) {
    await supabase.from("progreso_pais").upsert(filasPais, { onConflict: "user_id,pais" });
  }
  if (filasRonda.length > 0) {
    await supabase.from("progreso_ronda").upsert(filasRonda, { onConflict: "user_id,pais,categoria,ronda" });
  }
}

/** Único camino real para activar el trial de 7 días — lo fija el servidor
 * (RPC `iniciar_trial_gratis`, idempotente: nunca lo reinicia si ya se usó).
 * `trial_inicio_fecha` ya NO es una columna que el cliente pueda escribir
 * directo (ver 0004_fix_trial_reset_exploit.sql) — antes cualquiera podía
 * resetear su propio trial infinitas veces desde la consola del navegador. */
export async function iniciarTrialServidor(supabase: SupabaseClient): Promise<string | null> {
  const { data, error } = await supabase.rpc("iniciar_trial_gratis");
  if (error) return null;
  return (data as string | null) ?? null;
}

/** ¿Este estado local tiene algo de verdad para migrar a la cuenta recién
 * creada? (progreso hecho durante el onboarding, antes de haber iniciado sesión). */
export function tieneProgresoLocal(state: AppState): boolean {
  return (
    state.coins > 0 ||
    state.trialInicioFecha !== null ||
    state.insigniasGanadas.length > 0 ||
    Object.keys(state.progresoPorPais).length > 0
  );
}
