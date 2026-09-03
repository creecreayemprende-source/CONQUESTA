"use client";

import { useEffect, useRef } from "react";
import { useAppState } from "@/lib/app-state-context";

const VOLUMEN = 0.16; // bajo, de fondo — nunca debe competir con los sonidos de acierto/victoria
const SRC = "/audio/ambiente-viaje.mp3";
// Flag manual (no una comprobación en runtime): cualquier intento de detectar
// si el archivo existe desde el navegador —incluida una petición HEAD— igual
// queda logueado como error 404 en la consola del navegador, sin que el código
// de la app pueda evitarlo. Pista real ya integrada: "Marimba Tropical African
// Travel Game" de Denis Pavlov (Pixabay) — comprimida de 256→128kbps.
const PISTA_DISPONIBLE = true;

/** Loop ambiental de fondo mientras se navega la app — silenciable, con la
 * preferencia guardada en AppState. Vive montado una sola vez en el layout de
 * /app para no reiniciarse al cambiar de pantalla. Los navegadores bloquean
 * el autoplay CON sonido hasta el primer gesto del usuario: si el primer
 * intento falla (NotAllowedError), reintenta en el próximo click/tap. */
export function AmbientMusic() {
  const { state, ready } = useAppState();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!ready || !PISTA_DISPONIBLE) return;
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = VOLUMEN;

    if (state.musicaSilenciada) {
      audio.pause();
      return;
    }

    function intentarReproducir() {
      audio?.play().catch(() => {
        document.addEventListener("click", intentarReproducir, { once: true });
        document.addEventListener("touchstart", intentarReproducir, { once: true });
      });
    }
    intentarReproducir();

    return () => {
      document.removeEventListener("click", intentarReproducir);
      document.removeEventListener("touchstart", intentarReproducir);
    };
  }, [ready, state.musicaSilenciada]);

  if (!PISTA_DISPONIBLE) return null;

  return <audio ref={audioRef} src={SRC} loop preload="auto" />;
}
