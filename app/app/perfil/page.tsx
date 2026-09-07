"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppState } from "@/lib/app-state-context";
import { progresoDePais, paisDesbloqueadoEnRuta, puedeJugarPais } from "@/lib/app-state";
import { PAISES_AMERICA } from "@/lib/countries-data";
import { rutaDelPais } from "@/lib/rutas-data";
import { Flame, Gem, Coins, LogOut, Settings, Volume2, VolumeX, Camera, Pencil, Check } from "lucide-react";
import { PassportStamp, type EstadoSello } from "@/components/app/PassportStamp";
import { SouvenirVitrina } from "@/components/app/SouvenirVitrina";
import { supabaseBrowser } from "@/lib/supabase/client";
import { subirAvatar } from "@/lib/supabase/storage";

// Solo países con una Ruta real asignada pueden llegar a conquistarse alguna
// vez (`rutaDelPais`) — mostrar los demás en el pasaporte prometería contenido
// sin ningún camino de desbloqueo (bug real encontrado en la auditoría).
const PAISES_CON_RUTA = PAISES_AMERICA.filter((p) => rutaDelPais(p.nombre) !== undefined);

export default function PerfilPage() {
  const { state, setState, ready } = useAppState();
  const router = useRouter();
  const inputFotoRef = useRef<HTMLInputElement>(null);
  const [subiendoFoto, setSubiendoFoto] = useState(false);
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nombreBorrador, setNombreBorrador] = useState("");

  if (!ready) {
    return (
      <div className="flex flex-col gap-4 px-4 pt-4">
        <div className="h-24 animate-pulse rounded-2xl bg-surface-secondary" />
        <div className="h-40 animate-pulse rounded-2xl bg-surface-secondary" />
      </div>
    );
  }

  async function subirFoto(e: React.ChangeEvent<HTMLInputElement>) {
    const archivo = e.target.files?.[0];
    e.target.value = ""; // permite volver a elegir el mismo archivo después
    if (!archivo) return;
    setSubiendoFoto(true);
    const supabase = supabaseBrowser();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const url = await subirAvatar(supabase, user.id, archivo);
      if (url) setState((s) => ({ ...s, avatarUrl: url }));
    }
    setSubiendoFoto(false);
  }

  function guardarNombre() {
    const limpio = nombreBorrador.trim();
    if (limpio) setState((s) => ({ ...s, nombre: limpio }));
    setEditandoNombre(false);
  }

  return (
    <div className="flex flex-col gap-4 px-4 pt-4">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => inputFotoRef.current?.click()}
          disabled={subiendoFoto}
          aria-label="Cambiar foto de perfil"
          className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-primary font-display text-xl font-bold text-white"
        >
          {state.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- foto subida por el usuario, no un asset local optimizable.
            <img src={state.avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            state.nombre.charAt(0)
          )}
          <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-150 hover:opacity-100">
            <Camera className="h-5 w-5 text-white" strokeWidth={2.2} />
          </span>
        </button>
        <input ref={inputFotoRef} type="file" accept="image/*" className="hidden" onChange={subirFoto} />

        <div className="min-w-0 flex-1">
          {editandoNombre ? (
            <div className="flex items-center gap-2">
              <input
                autoFocus
                value={nombreBorrador}
                onChange={(e) => setNombreBorrador(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && guardarNombre()}
                maxLength={24}
                className="h-9 min-w-0 flex-1 rounded-lg border border-border-strong bg-surface-primary px-2 font-display text-base font-bold text-txt-primary outline-none focus-visible:border-brand-primary"
              />
              <button
                type="button"
                onClick={guardarNombre}
                aria-label="Guardar nombre"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white"
              >
                <Check className="h-4 w-4" strokeWidth={2.4} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setNombreBorrador(state.nombre);
                setEditandoNombre(true);
              }}
              className="flex items-center gap-1.5 font-display text-lg font-bold text-txt-primary"
            >
              {state.nombre}
              <Pencil className="h-3.5 w-3.5 text-txt-tertiary" strokeWidth={2.2} />
            </button>
          )}
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

      <SouvenirVitrina
        paisesConquistados={PAISES_CON_RUTA.filter((p) => progresoDePais(state, p.nombre).retoFinalCompletado).map(
          (p) => p.nombre
        )}
      />

      <Link
        href="/app/perfil/notificaciones"
        className="flex items-center gap-3 rounded-xl border border-border-default bg-surface-primary p-3.5 text-sm font-medium text-txt-primary"
      >
        <Settings className="h-4 w-4 text-txt-tertiary" strokeWidth={2.2} />
        Ajustes de notificaciones
      </Link>

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
