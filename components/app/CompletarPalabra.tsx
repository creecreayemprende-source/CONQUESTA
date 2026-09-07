"use client";

import { useEffect, useRef, useState } from "react";
import { normalizarLetra } from "@/lib/ahorcado-data";

const ALFABETO = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");
const ERRORES_MAX = 5;

/** Pregunta en formato "completar la palabra" (estilo Ahorcado): en vez de
 * elegir entre 4 opciones, se adivina letra por letra la respuesta. Mismo
 * mecanismo de aciertos/errores que el resto del juego — llama a `onResuelto`
 * UNA vez, con el resultado final (true = la completó a tiempo). */
export function CompletarPalabra({ respuesta, onResuelto }: { respuesta: string; onResuelto: (acierto: boolean) => void }) {
  const [letrasUsadas, setLetrasUsadas] = useState<string[]>([]);
  const resueltoRef = useRef(false);

  const letrasRespuesta = normalizarLetra(respuesta)
    .split("")
    .filter((c) => c !== " " && /[A-ZÑ]/.test(c));
  const letrasUnicas = Array.from(new Set(letrasRespuesta));
  const errores = letrasUsadas.filter((l) => !letrasUnicas.includes(l)).length;
  const completada = letrasUnicas.every((l) => letrasUsadas.includes(l));
  const perdida = errores >= ERRORES_MAX;

  useEffect(() => {
    if (resueltoRef.current) return;
    if (completada || perdida) {
      resueltoRef.current = true;
      const t = setTimeout(() => onResuelto(completada), 700);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completada, perdida]);

  function elegirLetra(letra: string) {
    if (letrasUsadas.includes(letra) || completada || perdida) return;
    setLetrasUsadas((prev) => [...prev, letra]);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap justify-center gap-1.5">
        {normalizarLetra(respuesta)
          .split("")
          .map((ch, i) =>
            ch === " " ? (
              <span key={i} className="w-3" />
            ) : (
              <span
                key={i}
                className={`flex h-9 w-7 items-center justify-center border-b-2 font-display text-lg font-bold uppercase ${
                  letrasUsadas.includes(ch) || perdida
                    ? letrasUnicas.includes(ch)
                      ? "border-status-success text-txt-primary"
                      : "border-border-strong text-txt-primary"
                    : "border-border-strong text-transparent"
                }`}
              >
                {letrasUsadas.includes(ch) || perdida ? respuesta[i] : "_"}
              </span>
            )
          )}
      </div>

      <p className="text-center text-xs font-semibold text-txt-tertiary">Errores: {Math.min(errores, ERRORES_MAX)}/{ERRORES_MAX}</p>

      <div className="grid grid-cols-7 gap-1.5">
        {ALFABETO.map((letra) => {
          const usada = letrasUsadas.includes(letra);
          const acierto = usada && letrasUnicas.includes(letra);
          return (
            <button
              key={letra}
              type="button"
              onClick={() => elegirLetra(letra)}
              disabled={usada || completada || perdida}
              className={`flex h-9 items-center justify-center rounded-md text-xs font-bold transition-colors duration-150 ease-out ${
                usada
                  ? acierto
                    ? "bg-status-success-soft text-status-success"
                    : "bg-status-error-soft text-status-error"
                  : "bg-surface-secondary text-txt-primary"
              }`}
            >
              {letra}
            </button>
          );
        })}
      </div>
    </div>
  );
}
