"use client";

import { useRef } from "react";

/**
 * Sonidos generados con Web Audio API (osciladores) — sin archivos de audio
 * externos ni licencias que gestionar. Tonos cortos, no bloqueantes.
 */
export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  function getCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctxRef.current = new AudioCtx();
    }
    return ctxRef.current;
  }

  function tone(freq: number, durationMs: number, delayMs = 0, type: OscillatorType = "sine", peakGain = 0.15) {
    const ctx = getCtx();
    if (!ctx) return;
    const start = ctx.currentTime + delayMs / 1000;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(peakGain, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + durationMs / 1000);
    osc.connect(gain).connect(ctx.destination);
    osc.start(start);
    osc.stop(start + durationMs / 1000 + 0.02);
  }

  return {
    playCorrect: () => {
      tone(660, 120, 0);
      tone(880, 160, 90);
    },
    playIncorrect: () => {
      tone(220, 220, 0, "sawtooth", 0.12);
    },
    playVictoria: () => {
      tone(523, 130, 0);
      tone(659, 130, 120);
      tone(784, 130, 240);
      tone(1047, 260, 360);
    },
    playTick: () => {
      tone(1000, 40, 0, "square", 0.05);
    },
    playTiempoAgotado: () => {
      tone(180, 350, 0, "sawtooth", 0.12);
    },
  };
}
