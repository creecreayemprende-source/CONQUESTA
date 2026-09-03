"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { loadAppState, saveAppState, type AppState } from "@/lib/app-state";
import { supabaseBrowser } from "@/lib/supabase/client";
import { fetchAppState, pushAppState, tieneProgresoLocal } from "@/lib/supabase/queries";

interface Ctx {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  ready: boolean;
}

const AppStateContext = createContext<Ctx | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [ready, setReady] = useState(false);
  const userIdRef = useRef<string | null>(null);

  // Al montar: si hay sesión real, el progreso de Supabase manda (o, si la
  // cuenta es nueva y el onboarding ya dejó progreso en este navegador, ese
  // progreso local se sube una sola vez a la cuenta recién creada).
  useEffect(() => {
    let cancelado = false;
    (async () => {
      const supabase = supabaseBrowser();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelado) return;

      if (!user) {
        setState(loadAppState());
        setReady(true);
        return;
      }

      userIdRef.current = user.id;
      const local = loadAppState();
      const { state: remoto, esNuevo } = await fetchAppState(supabase, user.id);
      if (cancelado) return;

      if (esNuevo && tieneProgresoLocal(local)) {
        await pushAppState(supabase, user.id, local);
        setState(local);
      } else {
        setState(remoto);
        saveAppState(remoto);
      }
      setReady(true);
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  // Cache local inmediata (misma que antes) — ayuda a que la app cargue rápido
  // aunque haya usuario real, y sigue siendo la única fuente antes de login.
  useEffect(() => {
    if (ready) saveAppState(state);
  }, [state, ready]);

  // Si hay sesión real, cada cambio de progreso se refleja en Supabase
  // (con un pequeño debounce para no mandar una escritura por cada tecla/tap).
  useEffect(() => {
    if (!ready || !userIdRef.current) return;
    const id = userIdRef.current;
    const t = setTimeout(() => {
      pushAppState(supabaseBrowser(), id, state).catch(() => {
        // Sin conexión o error transitorio: el cambio queda a salvo en
        // localStorage (guardado arriba) y se reintentará en el próximo cambio.
      });
    }, 800);
    return () => clearTimeout(t);
  }, [state, ready]);

  return <AppStateContext.Provider value={{ state, setState, ready }}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState debe usarse dentro de AppStateProvider");
  return ctx;
}
