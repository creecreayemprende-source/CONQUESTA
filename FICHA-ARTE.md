# FICHA-ARTE.md — Conquesta

> Cosa juzgada (16/CLAUDE.md): no se redecide paleta/fuente/modo a mitad de proyecto.
> **ACTUALIZADA 2026-08-23**: el usuario pidió explícitamente (spec formal, dos instrucciones
> detalladas) reemplazar el modo oscuro navy por un modo CLARO — esta es la 2da vez que el
> modo se redecide en este proyecto (la 1ra fue la referencia inicial que fijó el oscuro).
> Se documenta como el contrato vigente; el modo oscuro queda como historial, no como opción activa.

## Dirección elegida: Ruta de Vuelo (+ pestañas de pasaporte) — ahora en modo CLARO
El viaje sigue como hilo conductor: el mapa mundial muestra una **ruta de vuelo punteada** que conecta los países ya visitados con el "próximo destino", y los continentes se navegan como **pestañas de pasaporte** (activa resaltada, bloqueadas con candado). Los países en las listas se presentan como **tarjetas de embarque** (código de 3 letras + bandera + barra de progreso). La página de país mantiene el resumen tipo embarque (código/niveles/estrellas) y el timbre "CONQUISTADO" se reserva para países 100% completados. Las tarjetas de Ruta (Mapa) usan degradados temáticos propios estilo tiquete aéreo (ver sección "Tarjetas de ruta" más abajo) — esos SÍ siguen siendo islas de color con texto blanco, independientes del modo claro/oscuro del resto de la app.

## Tokens finales (CSS — claro como `:root`, decisión 2026-08-23)

```css
:root {
  color-scheme: light;

  --surface-base: #F8FAFC;
  --surface-primary: #FFFFFF;
  --surface-secondary: #F1F5F9;
  --surface-tertiary: #F8FAFC;
  --surface-elevated: #FFFFFF;
  --surface-overlay: rgba(15,23,42,0.55);

  --text-primary: #0F172A;
  --text-secondary: #475569;
  --text-tertiary: #94A3B8;

  --border-default: #E2E8F0;
  --border-strong: #CBD5E1;
  --border-focus: #3B7DE8;

  --brand-primary: #3B7DE8;      /* progreso en curso, selección, acento principal */
  --brand-primary-hover: #2E6BD1;
  --brand-primary-soft: rgba(59,125,232,0.1);
  --brand-primary-text: #FFFFFF;

  --status-success: #2FA84A;     /* completado / país conquistado */
  --status-success-soft: rgba(47,168,74,0.1);
  --status-locked: #64748B;      /* país bloqueado */
  --gold: #D4A017;               /* estrellas, detalles de sello */

  /* Categorías (multicolor funcional, un hue por categoría) — ACTUALIZADO 2026-08-23:
     el usuario compartió el logo oficial de Conquesta (ícono circular de 6 piezas de
     color); estos tokens ahora SE DERIVAN de esas 6 piezas, cosa juzgada de nuevo. */
  --cat-geografia: #1E8A8C;   /* pieza teal del logo — montaña/río */
  --cat-historia: #2B4C7E;    /* pieza navy del logo — columnas/edificio */
  --cat-cultura: #7C4FC9;     /* pieza morada del logo — máscaras de teatro */
  --cat-gastronomia: #B5691F; /* oscurecida 2026-08-23: como TEXTO sobre blanco, el naranja
                                  original del logo (#E08A34) perdía contraste */
  --cat-naturaleza: #2F8A3D;  /* ídem — verde original #3FA34D oscurecido */
  --cat-deportes: #C23A3A;    /* ídem — rojo original #D64545 oscurecido */
  --silver: #6B7A8F;          /* podio del Ranking, 2do lugar */
  --bronze: #B4653F;          /* podio del Ranking, 3er lugar */

  /* Paletas temáticas por Ruta (2026-08-23) — tarjetas estilo tiquete aéreo del Mapa,
     siempre con texto blanco, sin importar el modo claro/oscuro de la app. */
  --ruta-andino-a: #2B4C7E; --ruta-andino-b: #C1694F;   /* azul andino → terracota */
  --ruta-tropico-a: #0E8E7D; --ruta-tropico-b: #14B8A6; /* esmeralda → turquesa caribe */
  --ruta-norte-a: #D4A017; --ruta-norte-b: #16305A;     /* dorado → azul profundo */

  --radius-md: 0.75rem;   /* 12px */
  --radius-lg: 1rem;      /* 16px botones/cards */
  --radius-xl: 1.125rem;  /* 18px cards de país */
  --radius-full: 9999px;  /* barras, pills, chips circulares */

  --font-display: 'Baloo 2', system-ui, sans-serif;
  --font-body: 'Nunito Sans', system-ui, sans-serif;

  --bg: var(--surface-base);
  --surface: var(--surface-primary);
  --text: var(--text-primary);
  --accent: var(--brand-primary);

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

## Dispositivo ownable
- **Ruta de vuelo**: línea punteada horizontal con nodos (verde=visitado, azul=actual, gris=bloqueado) + label "Próximo destino: [país]" — vive en el Mapa Mundial, dentro de la pestaña de continente activa.
- **Pestañas de pasaporte**: selector de continente con forma de pestaña superior (activa resaltada en `--surface-elevated`, bloqueadas con ícono de candado).
- **Tarjeta de embarque**: filas de país con borde punteado izquierdo + código de 3 letras (`COL`, `BRA`...) + bandera + barra de progreso.
- **Timbre de pasaporte**: círculo rotado (-12°) con borde discontinuo dorado/verde y texto "CONQUISTADO", superpuesto en la esquina de la foto del país — SOLO en países 100% completados.
- **Chips de categoría**: círculo de color pleno por categoría (6 categorías, cada una con su hue tomado del logo). Íconos Lucide fijados 2026-08-23: Historia=`Landmark`, Geografía=`Mountain`, Cultura=`Drama`, Gastronomía=`Soup`, Naturaleza=`Leaf`, Deportes=`Volleyball`.
- **Silueta de fondo del Mapa**: forma abstracta tipo continente, `--brand-primary` al 10% de opacidad, detrás de toda la pantalla `/app` — decorativa, no cartográfica.
- **Podio del Ranking**: top 3 con columnas de altura decreciente (oro/plata/bronce), corona sobre el 1er lugar.
- **Tarjetas de ruta estilo tiquete aéreo** (2026-08-23, `components/app/RouteBoardingPassCard.tsx`): muesca troquelada (2 círculos del color del contenedor padre, en la unión cuerpo/talón), separador punteado vertical, degradado temático por ruta (ver paletas arriba), secuencia de países en código de aeropuerto con ícono de avión (`COL ✈ PER ✈ CHL`). Bloqueada = patrón `repeating-linear-gradient` sobrio en vez de fondo plano.

> Nota de migración (2026-08-23): `--surface-inverse`/`--text-inverse` (la "tarjeta clara" que antes contrastaba con el navy oscuro del resto de la app) ahora apuntan a los mismos tokens primarios — con toda la app en modo claro, ese caso especial dejó de tener sentido. Se conservan los nombres solo por compatibilidad con el código existente.

## Íconos — nota de cumplimiento
Los mockups de exploración (`direcciones-abc.html`, `direcciones-combo.html`) usaron emojis como marcador rápido de posición para acelerar la comparación visual. **Esto NO se traslada al código real**: en la construcción de pantallas de Conquesta, todo ícono va en SVG de librería (Lucide/Phosphor) dentro de su chip de color — regla de `DESIGN-CORE.md`, sin excepción.

## Registro anti-repetición
MindClash usó Opción G "Liga Solar" (violeta `#5B4FE0`, claro, Manrope+Karla). Conquesta usa modo oscuro navy + azul/verde — sin conflicto de dirección entre proyectos del SO.

## Pendiente
Construir las pantallas reales (Sesión 2 → resto: mapa de rutas `/` → onboarding → paywall → login → app) con este contrato. Antes de eso: completar el resto de la Sesión 1 (FICHA-AVATAR.md, monetización, arquitectura) si aún no se ha hecho para Conquesta.
