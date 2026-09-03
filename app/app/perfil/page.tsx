"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/app-state-context";
import { progresoDePais, paisDesbloqueadoEnRuta, puedeJugarPais } from "@/lib/app-state";
import { PAISES_AMERICA } from "@/lib/countries-data";
import { rutaDelPais } from "@/lib/rutas-data";
import { Flame, Gem, Coins, LogOut, Settings, Volume2, VolumeX } from "lucide-react";
import { PassportStamp, type EstadoSello } from "@/components/app/PassportStamp";
import { supabaseBrowser } from "@/lib/supabase/client";

// Solo países con una Ruta real asignada pueden llegar a conquistarse alguna
// vez (`rutaDelPais`) — mostrar los demás en el pasaporte prometería contenido
// sin ningún camino de desbloqueo (bug real encontrado en la auditoría).
const PAISES_CON_RUTA = PAISES_AMERICA.filter((p) => rutaDelPais(p.nombre) !== undefined);

export default function PerfilPage() {
  const { state, setState, ready } = useAppState();
  const router = useRouter();

  if (!ready) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-4">
        <div className="h-24 animate-pulse rounded-2xl bg-surface-secondary" />
        <div className="h-40 animate-pulse rounded-2xl bg-surface-secondary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary font-display text-xl font-bold text-white">
          {state.nombre.charAt(0)}
        </span>
        <div>
          <h1 className="font-display text-lg font-bold text-txt-primary">{state.nombre}</h1>
          <p className="text-sm text-txt-secondary">Explorador · América</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border-default bg-surface-primary p-3">
          <Flame className="h-5 w-5 text-gold" strokeWidth={2.2} fill="var(--gold)" />
          <span className="font-display text-lg font-bold tabular text-txt-primary">{state.currentStreak}</span>
          <span className="text-xs text-txt-tertiary">Racha</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border-default bg-surface-primary p-3">
          <Coins className="h-5 w-5 text-gold" strokeWidth={2.2} />
          <span className="font-display text-lg font-bold tabular text-txt-primary">{state.coins}</span>
          <span className="text-xs text-txt-tertiary">Monedas</span>
        </div>
        <div className="flex flex-col items-center gap-1 rounded-xl border border-border-default bg-surface-primary p-3">
          <Gem className="h-5 w-5 text-brand-primary" strokeWidth={2.2} />
          <span className="font-display text-lg font-bold tabular text-txt-primary">{state.gems}</span>
          <span className="text-xs text-txt-tertiary">Gemas</span>
        </div>
      </div>

      <div className="rounded-2xl border border-border-default bg-surface-primary p-4">
        <h2 className="mb-3 font-display text-sm font-bold text-txt-primary">Tu pasaporte</h2>
        <div className="grid grid-cols-4 gap-3">
          {PAISES_CON_RUTA.map((p) => {
            // Estado real: conquistado (Reto Final aprobado) > desbloqueado
            // (le toca jugarlo ahora y no requiere Pro, o ya está en trial/Pro)
            // > requierePro (le toca en secuencia pero es de pago) > bloqueado
            // (el país anterior de su Ruta sin conquistar).
            const conquistado = progresoDePais(state, p.nombre).retoFinalCompletado;
            const secuenciaOk = paisDesbloqueadoEnRuta(state, p.nombre);
            const jugable = !conquistado && secuenciaOk && puedeJugarPais(state, p.nombre);
            const requierePro = !conquistado && secuenciaOk && !jugable;
            const estado: EstadoSello = conquistado
              ? "conquistado"
              : jugable
                ? "desbloqueado"
                : requierePro
                  ? "requierePro"
                  : "bloqueado";
            const sello = <PassportStamp codigo={p.codigo} estado={estado} />;
            return (
              <div key={p.codigo} className="flex flex-col items-center gap-1.5 text-center">
                {requierePro ? <Link href="/paywall">{sello}</Link> : sello}
                <span className="text-xs leading-tight text-txt-secondary">{p.nombre}</span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-primary p-3.5 text-sm font-medium text-txt-primary"
      >
        <Settings className="h-4 w-4 text-txt-tertiary" strokeWidth={2.2} />
        Ajustes de notificaciones
      </button>

      <button
        type="button"
        onClick={() => setState((s) => ({ ...s, musicaSilenciada: !s.musicaSilenciada }))}
        className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-primary p-3.5 text-sm font-medium text-txt-primary"
      >
        {state.musicaSilenciada ? (
          <VolumeX className="h-4 w-4 text-txt-tertiary" strokeWidth={2.2} />
        ) : (
          <Volume2 className="h-4 w-4 text-txt-tertiary" strokeWidth={2.2} />
        )}
        {state.musicaSilenciada ? "Sonido de fondo: silenciado" : "Sonido de fondo: activado"}
      </button>

      <button
        type="button"
        onClick={async () => {
          await supabaseBrowser().auth.signOut();
          router.push("/");
        }}
        className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-primary p-3.5 text-sm font-medium text-status-error"
      >
        <LogOut className="h-4 w-4" strokeWidth={2.2} />
        Cerrar sesión
      </button>
    </div>
  );
}
