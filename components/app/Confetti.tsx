export function Confetti() {
  const piezas = Array.from({ length: 28 });
  const colores = ["var(--brand-primary)", "var(--gold)", "var(--status-success)", "var(--cat-cultura)"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {piezas.map((_, i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const duration = 1.4 + Math.random() * 0.9;
        const color = colores[i % colores.length];
        return (
          <span
            key={i}
            className="absolute top-0 h-2 w-2 rounded-full"
            style={{
              left: `${left}%`,
              backgroundColor: color,
              animation: `conquesta-caer ${duration}s ease-in ${delay}s forwards`,
            }}
          />
        );
      })}
      <style>{`@keyframes conquesta-caer { 0% { transform: translateY(-10px) rotate(0deg); opacity: 1 } 100% { transform: translateY(560px) rotate(340deg); opacity: 0 } }`}</style>
    </div>
  );
}
