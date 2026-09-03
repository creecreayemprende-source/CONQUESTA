"use client";

import { useEffect, useState } from "react";

export function CountUp({ value, durationMs = 600, className }: { value: number; durationMs?: number; className?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    function tick(now: number) {
      const pct = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - pct, 3);
      setDisplay(Math.round(value * eased));
      if (pct < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={`tabular ${className ?? ""}`}>{display}</span>;
}
