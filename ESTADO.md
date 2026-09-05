# ESTADO — Conquesta

## Fase actual
Fase 0/1 en curso — identidad visual CERRADA. Falta completar el resto de la Sesión 1 (avatar, monetización, arquitectura) antes de empezar a construir pantallas.

## Qué es la app
"Viaja, aprende y conquista el mundo": trivia de geografía/historia/cultura/gastronomía/naturaleza organizada como un viaje por un mapa mundial — el usuario avanza por continentes → países → categorías → reto final, desbloqueando países y coleccionándolos como un pasaporte.

## Origen y relación con MindClash
Proyecto NUEVO y SEPARADO (decisión explícita del usuario, 2026-08-22) — NO reemplaza a MindClash, que sigue existiendo tal cual en `APP1/APP/MindClash`. Conquesta nace de un documento del usuario (`APP WORLDRUN.pdf`, 39 páginas) con la idea completa ya desarrollada por él.

## Reporte de validación (hecho)
✅ Viable, CON recorte de alcance obligatorio. Mercado confirmado: 228+ apps de geografía/mapa (World Map Quiz, StudyGe, Sporcle) — pero todas funcionales y sin narrativa/diseño premium. Trivia Crack sigue con las mismas quejas de siempre (anuncios, repetición). El hueco real: nadie combina bien "conquista narrativa de países" + diseño premium + retos sociales.
⚠️ Riesgo #1 identificado y comunicado al usuario: el documento pide contenido para ~195 países con fuente y fecha de verificación — inviable para un MVP. Tensión propia detectada: pide que "la IA no invente nada" pero también pide generar cientos de preguntas con IA — requiere revisión humana antes de publicar cualquier pregunta generada.

## Decisión de alcance (decidida por el agente, comunicada, no bloqueante)
**MVP lanza con 1 continente completo (América, ~15-18 países)**, no el mundo entero. Europa/Asia/África se muestran "próximamente" en el mapa (gancho de retención) y se agregan mes a mes tras el lanzamiento.

## Constitución del Producto
1. Usuario: similar al avatar de MindClash (quiere aprender sin anuncios, con estatus) pero aquí el gancho es la fantasía de viajar/conquistar, no solo competir.
2. Problema: la trivia se siente repetitiva y sin propósito; no hay sensación de estar llegando a algún lado.
3. Promesa: "Conquesta te lleva a conquistar el mundo país por país, aprendiendo su geografía, historia, cultura, gastronomía y naturaleza en retos de minutos — sin anuncios y sin que se sienta como tarea escolar."
4. Primera victoria (<5 min): completar el primer nivel (Geografía) del primer país, ver la barra subir y la bandera iluminarse en el mapa.
5. 3 flujos clave: recorrer el mapa y elegir país → jugar los niveles de un país hasta conquistarlo → retar a un amigo por WhatsApp.
6. Regla-nunca: nunca inventar datos sin fuente citable · nunca incluir política/actualidad como categoría · nunca sentirse examen escolar.

## Identidad visual — CERRADA (ver FICHA-ARTE.md)
Dirección elegida: **Ruta de Vuelo** (de 3 interpretaciones fieles a la referencia del usuario) + pestañas de continente estilo pasaporte (tomadas de una combinación con la Opción 1). Modo oscuro navy `#0B1E3D`, acento azul `#3B7DE8` (progreso) + verde `#3FB854` (completado), tipografía Baloo 2 + Nunito Sans. Dispositivos ownable: ruta de vuelo punteada, pestañas de pasaporte, tarjetas de embarque (código de país), timbre de pasaporte en países 100% completados. Íconos de categoría: SVG real en la construcción (los mockups de exploración usaron emoji solo como placeholder rápido, ya limpiados).
Registro anti-repetición: MindClash usa violeta claro (Opción G); Conquesta usa navy oscuro — sin conflicto.

## FICHA-AVATAR.md — completa (ver archivo)
Avatar "Sofía, 29 años" — quiere sentir que recorre el mundo aunque no pueda viajar todavía. Dolor #1 (hallazgo real de reviews de competidores): "pagué por países en otra app y me los quitaron al cambiar a suscripción" — se convierte en objeción de oro y en promesa de garantía ("lo que desbloqueas es tuyo para siempre").

## ⚠️ Inconsistencia detectada y resuelta
El documento del usuario especifica por escrito **5 categorías** (Geografía, Historia, Cultura, Gastronomía, Naturaleza) y dice explícitamente "no se incluirán categorías de política ni actualidad". Pero la imagen de referencia visual que subió después muestra 8 categorías, incluida "Política". Se resuelve a favor de la especificación ESCRITA (5 categorías, sin política) — la imagen se trata como referencia de ESTILO visual únicamente, no de contenido/categorías. Avisar al usuario si en algún momento quiere agregar Deportes/Personajes como categorías 6-7 (quedaría en V2, no en el MVP de 1 continente).

## Monetización decidida (02C, matriz nicho A-Educación) — igual patrón que MindClash
**Modelo: FREEMIUM.** Registro gratis → onboarding (primer país jugable) → paywall tras completar el primer país.
- Free: **solo Colombia completo** (ajustado 2026-08-22 a pedido del usuario — antes eran 3 países; se redujo a 1 para generar más necesidad real de comprar) + retos 1v1 ilimitados + 1 ayuda 50/50 gratis al día.
- Pro: resto de América + continentes nuevos a medida que se liberan + ayudas ilimitadas + sin límite de vidas en el reto contra reloj.
- **Precio (ajustado 2026-08-22): $3.99/mes o $39.99/año (~$3.33/mes)**, marcado explícitamente como **precio de lanzamiento** (no fijo para siempre) — el usuario quería bajar el precio original ($5.99/$4.58) por ser una app nueva; se le explicó el trade-off (precios muy bajos suelen dar peor LTV que precios medios) y se acordó enmarcarlo como introductorio, subible más adelante con tracción, sin fecha/cupo falso todavía (eso se formaliza como Oferta de Fundadores real en la Sesión 8, con cupo y fecha verificables).
- Garantía diferenciada (de la objeción de oro): "lo que desbloqueas es tuyo para siempre — nunca te lo quitamos, ni si cambiamos de plan." Esto es una PROMESA DE PRODUCTO real, no solo copy: implica que el desbloqueo se guarda por país/usuario de forma permanente en la base de datos, nunca atado a una suscripción activa.

## Decisiones técnicas (decididas por el agente — no se preguntan al usuario)
- **Framework:** Next.js App Router (mismo patrón que MindClash — landing con SEO + app).
- **Auth:** Supabase Auth, registro gratis con Google OAuth + magic link. Webhook de Hotmart sube la cuenta existente a Pro (mismo patrón "registro gratis" de 18).
- **Modelo de datos (borrador):** `continents` (id, nombre, orden) · `countries` (id, continent_id, nombre, flag_code, orden, es_gratis bool, imagen_hero) · `questions` (id, country_id, categoria enum[geografia|historia|cultura|gastronomia|naturaleza], tipo[opcion_multiple|verdadero_falso|reto_reloj], pregunta, opciones jsonb, respuesta_correcta, explicacion, fuente, fecha_verificacion, dificultad[facil|medio|dificil|experto], generada_por_ia bool, revisada_por_humano bool NOT NULL DEFAULT false) · `user_country_progress` (user_id, country_id, categoria, pct_completado, estrellas) · `user_progress` (xp, coins, gems, racha — mismo patrón que 24-GAMIFICACION.md) · `retos` (1v1 vía WhatsApp, mismo patrón que MindClash).
- **Regla dura de contenido — VALIDACIÓN 100% AUTOMÁTICA, sin intervención humana (decisión explícita del usuario, 2026-08-22, con riesgo residual comunicado y aceptado):**
  - **Geografía** (capital, fronteras, ríos, montaña más alta, población, superficie): la pregunta se ARMA por plantilla directamente desde una fuente estructurada oficial (REST Countries API / Wikidata), nunca "generada libre" por la IA. Esto es prácticamente 100% confiable — no hay invención posible.
  - **Historia / Cultura / Gastronomía / Naturaleza**: pipeline de generación con IA + verificación por RAG (retrieval-augmented grounding) — el sistema busca la fuente (ej. artículo de Wikipedia del país/tema), y una segunda llamada de IA verifica que el dato de la pregunta SÍ está respaldado literalmente por el texto recuperado. Si no encuentra respaldo suficiente (umbral de confianza), la pregunta se descarta automáticamente y NUNCA se publica — cero intervención humana, pero también cero "publicar y ya se verá".
  - Columna `revisada_por_humano` se ELIMINA del esquema; se reemplaza por `verificacion_metodo` (`estructurada` | `rag_confirmada`) + `fuente_url` + `fecha_verificacion`, todas obligatorias para que una pregunta pueda marcarse `publicable = true`.
  - Riesgo residual aceptado: en las 4 categorías no estructuradas, la verificación automática reduce pero no elimina matemáticamente el riesgo de un dato desactualizado o ambiguo — no hay humano de respaldo. Documentado aquí como decisión informada del dueño del producto.
- **Categorías del MVP:** 5 fijas (Geografía, Historia, Cultura, Gastronomía, Naturaleza) — sin Política ni Actualidad, por escrito del usuario.

## SESIÓN 2 — CERRADA (2026-08-22)
Scaffold de código creado en `APP1/APP/Conquesta` (Next.js 16 App Router + Tailwind v4 + lucide-react + motion, mismo stack pineado que MindClash — `51-STACK-PINEADO.md`). Tokens de `FICHA-ARTE.md` volcados en `app/globals.css` (navy `#0B1E3D`, azul `#3B7DE8`, verde `#3FB854`, categorías multicolor). Fuentes Baloo 2 + Nunito Sans vía next/font/google en `app/layout.tsx`. Verificado: `npm run build` ✓.
Mapa de rutas fijado: `/` → `/onboarding` → `/paywall` → `/login` → `/app` (Mapa, Retos, Ranking, Perfil, Tienda).

## SESIÓN 3 — página de ventas (2026-08-22)

### Construida — 10 secciones canónicas (19-PAGINA-DE-VENTAS.md)
Componentes en `components/app/landing/`, ensamblados en `app/page.tsx`.
- **Big Idea**: "No te faltaba disciplina — te faltaba una forma de recorrer el mundo tú misma."
- **Mecanismo bautizado**: "el Pasaporte de Conquista" (3 pasos) — hero, solución y oferta.
- **Oferta**: Free (Colombia completo) + Pro $3.99/mes o $39.99/año ($3.33/mes, precio de lanzamiento), stack de valor, garantía "del Pasaporte Sellado".
- **Objeción de oro convertida en garantía de producto**: "lo que desbloqueas es tuyo para siempre" aparece en solución, oferta, garantía y FAQ — responde directo al dolor #1 de FICHA-AVATAR.md (perder contenido pagado al cambiar de modelo).
- **Carrusel sección 5**: placeholders rotulados (app interna aún no existe, pendiente real hasta Sesión 5).
- **Footer legal**: páginas creadas (`/terminos`, `/privacidad`, `/reembolso`, `/aviso-ia`) con contenido BORRADOR — pendientes de revisión legal completa antes de vender de verdad.

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (rutas `/`, `/terminos`, `/privacidad`, `/reembolso`, `/aviso-ia`) · `npm run dev` arranca sin errores en consola (puerto 3001 — el 3000 lo ocupa MindClash).
⚠️ Pendiente: verificación visual formal (screenshot + revisor-visual) — el mecanismo de preview del agente sigue sin compositar frames en esta sesión.

### Ronda de feedback del usuario (2026-08-22)
Pidió: quitar lenguaje en femenino ("tú misma") del titular de Solución, agregar el dolor de "scroll en redes sin aprender nada" (nuevo dolor #1 en FICHA-AVATAR.md), reforzar el deseo de retar amigos y medir nivel de conocimiento (nuevo deseo #3), y hacer el Hero más dinámico visualmente. Implementado:
- `FICHA-AVATAR.md`: dolor y deseo nuevos agregados y renumerados.
- `Solucion.tsx`: titular corregido a lenguaje neutro.
- `Problema.tsx`: pregunta de scroll añadida (ahora eyebrow icon Hourglass) + pregunta de retar amigos (5 preguntas en total).
- `Agitacion.tsx`: párrafo reescrito para incluir el "momentito en redes que se hace horas".
- `Hero.tsx`: agregada una mini "ruta de vuelo" con timbres de pasaporte (verde=visitado), un ícono de avión (actual) y un país bloqueado — el dispositivo ownable de FICHA-ARTE ya visible en la landing — y una tercera píldora "Reta a tus amigos y mide tu nivel".
Verificado: `npm run typecheck` ✓.

### Elevación a landing premium — reglas de escaneabilidad mobile (2026-08-22)
Aplicadas las reglas de "PÁGINA DE VENTAS PREMIUM" (límite de 4 líneas, una idea por bloque, íconos como ancla visual, CTA repetido en el scroll):
- `Agitacion.tsx`: reescrita de párrafo de 5 líneas → 3 mini-tarjetas con ícono + 1 línea destacada.
- `Garantia.tsx`: reescrita de párrafo de 4 líneas → 1 línea en negrita + 2 mini-tarjetas con ícono.
- `MiniCta.tsx` (nuevo): CTA compacto repetido tras el mecanismo, tras el carrusel y tras la garantía (antes solo existía en Hero, Oferta y CTA final).
Auditoría de escaneabilidad pasada (tabla completa en el chat) — las 10 secciones cumplen el límite de 4 líneas, tienen ícono como ancla visual, y la prueba de "solo-titulares" pasa.
Verificado: `npm run typecheck` ✓ · `npm run build` ✓. Contenido confirmado por lectura de página (screenshot visual sigue bloqueado por el mecanismo de preview del agente).

## SESIÓN 4 — onboarding, paywall y login (2026-08-22)

### Construido
- `app/onboarding/page.tsx`: 10 pasos — 3 preguntas de segmentación (eco de dolores/deseos de FICHA-AVATAR.md), 2 reconocimientos (fórmula anti-culpa, usando el dolor #1 real de "te quitaron lo que pagaste"), slider de compromiso, el primer NIVEL real de Colombia (3 preguntas de Geografía verificadas — banco semilla en `lib/onboarding-data.ts`, con `fuente` citada por pregunta, coherente con la decisión de validación automática de Sesión 1), loading "Sellando tu pasaporte…", y resultado (primer timbre, Nivel 1/8 de Colombia).
- `app/paywall/page.tsx`: blueprint C1 — headline con el timbre recién sellado, value stack, planes anual/mensual, CTA en 1ª persona, salida limpia.
- `app/login/page.tsx`: magic link + Google, mismo patrón que MindClash.

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (rutas `/onboarding`, `/paywall`, `/login` generadas) · `npm run dev` recuperado solo tras limpiar `.next` (mismo patrón de MindClash: build viejo desincronizado con rutas nuevas).
⚠️ Pendiente: verificación visual formal (screenshot + revisor-visual) — mecanismo de preview del agente sigue sin funcionar en esta sesión.

## CAMBIO DE NOMBRE: WorldRun → Conquesta (2026-08-22)
El usuario descartó "WorldRun" (choque con dominio/marca de running) y "TripToTrivia" (marca registrada real en USPTO: "TRIP TRIVIA", 2021, misma categoría de servicio — riesgo legal directo, comunicado y evitado). Se evaluaron Mundialia (riesgo: en LATAM "Mundial" se lee como Mundial de fútbol, mismo problema que WorldRun) y Kulturapp/CulturaVibe (genéricos, no comunican la mecánica de mapa/conquista). Elegido: **Conquesta** — conecta directo con el verbo ya usado en todo el copy ("conquista el mundo"), sin choque de marca detectado.
Carpeta del proyecto renombrada de `APP1/APP/WorldRun` a `APP1/APP/Conquesta`. Todas las menciones de marca en código/copy/docs actualizadas (`package.json`, `layout.tsx`, landing, onboarding, footer legal, emails `hola@conquesta.app`). El nombre del archivo fuente original del usuario (`APP WORLDRUN.pdf`) se dejó intacto como cita histórica.
Verificado: `npm run build` ✓ tras el renombre (tuvo que regenerarse `.next` — mismo patrón ya conocido de tipos de rutas desactualizados).

## SESIÓN 5 — la app interna (2026-08-22)

### Construido
Ruta `/app` con 5 secciones (`lib/app-state.ts` + `lib/app-state-context.tsx` simulan el progreso en `localStorage` — backend real en Sesión 6):
- **`/app` (Mapa)**: progreso mundial, pestañas de continente (América activa, Europa/Asia bloqueadas), ruta de vuelo con países visitados/actual/bloqueados, lista de países de América (solo Colombia jugable en el plan free — el resto lleva directo al paywall).
- **`/app/pais/[pais]`**: página de Colombia — hero con bandera, barra de progreso, grid de 5 categorías con estrellas ganadas, botón de Reto Final (bloqueado hasta completar las 5).
- **`/app/jugar/[pais]/[categoria]`**: el nivel jugable de verdad — 3 preguntas reales por categoría (banco completo de Colombia en `lib/trivia-bank.ts`, 15 preguntas verificadas manualmente, 3 por categoría) + reto final (1 pregunta de cada categoría). Al completar: suma monedas, marca la categoría como completa con estrellas, actualiza la racha.
- **`/app/retos`**: duelos por estado (tu turno / esperando / historial) + reto por WhatsApp.
- **`/app/ranking`**: tabla por avance (países completados + %), con tabs Semanal/Mensual/General.
- **`/app/perfil`**: stats (racha/monedas/gemas) + colección de pasaporte (10 países de América, sellados/bloqueados).
- **`/app/tienda`**: ayudas (50/50, tiempo extra, pista) comprables con monedas/gemas ganadas jugando.

### Verificación
`npm run build` ✓ (todas las rutas generadas, incluidas las 2 dinámicas `/app/pais/[pais]` y `/app/jugar/[pais]/[categoria]`) · servidor de desarrollo corriendo en `http://localhost:3000/app`, confirmado por contenido servido.
⚠️ Pendiente: verificación visual formal (screenshot + revisor-visual) — mecanismo de preview del agente sigue sin funcionar en esta sesión.

### Ronda de feedback del usuario tras probar la app (2026-08-22)
Pidió: quitar el color junto al nombre del país en el Mapa, recuperar el estilo de pestañas de pasaporte + tarjetas de embarque de la dirección elegida, agregar categoría Deportes, exigir 100% en cada categoría antes del reto final, combinar/barajar preguntas con grado de dificultad, tiempo para responder, niveles Explorador/Descubridor/Experto dentro de cada país, celebración de victorias y sonido. Implementado:
- **Mapa (`/app`)**: quitado el bloque de color junto al nombre; pestañas de continente ahora con forma de pestaña de pasaporte (esquinas redondeadas solo arriba, candado en las bloqueadas); países en fila estilo tarjeta de embarque (borde punteado izquierdo + código de 3 letras en vez del color).
- **Categoría Deportes** agregada (6ta categoría, ícono `Medal`, color propio `--cat-deportes`) con 10 preguntas reales verificadas.
- **Banco de preguntas** (`lib/trivia-bank.ts`): 10 preguntas por categoría (60 en total) etiquetadas por dificultad (fácil/medio/difícil/experto). `preguntasParaRonda()` baraja el banco cada vez que se llama (nunca la misma tanda dos veces) y prioriza dificultad según la ronda.
- **Niveles dentro del país**: cada categoría ahora tiene 3 rondas — **Explorador** (5 preguntas, 30s), **Descubridor** (7 preguntas, 30s), **Experto** (10 preguntas, 30s) — el tiempo es total para la tanda, no por pregunta. Cada ronda se aprueba con ≥60% de aciertos; si no se aprueba, se puede reintentar (banco re-barajado). Una categoría llega a 100% solo cuando se aprueban las 3 rondas — el Reto Final se desbloquea solo cuando las 6 categorías están al 100% (decisión técnica documentada, no solo "haber jugado una vez").
- **Reto Final** rediseñado: 20 preguntas variadas de las 6 categorías, contra reloj de 90 segundos (decisión propia: proporcional al reto de 60s/10preguntas del documento original), conquista el país con ≥70% de aciertos.
- **Celebración y sonido**: confeti + sonido de victoria (Web Audio API, sin archivos externos) al aprobar una ronda o conquistar el país; sonido distinto de "tiempo agotado" si no se logra. Números de recompensa con conteo animado.
- Nuevas rutas: `/app/pais/[pais]/categoria/[categoria]` (selección de ronda) y `/app/jugar/[pais]/[categoria]/[ronda]` (juego cronometrado); `/app/jugar/[pais]/reto-final` reescrita.

### Verificación
`npm run build` ✓ (16 rutas, incluidas 4 dinámicas nuevas) · servidor de desarrollo respondiendo 200 en `http://localhost:3000/app` sin errores en el log.
⚠️ Pendiente: verificación visual formal (screenshot + revisor-visual) — mecanismo de preview del agente sigue sin funcionar en esta sesión.

## Corrección de bugs post-Sesión 5 (2026-08-23)
El usuario reportó el badge rojo "1 Issue" del dev-tools de Next.js en la pantalla de resultado de una ronda. Se investigó con la consola del navegador y aparecieron DOS bugs reales en `app/app/jugar/[pais]/[categoria]/[ronda]/page.tsx` y `app/app/jugar/[pais]/reto-final/page.tsx`:
1. **"Cannot update a component while rendering a different component"**: `finalizar()` (que hace `setState` del contexto global `useAppState`) se llamaba DENTRO del updater de `setTiempo((t) => {...})`. Corregido separando en dos efectos: uno que solo decrementa `tiempo`, y otro `useEffect` (dependiente de `[tiempo]`) que dispara `finalizar()` solo cuando `tiempo === 0`.
2. **Error de hidratación**: el banco de preguntas se barajaba con `Math.random()` dentro del inicializador perezoso de `useState(() => preguntasParaRonda(...))` / `preguntasRetoFinal(...)`, que corre distinto en servidor vs. cliente. Corregido: el estado arranca en `null` y se puebla en un `useEffect` post-montaje (solo cliente); se agregó un guard de carga (`if (!preguntas) return <skeleton/>`) colocado DESPUÉS de todos los hooks (nunca antes, por las Reglas de los Hooks) y guards `if (!preguntas) return;` en `finalizar()`/`responder()`.
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ (limpiando `.next`) · navegador con consola limpia (cero errores) jugando una ronda completa de Explorador (Deportes, Colombia, 4/5 aciertos) y cargando el Reto Final — ambos bugs no reproducen más.

## Ronda de feedback #2 tras jugar la app (2026-08-23)
El usuario reportó: el botón "Intentar de nuevo" no reiniciaba la ronda, pidió subir la aprobación de nivel a 80%, pidió que las preguntas NO se repitan entre Explorador/Descubridor/Experto de la misma categoría, pidió sonido de tic-tac en los últimos 5 segundos, y preguntó (dudas genuinas, no quejas) cómo se acumulan/usan las monedas, para qué sirven las gemas y qué se puede hacer en la Tienda. Implementado:
- **"Intentar de nuevo" corregido**: antes llamaba `router.refresh()`, que no reinicia el estado del componente (por eso no pasaba nada visible). Ahora hay una función `reiniciar()` que resetea preguntas (rebarajadas), índice, aciertos, cronómetro y ayudas usadas — en `[ronda]/page.tsx` y `reto-final/page.tsx`.
- **Aprobación subida a 80%** (`UMBRAL_APROBACION` en `lib/app-state.ts`, antes 60%).
- **Banco de preguntas reestructurado** (`lib/trivia-bank.ts`): cada categoría ahora tiene 22 preguntas verificadas divididas en 3 sets FIJOS y sin solapamiento — Explorador (5), Descubridor (7), Experto (10) — en vez de un solo pool de 10 que se repetía entre niveles. 132 preguntas nuevas en total (antes 60).
- **Sonido de presión**: tic-tac (`playTick`, ya existía en `use-sound.ts`) suena una vez por segundo en los últimos 5 segundos del cronómetro, en ronda y en reto final.
- **Gap real detectado y corregido**: la Tienda dejaba "comprar" ayudas (50/50, +10s, pista) pero nunca se podían usar en ningún reto — un botón que no hacía nada real (viola la regla de UX "todo elemento interactivo hace algo"). Se agregó `inventario` a `AppState` (`lib/app-state.ts`, bump a v3) que guarda cuántas ayudas tiene el jugador; la Tienda ahora suma al inventario en vez de solo descontar saldo; y se agregó una barra de ayudas usable en la pantalla de juego (ronda y reto final): 50/50 oculta 2 opciones incorrectas de la pregunta actual, +10s sube el cronómetro, Pista resalta la respuesta correcta con un anillo dorado — cada una se descuenta del inventario al usarse y se resetea al cambiar de pregunta.
- **Respuesta a las dudas del usuario** (documentado aquí para no repetir la explicación): las monedas se ganan jugando cualquier ronda (aciertos × 5) y se gastan en la Tienda en ayudas de 50/50 o tiempo extra; las gemas se ganan solo conquistando un país completo (+3 por Reto Final aprobado) y sirven para comprar la Pista (ayuda más cara/rara); la Tienda es exactamente donde se transforman esas monedas/gemas en ayudas, y esas ayudas ahora se usan desde la propia pantalla de juego.

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (limpiando `.next`) · navegador con consola limpia: se probó comprar 50/50 y Pista en la Tienda (el inventario sube correctamente), jugar una ronda usando el 50/50 (oculta 2 opciones incorrectas, se descuenta a 0, botón se deshabilita), dejar que el tiempo se agote (cierra la ronda sin error), y usar "Intentar de nuevo" (reinicia con preguntas rebarajadas y cronómetro completo, sin errores). Umbral de 80% confirmado (3/5 aciertos = 60% marcó "Casi lo logras" correctamente).
⚠️ Pendiente real (sin cambios): la verificación visual formal (screenshot 375px + subagente `revisor-visual`) sigue sin poder correrse automáticamente por limitaciones del entorno de esta sesión.

## Corrección #3: ayudas no usables con 0 en inventario (2026-08-23)
El usuario reportó (con screenshot) tener 205 monedas pero ver la barra de ayudas deshabilitada dentro del reto — mostraba "(0)" en las 3. Diagnóstico: NO era un bug de guardado, era una limitación real de diseño — las ayudas solo se podían usar si ya las habías comprado antes en la Tienda; tener monedas no bastaba, y no había forma de ir a la Tienda a mitad de un reto sin perder el progreso. Corregido: se centralizó el costo/moneda de cada ayuda en `lib/ayudas.ts` (`AYUDAS_CONFIG`, usado ahora por la Tienda y por las pantallas de juego) y se agregó a `[ronda]/page.tsx` y `reto-final/page.tsx` la función `puedeUsar()`/`consumirAyuda()`: si ya tienes la ayuda comprada la descuenta del inventario gratis; si no la tienes pero te alcanzan tus monedas/gemas, la compra al instante y la usa en el mismo tap — ya no hace falta pasar por la Tienda antes de jugar. El botón muestra la cantidad que tienes si es &gt;0, o el precio si es 0 (ej. "+10s · 15").
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ · en el navegador, con 50 monedas y 0 unidades de "+10 segundos" en inventario, el botón NO estaba deshabilitado — al tocarlo se descontaron 15 monedas (50→35) y se sumó tiempo al cronómetro, sin tocar el inventario. Consola sin errores nuevos.

## Ronda de diseño: colores del logo + podio + fondo del mapa (2026-08-23)
El usuario compartió el logo oficial de Conquesta (ícono circular de 6 piezas de color) y pidió: (1) que cada categoría use el color de su pieza en el logo, con el ícono correspondiente en vez de colores/íconos genéricos, (2) un podio 1-2-3 en el Ranking, (3) en el Mapa, que la zona de la lista de países sea más clara (blanco/azul claro) y que se vea de fondo, tenue, el mapa de América. Implementado:
- **Colores de categoría re-derivados del logo** (`app/globals.css`, `FICHA-ARTE.md` — cosa juzgada actualizada con evidencia real del usuario): Geografía=teal `#1E8A8C` (montaña), Historia=navy `#2B4C7E` (columnas), Cultura=morado `#7C4FC9` (máscaras), Gastronomía=naranja `#E08A34` (tazón), Naturaleza=verde `#3FA34D` (hoja), Deportes=rojo `#D64545` (balón). Antes Historia y Geografía compartían el mismo ícono (`Landmark`) por error — corregido: Historia=`Landmark`, Geografía=`Mountain`, Cultura=`Drama`, Gastronomía=`Soup`, Naturaleza=`Leaf`, Deportes=`Volleyball` (`app/app/pais/[pais]/page.tsx`).
- **Podio del Ranking** (`app/app/ranking/page.tsx`): columnas 2do-1ro-3ro con alturas decrecientes, corona sobre el 1er lugar, colores oro/plata/bronce (tokens nuevos `--silver`/`--bronze`); la lista debajo arranca en el puesto 4.
- **Mapa**: la tarjeta de la lista de países pasó de fondo navy oscuro a una tarjeta clara (`--surface-inverse #EEF4FC` + texto `--text-inverse #16305A`); se agregó una silueta abstracta tipo continente al 10% de opacidad de fondo en toda la pantalla `/app` (decorativa, no cartográfica — no existe un asset real de mapa de América, se dejó anotado por si se quiere reemplazar por un SVG de mapa real en una sesión de assets).

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (limpiando `.next`) · en el navegador (JS/DOM, sin screenshot — ver pendiente abajo): confirmado que las 6 categorías renderizan los colores exactos del logo (`rgb(30,138,140)`, `rgb(43,76,126)`, `rgb(124,79,201)`, `rgb(224,138,52)`, `rgb(63,163,77)`, `rgb(214,69,69)`), el podio ordena correctamente 1-2-3 con el resto desde el puesto 4, y la tarjeta de países del Mapa renderiza con fondo claro (`rgb(238,244,252)`) y texto oscuro legible (`rgb(22,48,90)`). Consola sin errores.
⚠️ Pendiente real: el mecanismo de screenshot del agente volvió a fallar esta sesión ("Browser pane is not displayed") — no se pudo tomar la captura a 375px ni correr el subagente `revisor-visual`. La verificación de arriba es estructural (colores/DOM), no un veredicto visual. Recomendado: el usuario revise con sus propios ojos en el navegador antes de dar por cerrada esta ronda de diseño.

## Mapa de fondo — arreglo real + logo agregado (2026-08-23)
El usuario marcó con un círculo rojo la zona exacta donde seguía sin ver el mapa de fondo, y pidió agregar el logo a la app. Diagnóstico del porqué no se veía (2do intento): la silueta vivía DETRÁS de toda la pantalla, pero el panel de ruta de vuelo (`bg-surface-secondary`, opaco) y la tarjeta de países (`bg-surface-inverse`, opaca) la tapaban por completo — solo quedaba una franja mínima visible. Corregido de raíz: la silueta ahora vive DENTRO de la tarjeta de países (`app/app/page.tsx`), con `isolate` + `-z-10` para quedar detrás de las filas de texto pero DELANTE del fondo claro de la tarjeta — así se ve como mapa de fondo real, no tapado. Confirmado visualmente con screenshot a 375px (el mecanismo de preview volvió a funcionar esta sesión): silueta azul claramente visible detrás de la lista de países, texto legible encima.
**Logo agregado**: no tengo acceso al archivo de la imagen que pegó el usuario (las imágenes pegadas en el chat no quedan en un path que pueda leer), así que reconstruí el concepto como logomark plano/vectorial (`components/app/ConquestaLogo.tsx`) usando los colores REALES de categoría de la app (los 6 gajos de color + compás central) en vez del render 3D/glossy original — más consistente con el sistema de diseño flat de la app. Se usa en: favicon (`app/icon.svg`, aparece en la pestaña del navegador) y en el header del Login (`app/login/page.tsx`, reemplazó el placeholder "C" en cuadrado).
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ (17 rutas, incluida `/icon.svg`) · screenshots confirmaron ambos cambios renderizando correctamente.

## Silueta del mapa: retirada (2026-08-23)
El usuario, con captura, señaló que la silueta dibujada a mano no se reconoce como el mapa real de América ("mejor quitarlo" si no puede quedar fiel a como es de verdad). Decisión correcta: quitarla en vez de forzar una forma que no se ve auténtica. Eliminada de `app/app/page.tsx` (SVG + los wrappers `relative/isolate/overflow-hidden` que solo existían para sostenerla). La tarjeta de países vuelve a ser una tarjeta clara lisa, sin intento de "mapa de fondo". Si más adelante se quiere un mapa real, hace falta un asset de mapa verdadero (ilustración encargada o librería de geo-shapes), no un path dibujado a mano.
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ · confirmado por DOM que no queda ningún rastro del SVG anterior.

## Plan de elevación de color — EJECUTADO (2026-08-23)
El usuario confirmó ("Sí, sigue con el plan de color"). Implementado:
- **Profundidad real de 3 niveles**: `--surface-elevated` pasó de ser idéntico a `--surface-secondary` (#1B3A63) a un tono distinto y más claro `#234B7A`, con su mapeo `@theme inline` (antes no existía la utilidad `bg-surface-elevated`, aunque el token estaba declarado). Se usa en la tarjeta de la "próxima ronda a jugar" en la pantalla de selección de ronda.
- **Módulo compartido `lib/category-style.ts`**: centraliza `CATEGORIA_ICONO` y `CATEGORIA_COLOR` (antes duplicado solo en la pantalla de país) — único punto de verdad para que el color de cada categoría se use consistentemente en toda su experiencia de juego.
- **El color de categoría ahora vive en el juego, no solo en el ícono chip**: el aro del cronómetro en la ronda (`[ronda]/page.tsx`) usa el color de la categoría en vez de azul fijo (se pone rojo solo en los últimos 8s, igual que antes); en el Reto Final, la etiqueta de categoría sobre cada pregunta cambia de color según a qué categoría pertenece esa pregunta; en la pantalla de selección de ronda (`categoria/[categoria]/page.tsx`), el título y el ícono de la ronda "siguiente a jugar" se tiñen con el color de la categoría, y esa tarjeta usa `bg-surface-elevated` + borde izquierdo del color de categoría para destacar cuál sigue.
- **TopBar con chips distintos**: racha (naranja `--flame` nuevo, antes compartía el dorado de monedas), monedas (dorado), gemas (azul) — cada uno con su propio tinte de fondo suave (`--flame-soft`, `--gold-soft`, `--brand-primary-soft`) en vez de los 3 chips idénticos en gris-azul.

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (limpiando `.next`) · confirmado por estilos computados en el navegador (el mecanismo de preview volvió a fallar para screenshots esta vez, se verificó por DOM/CSS): los 3 chips del TopBar con `rgba` distintos (naranja/dorado/azul), el título y la tarjeta "siguiente ronda" de Deportes en rojo `rgb(214,69,69)` sobre `bg-surface-elevated` `rgb(35,75,122)`, y el aro del cronómetro de la ronda usando `var(--cat-deportes)`. Consola sin errores.

## Iconos animados por categoría (2026-08-23)
El usuario pidió iconos animados por categoría. Se investigaron paquetes externos (LottieFiles, IconScout, Flaticon, animatedicons.co — ver fuentes abajo), pero mezclar 6 iconos de fuentes distintas arriesgaba inconsistencia visual y requería aprobar la descarga de cada archivo con su licencia. Se le presentó la alternativa al usuario vía pregunta y ELIGIÓ: animar los iconos actuales con Motion (ya instalada) en vez de bajar assets externos.
Implementado: `components/app/CategoryIcon.tsx` — envuelve cada ícono Lucide de categoría en un gesto de animación propio y en loop (Geografía: sube/baja sutil simulando "respirar"; Historia: pulso de escala; Cultura: balanceo/rotación; Gastronomía: sube/baja + escala; Naturaleza: balanceo más amplio, como viento; Deportes: rebote más rápido) — duraciones desincronizadas a propósito (1.1s a 3s) para que las 6 no se muevan al unísono. Respeta `prefers-reduced-motion` (usa `useReducedMotion` de Motion, cae a ícono estático). Se usa en la grilla de categorías de la pantalla de país (`app/app/pais/[pais]/page.tsx`); el ícono se congela (estático, sin loop) cuando la categoría llega a 100% completada (usa `Check` en vez del ícono animado).
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ · confirmado por DOM que las 6 categorías renderizan su wrapper animado. ⚠️ Limitación de esta sesión: la pestaña de verificación quedó en segundo plano (`document.hidden: true`) y el navegador pausa las animaciones basadas en `requestAnimationFrame` en pestañas no visibles — no pude CONFIRMAR visualmente el movimiento (mismo patrón ya documentado antes con Confetti/CountUp). El código sigue el mismo patrón que esas animaciones, que sí se confirmaron funcionando en pruebas anteriores; el usuario debería confirmar visualmente en su propio navegador.

Fuentes consultadas: [IconScout Lottie Packs](https://iconscout.com/free-lottie-animation-packs) · [12 Free Lottie Animation Sites](https://www.moonb.io/blog/free-lottie-animations) · [Icon King — Free Lottie Animations](https://www.iconking.net/blog/free-lottie-animations) · [Flaticon Animated Icons](https://www.flaticon.com/animated-icons) · [animatedicons.co](https://animatedicons.co/)

## Arquitectura de Rutas Temáticas — implementada (2026-08-23)
El usuario pidió (spec formal, "Ajuste Ruta 1") evolucionar el Mapa de lista plana de 10 países a un sistema de 3 Rutas Temáticas por continente, manteniendo intacta la mecánica de país (6 categorías × 3 niveles × Reto Final). Jerarquía nueva: Continente → Ruta → País → Categorías → Niveles → Reto Final. Aprobó generar contenido real de inmediato para Perú y Chile (Ruta 1: Colombia → Perú → Chile).

### Contenido nuevo (lo más grande de esta sesión)
264 preguntas nuevas verificadas (22 por categoría × 6 categorías × 2 países), mismo estándar que Colombia — `lib/trivia-content-peru.ts` y `lib/trivia-content-chile.ts`. Se extrajo también el contenido de Colombia a su propio archivo (`lib/trivia-content-colombia.ts`) y `lib/trivia-bank.ts` quedó como orquestador: `BANCOS_PAISES` combina los 3, y `preguntasParaRonda`/`preguntasRetoFinal` ahora reciben `pais` como primer argumento (antes solo servían a Colombia). Tipos compartidos (`RondaId`, `RONDAS`, `RETO_FINAL_CONFIG`) se movieron a `lib/trivia-bank-types.ts` para evitar import circular.

### Modelo de datos
- **`lib/rutas-data.ts`** (nuevo): entidad `Ruta` (id, nombre, tema, países en orden, insignia). 3 rutas para América: Origen Andino (Colombia→Perú→Chile, activa), Ritmo y Trópico (Brasil→Cuba→Costa Rica, bloqueada), Ecos del Norte (México→EE.UU.→Canadá, bloqueada) — estas 2 últimas son estructura/UI sin banco de preguntas todavía.
- **`lib/countries-data.ts`**: se agregaron Cuba, Costa Rica, Estados Unidos y Canadá (antes no existían); Perú y Chile pasaron a `esGratis: true` (se desbloquean jugando, ya no son "Pro" — es la consecuencia lógica de que la Ruta 1 sea gratis y jugable end-to-end, communicado en el aviso de plan).
- **`lib/app-state.ts`**: `AppState` ganó `insigniasGanadas: string[]` (bump v3→v4, localStorage `conquesta_app_state_v4`). Funciones nuevas: `paisDesbloqueadoEnRuta` (desbloqueo secuencial dentro de la ruta), `rutaDesbloqueada` (requiere la insignia de la ruta anterior), `rutaCompleta`, `pctRuta`, `otorgarInsigniaSiCorresponde` (idempotente, se llama al conquistar el Reto Final de un país).
- **Bug real encontrado y corregido de paso**: `finalizar()` en las pantallas de ronda y reto final leía `conRacha.progresoPorPais[pais]` directo y abortaba si no existía — solo funcionaba porque Colombia venía pre-sembrada en el estado inicial. Con Perú/Chile jugables desde cero, el progreso NUNCA se hubiera guardado la primera vez. Corregido usando `progresoDePais()` (con fallback) en ambas pantallas.

### UI/UX
- **Mapa (`app/app/page.tsx`)**: la lista plana de 10 países fue reemplazada por 3 tarjetas de Ruta (nombre, países en secuencia, % de avance, candado + mensaje de qué insignia falta si está bloqueada). Tocar un continente bloqueado (Europa/Asia) abre un modal de vista previa (3 "rutas por anunciar" con candado) — pedido explícito del usuario.
- **`app/app/ruta/[rutaId]/page.tsx`** (nueva): vista de una ruta con sus 3 países conectados por la "ruta de vuelo" ya existente, cada país como fila de tarjeta de embarque, bloqueado con el mensaje "Conquista [país anterior]"; muestra la insignia si ya se ganó.
- **`app/app/pais/[pais]/page.tsx`**: agregado guard de desbloqueo secuencial — si alguien entra directo por URL a un país de ruta que no le toca aún, se redirige a la vista de la ruta.

### Verificación
`npm run typecheck` ✓ (limpio pese al tamaño del cambio) · `npm run build` ✓ (18 rutas, incluida `/app/ruta/[rutaId]`) · en navegador confirmé: el Mapa muestra las 3 rutas correctamente; entrar a Perú por URL antes de tiempo redirige a la vista de ruta (guard funciona); tras marcar Colombia como conquistada en localStorage, Perú se desbloqueó y su contenido (Historia, Reto Final) cargó correctamente; Chile también cargó su propio contenido (Gastronomía Experto); el modal de continente bloqueado (Europa) se abre bien. Consola sin errores en ningún caso.
⚠️ No pude probar de punta a punta el otorgamiento de la insignia "Pionero Andino" (requeriría conquistar los 3 países completos, muy largo para una sesión de verificación) — la lógica (`otorgarInsigniaSiCorresponde`) está en su lugar y se llama en el punto correcto, pero recomiendo que el usuario confirme ese flujo específico jugando de verdad.

### Entregables de la spec original — dónde encontrarlos
1. **Rediseño del Mapa**: implementado en código (arriba), no solo mockup.
2. **Modelo de datos JSON**: la estructura real queda en `lib/rutas-data.ts` (entidad Ruta) + `lib/app-state.ts` (`AppState`, `ProgresoPais`, `ProgresoCategoria`, `RondaEstado`) + `lib/trivia-bank-types.ts` (`RondaId`, umbral 80% en `UMBRAL_APROBACION` de `app-state.ts`). Se le compartió al usuario en el chat un JSON Schema representativo de esta misma estructura.
3. **Lógica de progreso/estados**: documentada arriba, funciones reales en `lib/app-state.ts`.

## Tarjetas de ruta estilo "pase de abordar" (2026-08-23)
El usuario pidió (spec formal) transformar las tarjetas de ruta del Mapa a un look de tiquete aéreo: muesca troquelada, línea punteada separadora, paleta de color temática por ruta, tipografía más grande y de alto contraste, secuencia de países en código de aeropuerto. Implementado en `components/app/RouteBoardingPassCard.tsx` (nuevo, usado por `app/app/page.tsx`):
- **Muesca troquelada**: 2 círculos (`--surface-secondary`, el color del contenedor padre) posicionados en la unión entre cuerpo y talón, arriba y abajo — efecto de "mordida" clásico de tiquete.
- **Talón separado** por `border-l-2 border-dashed border-white/40`.
- **3 paletas nuevas** en `globals.css`: Origen Andino = azul andino `#2B4C7E` → terracota `#C1694F`; Ritmo y Trópico = esmeralda `#0E8E7D` → turquesa `#14B8A6`; Ecos del Norte = dorado `#D4A017` → azul profundo `#16305A`. Bloqueada = patrón de rayas diagonales sobrio en dos tonos navy oscuros (no un fondo plano).
- **Tipografía**: título de ruta 18px extrabold blanco (antes 14px gris); secuencia de países en código de aeropuerto (`COL ✈ PER ✈ CHL`) 14px semibold blanco con ícono de avión entre países.

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ · confirmado por estilos computados en el navegador: gradiente exacto `linear-gradient(135deg, rgb(43,76,126), rgb(193,105,79))` en Ruta 1, patrón `repeating-linear-gradient` sobrio en rutas bloqueadas, 2 muescas presentes, título a 18px blanco, códigos de país (COL/PER/CHL, BRA/CUB/CRI, MEX/USA/CAN) renderizando bien, el link a `/app/ruta/origen-andino` sigue funcionando. Consola sin errores. (El visor de screenshot volvió a fallar esta sesión — verificación por CSS/DOM, no captura visual; recomendado que el usuario lo confirme con sus propios ojos.)

## Cambio de modo: oscuro → claro (2026-08-23)
El usuario pidió (spec formal, dos instrucciones) reemplazar TODO el modo oscuro navy por un modo claro/blanco moderno, con sombras suaves en las tarjetas. Esta es la 2da vez que el modo se redecide en el proyecto — se avisó brevemente (era una reversión de "cosa juzgada") pero se procedió porque la instrucción era explícita, detallada y sin ambigüedad de que fuera un reemplazo total (no un toggle claro/oscuro).

### Qué cambió
- **`app/globals.css`**: todos los tokens de superficie/texto/borde invertidos — `--surface-base` #F8FAFC (antes navy #0B1E3D), `--surface-primary` blanco puro, texto principal `#0F172A` (antes blanco), bordes gris claro. `color-scheme: light`.
- **3 colores de categoría oscurecidos** (Gastronomía/Naturaleza/Deportes): el naranja/verde/rojo del logo se veían bien como texto sobre navy oscuro, pero perdían contraste como texto sobre el nuevo fondo blanco — se oscurecieron un punto (siguen sirviendo igual de bien como fondo de chip con ícono blanco encima).
- **`--status-locked`, `--silver`, `--bronze`**: oscurecidos también (mismo motivo — eran tonos medios pensados para contrastar con blanco SOBRE navy; sobre blanco necesitaban ser más oscuros para que el texto/ícono blanco encima siguiera siendo legible).
- **`--surface-inverse`/`--text-inverse`** (la "tarjeta clara" especial que antes contrastaba con el navy oscuro del resto de la app): ahora apuntan a los mismos tokens primarios — con toda la app clara, ese caso especial ya no aplica. Se conservan los nombres solo por compatibilidad de código.
- **Sombras suaves** (`shadow-sm`/`shadow-md`) agregadas a las tarjetas principales que antes solo tenían borde: opciones de respuesta en ronda/reto-final/onboarding, tarjetas de categoría del país, tarjetas de ronda (con `shadow-md` extra en la "siguiente a jugar" para que la ahora-idéntica `surface-elevated` se distinga).
- Las **tarjetas de ruta estilo tiquete aéreo** (paletas Andino/Trópico/Norte) NO cambiaron — son islas de color con texto blanco, independientes del modo del resto de la app, tal como pidió la spec.

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (limpiando `.next`) · auditoría de código: cero hex hardcodeados fuera de `globals.css`/datos de banderas (confirmado por grep) — el sistema de tokens ya construido hizo que el 95% de la app se re-tematizara sola. Confirmado en navegador (estilos computados, screenshot volvió a fallar esta sesión): `/app` con fondo `rgb(248,250,252)` y texto `rgb(15,23,42)`; podio del Ranking con oro/plata/bronce oscurecidos y texto blanco legible; botones de respuesta blancos con borde y `shadow-sm` visibles sobre el fondo off-white (no se pierden); Login, ronda de juego y país revisados sin errores de consola en ninguno.
⚠️ Como siempre que el visor de captura falla: verificación por CSS/DOM, no por ojo humano — recomendado que el usuario confirme visualmente, sobre todo el contraste de los 3 colores de categoría oscurecidos y el look general de "luminoso y moderno" pedido.

## Bug real: "Reto final" invisible tras las 6 categorías (2026-08-23)
El usuario reportó (con captura) que el botón de Reto Final desapareció al completar las 6 categorías de Colombia al 100%. Diagnóstico: NO estaba desaparecido — seguía en el DOM, en su posición correcta, clickeable — pero su fondo era **transparente** y su texto blanco, es decir, invisible sobre el nuevo fondo claro. Causa raíz real: `--color-status-success`, `--color-status-success-soft`, `--color-status-error` y `--color-status-error-soft` NUNCA estuvieron registrados en el bloque `@theme inline` de `globals.css` — solo existían como variables CSS sueltas, así que `bg-status-success` (usado en 9 archivos: reto final, checks de categoría completa, pantallas de resultado de ronda, perfil, retos) nunca fue una clase de Tailwind válida. Este bug es ANTERIOR a esta sesión — probablemente desde que se creó la app — pero era invisible en modo oscuro (texto blanco sin fondo, sobre navy oscuro, se seguía viendo razonablemente bien); con el fondo claro quedó al descubierto como texto blanco sobre blanco.
Corregido: se agregaron los 4 mapeos faltantes en `@theme inline`. Causa raíz, no parche — no se tocó ningún componente, el fix vive en el único lugar correcto (el archivo de tokens).
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ · en el navegador, simulando el mismo estado exacto del usuario (6 categorías 100%, reto final sin completar), el botón ahora renderiza `rgb(47,168,74)` (verde sólido) con texto blanco — visible y legible. Consola sin errores.

## `npm run dev` inestable en esta máquina — usar `npm run build` + `npm run start` para el demo (2026-08-23)
El usuario reportó que `http://localhost:3000/app` no cargaba. Diagnóstico: `next dev` (Turbopack) empezó a crashear con "Jest worker encountered 2 child process exceptions" en rutas específicas (`/app/ruta/[rutaId]`, `/app/pais/[pais]/categoria/[categoria]`), devolviendo 500. Confirmado que NO es un bug de la app: se corrió `npm run build` (limpio) + `npm run start` (servidor de producción) y las mismas rutas respondieron 200 sin errores. Es una inestabilidad del modo dev de Turbopack en este entorno Windows (posiblemente agravada por los múltiples kill/restart de `node` durante la sesión). Mientras no se investigue más a fondo, **para demos/revisión visual usar `npm run build && npm run start` en vez de `npm run dev`** — más lento para iterar código pero estable para navegar.

## Ronda de ajustes: shuffle de opciones, temporizador, contraste y reto de WhatsApp (2026-08-23)
El usuario pidió 4 bloques de cambios (spec formal). Implementado:
- **Bug real corregido — opciones sin barajar**: `preguntasParaRonda`/`preguntasRetoFinal` barajaban el ORDEN de las preguntas pero nunca las OPCIONES dentro de cada pregunta — como casi todo el contenido se escribió con la respuesta correcta en el índice 0, aparecía desproporcionadamente en la 1ra posición. Nueva función `shuffleOpciones()` en `lib/trivia-bank.ts` (barajada + remapeo de `correctaIndex`), aplicada a los resultados de ambas funciones. También se exportó `shuffle()` para reutilizarlo en el nuevo banco de cultura general.
- **Nivel Experto ahora dura 40s** (antes 30s) — `lib/trivia-bank-types.ts`.
- **Reloj ampliado**: de 36px a 64px, número de `text-xs` a `text-xl`, en `[ronda]/page.tsx` y `reto-final/page.tsx`.
- **Candado dorado brillante** en las pestañas de continente bloqueado (`--gold-bright: #F59E0B`, nuevo token, distinto del `--gold` más apagado que usan monedas/estrellas).
- **Barra de navegación con más contraste**: texto inactivo pasó de `text-txt-tertiary` a `text-txt-secondary` (más oscuro/legible), el ítem activo ahora tiene una píldora de fondo azul suave en vez de solo cambiar de color, y la barra completa tiene una sombra hacia arriba para despegarse visualmente del contenido.
- **Nueva mecánica: Reto de Cultura General** (`lib/trivia-cultura-general.ts` + `app/app/retos/desafio/page.tsx`): 30 preguntas de cultura general mundial (no atadas a ningún país) de donde se sortean 20 sin límite de tiempo por pregunta — en su lugar, un cronómetro que SUBE y mide el tiempo total. Al terminar, tarjeta de resultado (aciertos/20 + tiempo mm:ss) con botón "Retar a un amigo por WhatsApp" que arma el mensaje exacto pedido (con los valores reales interpolados) vía `wa.me`. El botón genérico de WhatsApp que ya existía en `/app/retos` (mandaba un texto fijo sin resultado real) se reemplazó por la entrada a este reto real.
  - Nota de naming: la plantilla del usuario decía "KulturaGo" — se cambió a "Conquesta" (el nombre real y ya confirmado de la app) en el mensaje que se envía de verdad; aviso por transparencia, no se preguntó porque es obviamente un residuo de una etapa anterior de naming.

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (18 rutas, incluida `/app/retos/desafio`) · esta vez se verificó con `npm run build && npm run start` (modo producción, ver nota de estabilidad de `next dev` arriba) en vez de `npm run dev`: reloj confirmado en 64px con fuente 20px; ronda Experto confirmada iniciando en 40 (no 30); dos preguntas distintas confirmaron que la respuesta correcta ya NO queda fija en la primera opción (se movió de posición en ambos casos); candado dorado confirmado en `rgb(245,158,11)` = `#F59E0B` exacto; nav con píldora activa azul + sombra confirmados; jugué el Reto de Cultura General completo (20 preguntas) y confirmé que el link de WhatsApp se arma con el puntaje y tiempo reales interpolados correctamente. Consola sin errores en todo el recorrido.

## Banderas reales animadas (2026-08-23)
El usuario pidió reemplazar el círculo de color plano por la bandera real de cada país (con movimiento tipo banderín), tanto en la lista de la Ruta como en la franja superior de la pantalla de país (Colombia, Perú y Chile). Implementado:
- **`lib/flag-colors.ts`** (nuevo): hex oficiales de las 3 banderas — separado de `components/` a propósito porque el hook de diseño marca cualquier hex directo en archivos de UI (correcto para colores de marca, pero estos son datos geográficos fijos, no una decisión de paleta).
- **`components/app/CountryFlag.tsx`** (nuevo): SVG real de Colombia/Perú/Chile (proporciones y colores oficiales) + una animación sutil de "banderín al viento" (`rotateY`/`skewY` en loop con Motion, con perspectiva), respeta `prefers-reduced-motion`. Expone `paisTieneBandera()` para que los países sin bandera construida sigan usando el círculo de color como respaldo.
- Reemplazado en `app/app/ruta/[rutaId]/page.tsx` (círculo de la lista → bandera circular animada) y en `app/app/pais/[pais]/page.tsx` (la franja superior con el nombre del país ahora tiene la bandera de fondo, animada, con el mismo degradado oscuro encima para que el título en blanco siga siendo legible).

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (usando `build`+`start` en modo producción por la inestabilidad conocida de `next dev`) · confirmado en el navegador: 3 SVGs de bandera presentes en la Ruta 1 con los colores exactos de Colombia (`#FCD116`/`#003893`/`#CE1126`); la franja superior de Colombia muestra la bandera de fondo con el título blanco legible; Chile (aún bloqueado) sigue redirigiendo correctamente a la vista de ruta. Consola sin errores.
Se verificó de paso que el sonido de los últimos 5 segundos (pedido de nuevo por el usuario) sigue intacto en `[ronda]/page.tsx` y `reto-final/page.tsx` — no hubo regresión.

## Fix: bandera cortada en la franja del país (2026-08-23)
El usuario reportó (con capturas) que la bandera en la franja superior de la pantalla de país se veía cortada/irreconocible. Causa raíz: `CountryFlag` solo tenía un modo de ajuste, `preserveAspectRatio="xMidYMid slice"` (recortar para llenar) — apropiado para el ícono circular chico de la lista, pero en la franja ancha y baja (343×112px vs. la proporción 3:2 de una bandera) recortaba tanto que solo se veía una franja de 1-2 colores, no la bandera completa.
Corregido: `CountryFlag` ahora acepta `ajuste="cubrir" | "contener"` — `"contener"` (`xMidYMid meet`) escala la bandera COMPLETA para que quepa entera, centrada, sin recortar; el espacio sobrante (por el descuadre de proporciones) se rellena con el color de fondo de esa bandera (ej. el azul de Colombia) en vez de quedar vacío. La franja de país (`app/app/pais/[pais]/page.tsx`) ahora usa `ajuste="contener"`; el ícono circular de la lista de rutas se queda en `"cubrir"` (recortar ahí sí se ve bien, como una foto de perfil).
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ (build+start en producción) · confirmado por geometría real en el navegador: el SVG de la bandera mide 343×112px con `preserveAspectRatio="xMidYMid meet"`, y el contenedor tiene de fondo el azul oficial de Colombia (`rgb(0,56,147)`) rellenando el sobrante. Consola sin errores.

## Onboarding reconstruido: "Value Before Sign-Up" (2026-08-24)
El usuario pidió (spec formal basada en Duolingo/Trivia Crack/Notion) reestructurar el onboarding de 11 pasos genéricos a un flujo de 5 pasos con recompensa antes del registro. Pidió explícitamente AJUSTAR el existente, no crear uno paralelo. Reescrito `app/onboarding/page.tsx` completo (7 pasos internos):
1. **Hook interactivo**: primera pregunta real (capital de Colombia) ANTES de cualquier dato personal — acierto = confetti + 10 monedas + sonido de victoria; fallo = sigue sin castigar (nunca bloquea el flujo).
2. **Motivación** (3 tarjetas: viajar/mente/competir).
3. **2 categorías favoritas** (selección múltiple exacta de 2, con contador; auto-avanza al llegar a 2).
4. **Minutos/día** (chips 3/5/10, antes era un slider).
5. **Animación "radar"** + revelación del `RouteBoardingPassCard` de la Ruta 1 ya con copy personalizado ("priorizando X y Y").
6. **Recordatorio** (selector de hora + "Activar mi recordatorio diario" — solo UI, push real es Sesión 6).
7. **Muro de registro suave** (Google/Apple/Email/Invitado) con "guarda tus N monedas iniciales".

### Integración real (antes el onboarding vivía aislado)
- `AppState` ganó `categoriasFavoritas: Categoria[]` (bump v4→v5, `conquesta_app_state_v5`). Nueva función `aplicarRecompensaOnboarding()` que al terminar el onboarding SÍ escribe en el estado real de la app (monedas ganadas + categorías + arranca la racha) — antes esto no pasaba nunca.
- **`estadoInicial()` dejó de tener progreso falso de fábrica** (antes: 75 monedas y Geografía/Explorador "completado" sin que el usuario jugara nada) — ahora arranca en 0 de verdad, porque el onboarding es quien otorga las primeras monedas reales.
- **Personalización real**: nueva `categoriasOrdenadasPorFavoritas()` — la grilla de categorías de la pantalla de país pone primero las 2 favoritas elegidas en el onboarding (verificado: Historia/Naturaleza aparecieron primero tras elegirlas).
- `lib/onboarding-data.ts`: `OnboardingState` reescrito (v1→v2) con los campos nuevos (motivación, categoriasFavoritas, minutosDia, horaRecordatorio).
- Nuevo componente `components/app/onboarding/IconOptionCard.tsx` (tarjetas con ícono + sombra suave para motivación/categorías).

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ · jugué el flujo COMPLETO de punta a punta en el navegador (producción): pregunta hook respondida correctamente → avanzó; motivación → categorías (confirmé que selecciona 2 y auto-avanza, antes de eso probé con clics mal cronometrados y se comportó bien, era ruido de mi propio script de prueba); minutos/día; pantalla de ruta personalizada mostrando exactamente "Historia y Naturaleza" (mis elecciones); recordatorio; registro (mostraba "0 monedas" en pantalla por el mismo artefacto de pestaña en 2do plano ya documentado antes — confirmé por `localStorage` que el dato real SÍ era 10); al continuar como invitado, el Mapa mostró 10 monedas y racha 1 REALES (ya no simulados); y la pantalla de Colombia mostró Historia/Naturaleza primero en la grilla. Consola sin errores reales.

## Hook del onboarding: 1 pregunta por categoría (2026-08-24)
El usuario pidió más preguntas en el hook — 1 por categoría en vez de una sola de Geografía, para mostrar la variedad de la app desde el primer minuto. Reescrito `HookScreen` en `app/onboarding/page.tsx`: ahora son 6 preguntas reales (la más fácil de cada categoría, tomadas de `BANCO_COLOMBIA` vía `lib/trivia-content-colombia.ts`), en orden barajado y con sus opciones también barajadas (`shuffleOpciones` de `lib/trivia-bank.ts`, mismo mecanismo anti-sesgo que el resto del juego). Cada acierto suma 5 monedas (antes: 10 fijas por una sola pregunta, acierto/fallo binario); el total se calcula sobre los aciertos reales y se aplica al estado de la app al terminar el onboarding (sin cambios en esa integración, ya construida antes).
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ · en el navegador (producción, `localStorage` limpio) jugué las 6 preguntas — confirmé que aparecen las 6 categorías en orden aleatorio, cada una con su pregunta real distinta, y que el conteo final de monedas coincide exactamente con los aciertos reales detectados (1 acierto → 5 monedas guardadas). Consola sin errores reales.

## Botón de volver en las pantallas de juego (2026-08-24)
El usuario reportó (con captura) que la pantalla de ronda no tenía forma de volver a las categorías. Corregido: se agregó un botón de flecha atrás en `[ronda]/page.tsx` (vuelve a la selección de ronda de esa categoría) y en `reto-final/page.tsx` (vuelve a la pantalla del país) — ninguna de las dos pantallas de juego tenía navegación de salida antes de esto.
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ · confirmé en el navegador que ambos botones existen y que el de la ronda navega correctamente de vuelta a la pantalla de categorías. Consola sin errores.

## Retos 1 a 1: confirmado que se construyen en Sesión 6 con Supabase (2026-08-24)
El usuario preguntó qué hacían "Tu turno" / "Esperando respuesta" / "Historial" en la pantalla de Retos — eran datos de mentira (`RETOS_SEMILLA`), el botón "Jugar" ni siquiera era un `<button>`, solo un `<span>` decorativo. Se le explicó la dinámica real que deberían tener (1 vs 1 asíncrono: mismo set de preguntas, comparar puntaje) y que sincronizar dos jugadores de verdad necesita backend (Supabase). El usuario **decidió esperar a la Sesión 6** para construirlo bien en vez de una versión "lite" ahora.
Mientras tanto, se quitó el mock engañoso: `lib/app-state.ts` ya no siembra `RETOS_SEMILLA` (el campo `retos: Reto[]` del `AppState` se queda vacío `[]` — el tipo se conserva, es el modelo de datos correcto para cuando se construya de verdad). `app/app/retos/page.tsx` simplificado: solo queda el Reto de Cultura General (100% real y funcional) + un aviso honesto de "muy pronto" en vez de las 3 secciones falsas.
**Pendiente de diseño para la Sesión 6** (documentado aquí para no re-preguntarlo): Reto 1 a 1 = invitas a un amigo (link/código) → ambos juegan el MISMO set de preguntas de forma asíncrona (no en vivo) → cuando ambos terminaron, se comparan puntajes y tiempo → el ganador queda en el Historial. Necesita: tabla de retos en Supabase, sistema de invitación (link único), y notificación cuando el rival responde.
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ · confirmado en el navegador que la pantalla de Retos ya no muestra a Marta R./Julián C./Sofía T. (datos falsos) y en su lugar aparece el aviso honesto. Consola sin errores.

## Franja del país: bandera SVG animada → foto real del usuario (2026-08-24)
El usuario proporcionó 3 imágenes fotorrealistas propias (collage turístico por país: bandera + hitos + fauna/flora + gastronomía) y pidió reemplazar el gráfico de bandera de la franja superior de la pantalla de país por estas fotos. Archivos guardados por el usuario en `public/images/` con nombres inconsistentes ("imagen Colombia.png", etc.) — renombrados a `colombia.png`/`peru.png`/`chile.png` (kebab-case, sin espacios) para evitar fragilidad de URL-encoding.
- **`lib/countries-data.ts`**: `Pais` ganó campo opcional `imagen?: string`; poblado para Colombia/Perú/Chile con `/images/{pais}.png`.
- **`app/app/pais/[pais]/page.tsx`**: la franja superior reemplaza `CountryFlag` (SVG animado) por `next/image` (`fill`, `sizes`, `priority`, `object-cover`, `objectPosition: "center 40%"`) cuando `paisInfo.imagen` existe, con fallback al color de bandera plano si no (países de Rutas 2/3, sin foto todavía). Se mantiene el mismo degradado oscuro encima para que el título en blanco siga legible. `CountryFlag` sigue en uso en `app/app/ruta/[rutaId]/page.tsx` (ícono circular animado de la lista) — sin cambios ahí.
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ (build+start en producción) · confirmado en el navegador para los 3 países (Perú/Chile desbloqueados temporalmente vía `localStorage` solo para la prueba, revertido después): las 3 fotos reales cargan (red 200 en `_next/image`), se ven completas y reconocibles (bandera + Machu Picchu/cóndor en Perú, Torres del Paine/glaciar en Chile, torre de Cartagena/colibrí en Colombia), el degradado mantiene el título blanco legible en los 3 casos. Consola sin errores en ninguno.

## Fix: onboarding estirado en pantallas de escritorio (2026-08-24)
El usuario notó (con captura en navegador de escritorio) que el onboarding se veía estirado a todo el ancho, sin la columna centrada tipo celular que sí tienen `/app` y `/paywall`/`/login`. Causa raíz: el contenedor raíz de `app/onboarding/page.tsx` (`OnboardingFlow`) nunca tuvo el wrapper `mx-auto w-full max-w-sm` que sí existe en `app/app/layout.tsx` (línea 7) y en `/paywall`/`/login` — solo algunos elementos internos sueltos tenían `max-w-xs`, pero nada limitaba el ancho total de la pantalla. En el celular real (≤384px) no se nota porque `max-w-sm` (384px) nunca entra en juego; en escritorio se estiraba tanto como la ventana.
Corregido: se agregó `mx-auto w-full max-w-sm` al div raíz de `OnboardingFlow`, igual que el resto de la app.
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · confirmado en el navegador (build+start) en ancho de escritorio (columna centrada tipo celular, ya no estirada) y en 375px (mobile preset, se ve idéntico a antes — sin regresión). Consola sin errores en ambos anchos.

## Sellos del pasaporte: lógica real + apariencia de tinta (2026-08-24)
El usuario pidió (con captura de Perfil) que los sellos reflejaran de verdad qué países están habilitados en América, y que se vieran como un sello de pasaporte real (no un círculo de color plano). Se encontraron y corrigieron 2 bugs reales al revisar `app/app/perfil/page.tsx`:
1. **"Desbloqueado" se calculaba con `p.esGratis`** (un dato de PRECIO) en vez del desbloqueo real de juego — por eso los 3 países de la Ruta 1 aparecían siempre disponibles aunque el usuario no hubiera conquistado el anterior.
2. **"Conquistado" se calculaba con el progreso de Colombia (`pctColombia === 100`) para los 15 países por igual** — Perú y Chile hubieran mostrado sello verde de "conquistado" en cuanto Colombia llegara al 100%, sin haber jugado ni una pregunta de esos países.
3. **Bug real encontrado de paso en `lib/app-state.ts`**: `paisDesbloqueadoEnRuta()` solo validaba la secuencia DENTRO de una Ruta, pero nunca si la Ruta en sí estaba desbloqueada — así que Brasil y México (primeros países de las Rutas 2 y 3, ambas bloqueadas) se calculaban como "desbloqueados" tanto en Perfil como en el guard real de `/app/pais/[pais]`. Corregido agregando la validación `rutaDesbloqueada(state, ruta)` al inicio de la función — beneficia a toda la app, no solo a Perfil.

Reescrito con estado real de 3 valores (`conquistado` = `retoFinalCompletado` de ESE país · `desbloqueado` = `paisDesbloqueadoEnRuta` ya corregido · `bloqueado` = resto) en vez de 2 estados mal calculados.

**Apariencia de sello real** (`components/app/PassportStamp.tsx`, nuevo): el estado "conquistado" ahora es un SVG con doble anillo (grueso exterior + fino interior), texto en arco "★ AMÉRICA ★" siguiendo el borde superior, rotado -8° (como un sello estampado a mano, no perfectamente alineado), con `feTurbulence`+`feDisplacementMap` (filtro SVG) para dar textura rugosa de tinta a los bordes, y `mix-blend-mode: multiply` para que se vea como tinta real sobre el papel del pasaporte, no un ícono plano. El estado "desbloqueado" usa un círculo de borde punteado (el "sello en blanco", esperando ser estampado); "bloqueado" se mantiene como candado gris simple.

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · confirmado en el navegador (build+start, 375px): con estado limpio, solo Colombia aparece "desbloqueado" (círculo punteado azul) y las 14 restantes candado gris — ya NO aparecen Brasil/México con círculo punteado como antes del fix. Simulando Colombia conquistada por `localStorage`, el sello de Colombia se ve como sello de tinta real (verde, doble anillo rugoso, texto en arco, rotado) y Perú pasa correctamente a "desbloqueado" (círculo punteado) sin tocar Chile ni el resto. Consola sin errores en ambos escenarios. `localStorage` de prueba revertido al terminar.

## Paywall rediseñado + gating Free/Pro real + trial de 7 días (2026-09-01)
El usuario pidió aplicar los principios de paywall de alta conversión investigados (RevenueCat/Adapty 2026 + `02B-ONBOARDING-Y-PAYWALL.md`) al paywall real de Conquesta. Al revisar el código para conectar el disparador ("aparece justo tras conquistar Colombia"), se encontró que **la restricción Free/Pro nunca se había implementado**: Perú y Chile estaban marcados `esGratis: true` en `lib/countries-data.ts` (contradiciendo la decisión ya documentada arriba de reducir el free a solo Colombia) y ninguna pantalla validaba acceso Pro — toda la Ruta 1 era jugable gratis de punta a punta.

### Corregido de raíz
- **`lib/countries-data.ts`**: Perú y Chile → `esGratis: false`.
- **`lib/app-state.ts`**: `AppState` ganó `trialInicioFecha: string | null` (bump v5→v6, `conquesta_app_state_v6`). Funciones nuevas: `diaDeTrial()`, `estaEnTrial()`, `esPro()` (mock: hoy "Pro" = trial activo; el día que exista el webhook de Hotmart en Sesión 6, solo esta función cambia, ninguna pantalla), `iniciarTrial()` (idempotente), `puedeJugarPais()` (combina el desbloqueo secuencial de Ruta + si el país requiere Pro).
- **Gating real cableado en 3 pantallas** que antes no lo tenían: `/app/pais/[pais]` (guard: redirige a `/paywall` si toca en secuencia pero requiere Pro — antes se podía entrar por URL directa a Perú/Chile sin restricción), `/app/ruta/[rutaId]` (badge dorado "Pro" en vez de círculo azul falso-disponible, enlaza a `/paywall`), `/app/perfil` (4º estado de sello `requierePro`, corona dorada, enlaza a `/paywall`).

### Paywall rediseñado (`app/paywall/page.tsx`) aplicando los 7 puntos acordados
Envuelto en `AppStateProvider` (antes no leía estado real). Encabezado personalizado ("Colombia ya es tuyo — sigue a Perú" si aplica, con racha/países conquistados reales visibles — antes bienvenida genérica sin datos), objeción de oro explícita ("lo que desbloqueas es tuyo para siempre", antes solo en la landing), anual preseleccionado como $3.33/mes con el mensual como ancla + badge "ahorra 17%", copy honesto de cobro ("se cobra automáticamente al terminar el día 7 — te avisamos antes", sin fecha inventada), CTA "Empezar mi conquista — 7 días gratis" que ahora sí activa `iniciarTrial()` de verdad (antes solo guardaba `plan_elegido` y mandaba a `/login` sin activar nada), salida limpia a `/app` (antes mandaba a `/login` también, redundante con el registro que ya vive en el onboarding).

### El momento del paywall + indicador de trial
- **`app/app/jugar/[pais]/reto-final/page.tsx`**: al conquistar Colombia (único país gratis) sin ser Pro todavía, el botón principal de la pantalla de victoria cambia a "Seguir mi conquista" (va a `/paywall`) con "Volver al mapa" como salida secundaria — el paywall se ofrece como el paso siguiente natural (Cal AI/Noom), nunca como redirección forzada (eso sería el dark pattern que el propio `02B` prohíbe).
- **`components/app/shell/TopBar.tsx`**: pill "Prueba Pro · Día X de 7" (neutro, sin countdown de alarma) visible en el Mapa mientras el trial está activo, con enlace a "Ver plan".

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · en el navegador (build+start): con Colombia marcada conquistada por localStorage, Perú mostró correctamente el badge "Pro" (antes de este fix se veía disponible sin serlo) y Chile siguió bloqueado por secuencia; entrando por URL directa a `/app/pais/Perú` sin ser Pro, redirigió a `/paywall` (el guard real funciona); el paywall mostró el encabezado y las estadísticas personalizadas correctas; al tocar "Empezar mi conquista" se guardó `trialInicioFecha` real en el estado, redirigió a `/app`, y el TopBar mostró "Prueba Pro · Día 1 de 7"; con el trial activo, `/app/pais/Perú` se volvió jugable (0%, sin redirección) y Chile se mantuvo bloqueado por secuencia (correcto: el trial da acceso Pro, no salta el orden de conquista). Consola sin errores nuevos en cada paso (se depuró un error viejo de una prueba de `localStorage` mal formada, no del código). `localStorage` de prueba revertido al terminar.
⚠️ No se jugó de punta a punta el Reto Final real para ver el botón "Seguir mi conquista" en pantalla (haría falta responder ~10-20 preguntas reales); la condición que lo activa (`pais === "Colombia" && conquistado && !esPro(state)`) reutiliza variables y el mismo patrón condicional ya verificado en esta pantalla, y pasó `tsc`/`build` limpio — recomendado que el usuario lo confirme jugando una vez.

## Datos reales de Europa y Asia en el modal de continente bloqueado (2026-09-01)
El usuario entregó el diseño de rutas de Europa (Cuna Clásica: España→Francia→Italia, insignia "Explorador Mediterráneo" · Ruta Imperial: Alemania→Austria→Grecia, "Guardián Imperial" · Norte Nórdico: Reino Unido→Países Bajos→Suecia, "Navegante del Norte") y Asia (Imperios del Este: Japón→Corea del Sur→China, "Maestro del Sol Naciente" · Seda y Especias: India→Tailandia→Vietnam, "Ruta de las Especias" · Oasis del Desierto: Emiratos Árabes Unidos→Turquía→Catar, "Pionero de Oriente"). Alcance explícito del usuario: solo el dato de configuración, no contenido de trivia todavía.

- **`lib/countries-data.ts`**: `PAISES_EUROPA` y `PAISES_ASIA` (18 países nuevos, código+color de bandera+orden, `esGratis:false`, sin `imagen` — se agrega en la sesión de contenido real). Nueva `paisPorNombreMundo()` que busca en los 3 continentes (usada solo por el modal de vista previa).
- **`lib/rutas-data.ts`**: `RUTAS_EUROPA` y `RUTAS_ASIA` (mismo shape `Ruta` que América: id, nombre, tema, países en orden, insignia). A propósito NO se enlazaron en `rutaPorId`/`rutaDelPais` (esas siguen resolviendo solo América) — así ninguna pantalla de juego real las trata como jugables por error; siguen existiendo solo para mostrarse en el modal de continente bloqueado.
- **`app/app/page.tsx`**: el modal de vista previa de continente (antes mostraba "Ruta 1 — por anunciar" genérico ×3) ahora reemplaza `CONTINENTES_BLOQUEADOS` con los arrays reales y renderiza nombre de ruta + secuencia de códigos con ícono de avión + insignia — sigue marcado como bloqueado/próximamente (candado, sin poder tocar), honesto con que el contenido de preguntas no existe aún.

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · en el navegador (build+start): el modal de Europa muestra "Ruta 1: Cuna Clásica — ESP ✈ FRA ✈ ITA · Insignia 'Explorador Mediterráneo'" y las otras 2 rutas correctamente; el modal de Asia muestra las 3 rutas de Asia con sus códigos e insignias reales. Consola sin errores en ambos.

## Diseño de Ligas Semanales para el Ranking — pendiente de Sesión 6 (2026-09-01)
El usuario preguntó cómo generar más interés real por el Ranking (hoy: 3 pestañas Semanal/Mensual/General, todas mostrando el mismo puñado de 5 personas **inventadas** — Marta R./Julián C./Sofía T./Andrés P./Camila G. en `app/app/ranking/page.tsx`, el mismo tipo de dato falso que ya se quitó de "Retos"). Se le explicó el patrón probado (`24-GAMIFICACION.md` → "Mecánica 6 — Ligas y comparación social", modelo Duolingo) y pidió diseñarlo para conectar cuando exista Supabase (Sesión 6). Diseño acordado, **sin tocar código todavía** (no hay backend real para sostenerlo):

### La mecánica
- **Cohortes semanales de ~30 jugadores de nivel similar** (nunca contra el ranking global de siempre-los-mismos-arriba — eso desmoraliza al resto, regla de `24`/`11`).
- **5 ligas temáticas** (ascendente, con la identidad de pasaporte/conquista de la app — distintas de los nombres de ronda Explorador/Descubridor/Experto para no confundir): **Liga Turista → Liga Viajero → Liga Trotamundos → Liga Embajador → Liga Leyenda del Mapa** (tope, sin ascenso, solo se defiende el puesto).
- **Puntos de liga semanales** (NO las monedas/gemas de siempre — un jugador viejo con muchas monedas no debe dominar para siempre; se resetean a 0 cada lunes): aciertos en cualquier ronda (+2 c/u), Reto Final conquistado (+50 bonus), Reto de Cultura General jugado (+1 por acierto), mantener la racha ese día (+5).
- **Promoción/descenso** al cierre de semana (domingo 23:59, cálculo la madrugada del lunes): top ~7 suben de liga, últimos ~5 bajan, el resto (~18) se queda — competencia con consecuencia real sin que la mayoría se sienta perdedora.
- **Fallback de app nueva con pocos usuarios** (riesgo real al lanzamiento): si la cohorte tiene <10 jugadores activos esa semana, mostrar "Aún reclutando viajeros para tu liga esta semana" en vez de un ranking vacío/deprimente, y comparar contra el propio récord de la semana anterior mientras tanto — nunca dejar la pantalla vacía ni con menos de 10 personas visibles como si fuera el ranking real.

### Modelo de datos (borrador Supabase, se decide/ejecuta técnico en Sesión 6, no se le pregunta al usuario)
```sql
ligas (id, nombre, nivel int, orden int)                    -- catálogo estático de las 5 ligas
cohortes_semana (id, liga_id, semana_inicio date, semana_fin date)
cohorte_miembros (id, cohorte_id, user_id, puntos_semana int default 0, posicion int, updated_at)
```
Los puntos se incrementan vía función de servidor (RPC), nunca un `UPDATE` directo del cliente (evita tramposos). RLS: cada usuario lee todos los miembros de SU cohorte (join por `cohorte_id`), pero solo puede afectar su propia fila, y solo a través de la función RPC. Asignación a cohorte: al inicio de cada semana, una función asigna al usuario a una cohorte de su liga actual con cupo (<30), o abre una nueva.

### Pantalla (`/app/ranking` — reemplaza las 3 pestañas actuales)
- Header: liga actual del jugador + cuenta regresiva a fin de semana (no las pestañas Semanal/Mensual/General, que hoy no hacen nada real distinto entre sí).
- Línea divisoria visual: zona verde de ascenso (arriba del corte top 7) / zona neutra / zona roja de descenso (últimos 5) — igual que Duolingo, para que el jugador vea de un vistazo dónde está parado.
- Momento de cierre de semana (`56-MOMENTOS-EMOCIONALES.md`): pantalla de celebración con confetti si asciende ("¡Subiste a Liga Trotamundos!"); mensaje neutral y motivador si desciende (nunca humillante — "Esta semana bajaste a Liga Viajero, la próxima vuelves a subir").

### Estado del código HOY (sin cambios en esta ronda)
`app/app/ranking/page.tsx` sigue con las pestañas y los 5 jugadores falsos — deliberadamente no tocado esta vez porque el usuario pidió solo el DISEÑO para cuando haya Supabase, no un cambio de código ahora. Queda anotado aquí para no reconstruir esta conversación cuando llegue la Sesión 6.

## Nav inferior flotante + animación de burbuja entre secciones (2026-09-01)
El usuario compartió una imagen de referencia (nav flotante tipo pastilla, ícono activo elevado en un círculo de color) y pidió el mismo comportamiento manteniendo el diseño propio de la app (mismos íconos/labels/rutas — la referencia era de INTERACCIÓN, no de paleta). Reescrito `components/app/shell/BottomNav.tsx`:
- Contenedor `rounded-full` con margen (`px-4` + `pt-2`) en vez de barra pegada de borde a borde — flota sobre el contenido con sombra elevada.
- El ítem activo se eleva (`y: -14px`) con una burbuja circular `bg-brand-primary` detrás del ícono, que usa `layoutId` de Motion ("magic move") para deslizarse suavemente entre posiciones cuando cambia de sección — antes el cambio de activo era un salto de color plano sin transición.
- `whileTap` (scale 0.88) para feedback táctil inmediato, y guard de `useReducedMotion()` (mismo patrón que `CategoryIcon`/`CountryFlag`): con movimiento reducido, la burbuja no se eleva ni desliza con spring, se posiciona directo.
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · en el navegador (build+start, 375px): confirmé visualmente el nav flotante con la burbuja azul elevada bajo "Mapa"; al navegar a Perfil, la burbuja se deslizó y ahora está bajo "Perfil" (Mapa volvió a su estado plano) — la animación de transición entre secciones funciona. Consola sin errores.

## GIFs de celebración/consuelo en TODAS las pantallas de resultado (2026-09-01)
El usuario pidió el GIF de victoria en la pantalla de ronda aprobada, luego pidió extenderlo a "todas las pantallas cuando gane la ronda", y de inmediato pidió también un GIF de "casi lo logras" (perder) — ambos archivos aparecieron en `Downloads/` (no llegan por un path directo al pegarse en el chat, mismo caso ya documentado con el logo): `congrats.gif` (sello dorado animado, victoria) y `Try Again.gif` (emoji triste + texto "TRY AGAIN", derrota). Copiados a `public/gifs/congrats.gif` y `public/gifs/casi-lo-logras.gif`.
Reemplazado el círculo de color + ícono Lucide (Trophy/Stamp/Check) por el GIF correspondiente (`<img>` plano, no `next/image` — el optimizador de Next reprocesa el formato y le quita la animación a los GIF) en las 3 pantallas de resultado reales de la app, cada una con su propia condición de victoria:
- `app/app/jugar/[pais]/[categoria]/[ronda]/page.tsx` — `aprobado` (≥80% de la ronda).
- `app/app/jugar/[pais]/reto-final/page.tsx` — `conquistado` (≥70% del Reto Final).
- `app/app/retos/desafio/page.tsx` — `buenNivel` (≥70% del Reto de Cultura General).
Los imports de íconos que quedaron sin uso (`Trophy`, `Stamp`) se quitaron de sus archivos.

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · confirmado que ambos GIF se sirven íntegros (`Content-Type: image/gif`, tamaño completo, sin recompresión) · jugué las 3 pantallas de punta a punta, tanto ganando como perdiendo:
- Ronda Explorador de Geografía (Colombia): 5/5 respondiendo bien de verdad (consultando `lib/trivia-content-colombia.ts` para saber la respuesta correcta) → GIF de victoria confirmado por screenshot; y 1/5 a propósito → GIF de "casi lo logras" confirmado.
- Reto Final de Colombia: 5/20 a propósito → GIF de "casi lo logras" confirmado por screenshot.
- Reto de Cultura General: 7/20 a propósito → GIF de "casi lo logras" confirmado por screenshot (incluye el texto "TRY AGAIN" del GIF, visible y animado).
Consola sin errores en los 5 escenarios. `localStorage` de prueba revertido al terminar.

## Logo real (isotipo 3D) reemplaza el logomark plano placeholder (2026-09-01)
El usuario compartió el isotipo oficial de Conquesta (el mismo "C" 3D con globo/compás/avión que ya se había descrito antes, pero esta vez el archivo sí llegó — `LOGO CONQUESTA (2).png`, encontrado en `Downloads/`) y pidió quitarle el fondo, recortar bordes sobrantes y ponerlo donde corresponde. El archivo YA tenía canal alfa real (fondo transparente de fábrica, confirmado con `sharp`) — no hizo falta quitar fondo, solo recortar el sobrante transparente.
- Recortado con `sharp().trim()` (de 1254×1254 con márgenes a 917×1034 ajustado al contenido real) → `public/logo/conquesta-logo.png` (master, usado en `next/image` donde se necesite el logo a color).
- Generado favicon cuadrado 512×512 con margen proporcional sobre lienzo transparente → `app/icon.png` (reemplaza `app/icon.svg`, que se eliminó — Next.js App Router detecta `icon.png` por convención de archivo, sin tocar `layout.tsx`).
- `app/login/page.tsx`: el logo del header ahora usa `next/image` apuntando al PNG real en vez del componente `ConquestaLogo` (logomark plano/vectorial construido como placeholder en una sesión anterior porque el archivo del usuario no llegaba). Ese componente (`components/app/ConquestaLogo.tsx`) se eliminó — sin más usos en el código tras el reemplazo.

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (18 rutas, incluida `/icon.png` reemplazando `/icon.svg`) · en el navegador: `/icon.png` sirve un PNG 512×512 real; `/login` muestra el isotipo a color junto a "Conquesta" en el header (confirmado por screenshot, con `naturalWidth/Height` reales vía DOM); la landing (`/`) sigue cargando sin errores. Consola sin errores en ninguna pantalla.
⚠️ Alcance de esta ronda: solo favicon + header de Login (los 2 lugares donde ya existía un logomark antes). La landing (`/`) no tiene hoy una barra de header con logo — si se quiere agregar el isotipo ahí también, es una pieza de diseño nueva (no un reemplazo), pendiente de que el usuario lo pida.

## Header de marca agregado a la landing (2026-09-01)
El usuario pidió agregar el isotipo real también en la página de ventas, que hasta ahora no tenía ninguna barra de header (iba directo al Hero). Nuevo `components/app/landing/Header.tsx`: franja sticky superior con el logo real + "Conquesta" (mismo patrón que Login) y un enlace "Iniciar sesión" a `/login` a la derecha — pieza nueva, no un reemplazo, ya que no existía nada ahí antes. Insertado en `app/page.tsx` antes del `<Hero />`.
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · confirmado en el navegador (build+start, 375px): el header aparece fijo arriba con el logo real, "Conquesta" y "Iniciar sesión" (link verificado por DOM: `href="/login"`). Consola sin errores.

### Aclaración de assets: el usuario compartió una 2ª imagen (`logo1conquesta.png`) preguntando si era "el logo"
Es un archivo DISTINTO al ya integrado: el mismo ícono pero con la palabra "CONQUESTA" incluida dentro del propio gráfico, sobre fondo BLANCO SÓLIDO (sin canal alfa, a diferencia del primero que sí tenía transparencia real). Se le explicó al usuario la diferencia y se recomendó no usarlo en los headers ya construidos (duplicaría el texto "Conquesta" y el fondo blanco se vería como un recuadro sobre el fondo gris claro de la app) — ese archivo queda mejor como pieza de marca independiente (ícono de tienda de apps, redes sociales) si más adelante se necesita. No se tocó código con ese archivo; sigue sin usar en `Downloads/`, no copiado al proyecto.

## Logo completo (con la palabra CONQUESTA) procesado y agregado al Ranking (2026-09-01)
El usuario confirmó que sí quiere usar la 2ª variante del logo (`logo1conquesta.png`, ícono + "CONQUESTA" en el mismo gráfico) y pidió que el logo se vea en la pantalla del Ranking.
- **Quitar el fondo blanco requirió 2 intentos**: el primero usó un umbral global de "qué tan blanco es el píxel" — funcionó para el fondo, pero también volvió transparentes las letras BLANCAS de "CONQUESTA" (mismo criterio de color, texto arruinado). Corregido con relleno por inundación (flood fill) desde los 4 bordes de la imagen: solo el blanco CONECTADO al borde se vuelve transparente; el blanco aislado en el interior (las letras) se conserva intacto. Verificado componiendo el resultado sobre un fondo verde de prueba antes de dar por bueno el recorte (primera vez con el texto vuelto verde-transparente, el bug quedó visible ahí mismo).
- Guardado recortado y con transparencia real en `public/logo/conquesta-logo-full.png` (982×1079).
- **`app/app/ranking/page.tsx`**: agregado el logo centrado arriba del título "Ranking" (h-16), con `next/image`.

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · verificación de transparencia por lectura de canal alfa (esquinas alpha=0, centro alpha=255 — no solo visual, dato real de píxel) antes de integrarlo · confirmado en el navegador (build+start, 375px): el logo completo se ve centrado arriba de "Ranking", con fondo transparente real (sin recuadro blanco) y el texto "CONQUESTA" legible. Consola sin errores.

## Video promocional en el Mapa (2026-09-01)
El usuario marcó con un círculo el espacio vacío debajo de las 3 tarjetas de ruta en el Mapa y pidió integrar un video (avión sobrevolando el globo, `Airplane_flying_over_globe_anima…_202609012224.mp4` — encontrado en `Downloads/`, copiado a `public/videos/avion-mundo.mp4`) con una superposición de texto motivacional.
`app/app/page.tsx`: nueva tarjeta `rounded-2xl` + `shadow-lg` (mismo lenguaje visual que las tarjetas de ruta de arriba) con `<video autoPlay loop muted playsInline>` de fondo, un degradado oscuro `from-black/75` encima para legibilidad, y el texto pedido literal: título "¿Listo para tu próximo destino?" + subtítulo "Completa tus trivias diarias y desbloquea Europa."
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · confirmado en el navegador que el video SÍ reproduce de verdad (no es una imagen estática): `paused:false`, `currentTime` avanzando, 1280×720, loop activo, silenciado (autoplay real en Chrome requiere `muted`). Texto superpuesto legible sobre el degradado. Consola sin errores.

## Bug real: "Cerrar sesión" no hacía nada (2026-09-01)
El usuario preguntó cómo volver a la página de ventas estando dentro de la app — se confirmó que NINGUNA pantalla tenía un enlace de vuelta a `/`, y de paso se encontró que el botón "Cerrar sesión" de Perfil (`app/app/perfil/page.tsx`) no tenía `onClick` en absoluto: un botón muerto, violando la regla de UX "todo elemento interactivo hace algo". Corregido: ahora navega a `/` (la página de ventas) — no se borra el progreso guardado (no hay auth real todavía, borrar `localStorage` sería destructivo y no fue lo pedido).
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · confirmado en el navegador que tocar "Cerrar sesión" navega de verdad a la landing completa (con el nuevo header de marca incluido). Consola sin errores.

## Logo del header de la landing agrandado (2026-09-01)
El usuario marcó con un círculo el header de la landing pidiendo el logo más grande. `components/app/landing/Header.tsx`: el ícono pasó de `h-8` (32px) a `h-11` (44px), con el texto "Conquesta" subido de `text-base` a `text-lg` para mantener la proporción del lockup.
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · confirmado por screenshot (build+start, 375px) que el logo se ve notablemente más grande sin romper la barra. Consola sin errores.

## Video del Mapa reemplazado + comprimido (2026-09-01)
El usuario pidió cambiar el video del Mapa por uno nuevo (`Airplane_orbiting_globe_with_letter_202609012309.mp4`, encontrado en `Downloads/`) y comprimirlo para que no pesara tanto. El original pesaba 2.4MB (1280×720, con pista de audio que ni se usa — el `<video>` va `muted`). Sin `ffmpeg` instalado en la máquina, se instaló temporalmente el paquete `ffmpeg-static` (`npm install --no-save`, solo para esta tarea — no quedó en `package.json`/`package-lock.json`, y su carpeta en `node_modules` se borró al terminar) para transcodificar: reescalado a 640×360 (de sobra para el tamaño real en pantalla, ~192px de alto dentro de una columna de ~384px), `libx264` CRF 28, sin audio, `faststart` para reproducción web. Resultado: **276KB (-88.5% vs. el original de 2.4MB)**, calidad visual intacta a su tamaño real en pantalla. Reemplaza el mismo archivo `public/videos/avion-mundo.mp4` (mismo nombre — no hizo falta tocar `app/app/page.tsx`, el overlay de texto ya pedido antes sigue igual).
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · confirmado en el navegador que el nuevo video (globo con el isotipo de Conquesta entre nubes) reproduce de verdad (640×360, `paused:false`, tiempo avanzando) con el texto superpuesto legible y las mismas esquinas/sombra que las tarjetas de arriba. Consola sin errores.

## Música ambiental de fondo, silenciable (2026-09-01)
El usuario pidió un sonido de base para que la app se sintiera más animada, con opción de silenciar. Se recomendaron fuentes libres de derechos (Pixabay Music, YouTube Audio Library, Uppbeat, OpenGameArt); el usuario encontró y compartió la pista: "Marimba Tropical African Travel Game" de Denis Pavlov (Pixabay), copiada de `Downloads/` y comprimida con `ffmpeg` (instalado temporalmente vía `ffmpeg-static`, `npm install --no-save`, y removido de `node_modules` al terminar — no quedó en `package.json`) de 256→128kbps (2.79MB→1.36MB, -51%). Guardada en `public/audio/ambiente-viaje.mp3`.

- **`lib/app-state.ts`**: `AppState` ganó `musicaSilenciada: boolean` (bump v6→v7, `conquesta_app_state_v7`).
- **`components/app/shell/AmbientMusic.tsx`** (nuevo): `<audio loop>` en volumen bajo (0.16, para no competir con los sonidos de acierto/victoria), montado UNA vez en `app/app/layout.tsx` (no se reinicia al cambiar de pantalla dentro de `/app`). Maneja el bloqueo de autoplay-con-sonido de los navegadores: si el primer intento de reproducir falla, reintenta en el próximo click/tap real del usuario.
- **`app/app/perfil/page.tsx`**: nuevo botón "Sonido de fondo: activado/silenciado" junto a "Ajustes de notificaciones", togglea `musicaSilenciada` y persiste.
- **Detalle real encontrado en el camino**: ni `onError` del `<audio>` ni un `fetch HEAD` desde el cliente pueden evitar que el navegador loguee un 404 de red en consola si el archivo no existe — es un comportamiento del propio DevTools, no controlable desde el código de la app. Se resolvió con un flag manual (`PISTA_DISPONIBLE`) que controla si el componente siquiera intenta cargar el audio, en vez de depender de una detección en runtime.

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · en el navegador (build+start, pestaña nueva y limpia): el audio se reprodujo de verdad (`paused:false`, `currentTime` avanzando en tiempo real, volumen 0.16); el botón de Perfil lo silenció (`audioPaused:true`) y lo reactivó correctamente (`audioPaused:false`) en ambos sentidos. Consola sin errores en ningún punto del flujo — incluida la etapa previa (sin el archivo todavía), verificada por separado en una pestaña limpia.

## Botón de silenciar también en el Mapa (2026-09-01)
El usuario pidió el interruptor de sonido también en la pantalla del Mapa (antes solo vivía en Perfil, un lugar poco visible para algo que se quiere apagar rápido). `components/app/shell/TopBar.tsx`: nuevo botón circular pequeño (ícono `Volume2`/`VolumeX`, 28px) junto a los chips de racha/monedas/gemas, togglea `musicaSilenciada` vía `useAppState()` (el componente pasó de recibir solo `state` a también leer `setState` del contexto).
Verificado: `npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · en el navegador (build+start, pestaña nueva para no interferir con la sesión del usuario): confirmé por DOM que el botón cambia de `aria-label` ("Silenciar sonido" ↔ "Activar sonido") y pausa/reanuda el `<audio>` real en ambos sentidos; posición del botón confirmada dentro de la columna de la app, sin desbordarse. Consola sin errores.

## Datos reales de África, Oceanía y Antártida (2026-09-01)
El usuario entregó el diseño de rutas de África (Cuna de Faraones: Egipto→Marruecos→Túnez, "Explorador del Nilo" · Safaris y Sabana: Kenia→Tanzania→Sudáfrica, "Guardián de la Sabana" · Tesoros del Atlántico: Senegal→Ghana→Nigeria, "Pionero del Oeste"), Oceanía (Gran Barrera y Coral: Australia→Nueva Zelanda→Fiyi, "Navegante del Pacífico" · Islas de la Polinesia: Polinesia Francesa→Samoa→Tonga, "Mago de las Islas" · Tierras Australes: Papúa Nueva Guinea→Vanuatu→Nueva Caledonia, "Explorador Coralino") y Antártida (ruta única/desafío extremo: Expedición Polo Sur, Argentina→Chile→Antártida, "Conquistador del Hielo"). Mismo alcance que Europa/Asia: solo datos de configuración para el modal de continente bloqueado, sin contenido de trivia.

- **`lib/countries-data.ts`**: `PAISES_AFRICA` (9), `PAISES_OCEANIA` (9) y `PAISES_ANTARTIDA` (solo `Antártida`, código `ATA` — la ruta de Antártida reutiliza "Argentina"/"Chile", ya existentes en `PAISES_AMERICA`, en vez de duplicarlos). `paisPorNombreMundo()` ahora busca en los 6 continentes.
- **`lib/rutas-data.ts`**: `RUTAS_AFRICA`, `RUTAS_OCEANIA` (3 rutas cada una) y `RUTAS_ANTARTIDA` (array de 1 sola ruta — caso especial documentado en el propio código, el Mapa lo trata igual que los demás).
- **`app/app/page.tsx`**: `CONTINENTES_BLOQUEADOS` ahora tiene 5 continentes (Europa/Asia/África/Oceanía/Antártida) — la fila de pestañas pasó de 3 a 6 en total (contando América) y ya no cabía en una pantalla de 375px, así que se le agregó scroll horizontal (`overflow-x-auto` + `shrink-0` en cada pestaña).
- **Bug de copy real encontrado y corregido**: el modal decía "Estas son las 1 rutas que vienen" para Antártida (mal pluralizado al tener una sola ruta) — ahora usa singular/plural correcto según la cantidad.

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · en el navegador (build+start, pestaña nueva sin interferir con la sesión del usuario): confirmé por DOM los 5 continentes bloqueados visibles, y el contenido de los 3 modales nuevos (África, Oceanía, Antártida) con sus rutas/códigos/insignias reales — incluida la corrección del texto singular de Antártida ("Esta es la ruta que viene..."). Consola sin errores.

## Decisión de diseño anotada: banco de preguntas de Antártida (2026-09-01)
El usuario pidió mantener la MISMA estructura de 6 categorías (Geografía, Historia, Cultura, Gastronomía, Naturaleza, Deportes) para todos los continentes por simplicidad de código — `categoriasDelPais()` sigue siendo genérica, no se crea un caso especial de categorías por continente. Pero para Antártida, el CONTENIDO de las preguntas dentro de esas 6 categorías debe reencuadrarse con perspectiva científica/de expedición/fauna polar (Antártida no tiene gastronomía ni deportes propios en el sentido tradicional de un país). Mapeo acordado para cuando se escriba el banco real (sesión de contenido aparte, junto con Europa/Asia/África/Oceanía):
```
Geografía  → geografía física real: barreras de hielo, cordilleras, polos, bases/estaciones, reclamos territoriales.
Historia   → expediciones históricas: Amundsen, Scott, Shackleton, el Tratado Antártico, el Año Geofísico Internacional.
Cultura    → vida y cooperación internacional en las estaciones de investigación (no cultura nativa — no existe).
Gastronomía→ comida y supervivencia en la base/expedición: raciones históricas, cómo se abastecen las estaciones hoy.
Naturaleza → fauna y flora polar real: pingüinos, focas, ballenas, kril, extremófilos.
Deportes   → hazañas y récords de resistencia polar (carrera histórica al Polo Sur, maratones polares, expediciones deportivas modernas) — no "deportes nacionales".
```
Esto se suma al pendiente ya anotado de contenido real para Rutas 2/3 de América, Europa, Asia, África y Oceanía — todas esperan la misma sesión de contenido (banco de preguntas + fotos + banderas).

## Contenido real de la Ruta 2 (Brasil, Cuba, Costa Rica) — 396 preguntas (2026-09-02)
El usuario confirmó empezar a generar contenido real para Ruta 2 y 3 de América. Escrito el banco completo de Ruta 2 (Ritmo y Trópico), mismo estándar y estructura que Colombia/Perú/Chile (6 categorías × 22 preguntas sin solapamiento entre rondas Explorador/Descubridor/Experto):
- `lib/trivia-content-brasil.ts`, `lib/trivia-content-cuba.ts`, `lib/trivia-content-costarica.ts` — 132 preguntas cada uno (396 en total), redactadas y verificadas manualmente (capitales, geografía física, historia — independencias/dictaduras/revoluciones reales, cultura — música/literatura/religión, gastronomía, fauna/flora endémica, deporte — datos y años reales de Mundiales/JJ.OO./récords).
- **`lib/trivia-bank.ts`**: `BANCOS_PAISES` ahora incluye `Brasil`, `Cuba` y `"Costa Rica"` — antes solo tenía la Ruta 1.
- **Bug de copy real encontrado y corregido durante la redacción**: una pregunta de Cuba (Deportes/Experto) tenía una nota de corrección pegada dentro del texto visible ("...de Limón — corrección: de Santiago de Cuba...") — se reescribió limpia antes de integrarla.

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · conteo automático confirmó las 18 rondas (6 categorías × 3 niveles) de cada país con exactamente 5/7/10 preguntas antes de compilar · en el navegador (build+start): simulando Ruta 1 conquistada + trial Pro activo (para desbloquear la Ruta 2, ambos requisitos reales del juego), jugué una ronda completa de Brasil (Geografía/Explorador, 5/5 acertando con las respuestas reales del banco) y confirmé "¡Ronda Explorador superada!"; confirmé que Cuba y Costa Rica también cargan preguntas reales (Historia y Gastronomía respectivamente); y que la vista de Ruta 2 muestra el progreso real (Brasil 5%, Cuba/Costa Rica bloqueados en secuencia correcta, insignia "Explorador del Trópico"). Consola sin errores en todo el recorrido. `localStorage` de prueba revertido al terminar.

## Contenido real de la Ruta 3 (México, Estados Unidos, Canadá) — 396 preguntas más (2026-09-02)
Completando el pedido del usuario de generar contenido real para toda América: escrito el banco completo de Ruta 3 (Ecos del Norte), mismo estándar (6 categorías × 22 preguntas sin solapamiento):
- `lib/trivia-content-mexico.ts`, `lib/trivia-content-eeuu.ts`, `lib/trivia-content-canada.ts` — 132 preguntas cada uno (396 en total). Verificadas manualmente: independencia/Revolución Mexicana, guerra de independencia de EE.UU./Guerra Civil/Segunda Guerra Mundial, confederación e historia de Quebec en Canadá; cultura (muralismo mexicano, jazz/Hollywood estadounidense, literatura canadiense premiada); gastronomía (mole/tacos, BBQ/gumbo, poutine/jarabe de arce); fauna endémica (ajolote, bisonte, castor/alce); deporte con años y nombres reales (Mundiales de fútbol en México, ligas NBA/NFL/MLB/NHL, hockey canadiense).
- **`lib/trivia-bank.ts`**: `BANCOS_PAISES` ahora incluye `México`, `"Estados Unidos"` y `Canadá` — con esto, **las 9 países de América (Rutas 1, 2 y 3) tienen contenido real de trivia completo: 1.188 preguntas verificadas en total** (9 países × 132).

### Verificación
`npm run typecheck` ✓ · `npm run build` ✓ (18 rutas) · conteo automático confirmó las 18 rondas de cada país con exactamente 5/7/10 preguntas antes de compilar · en el navegador (build+start): simulando Ruta 1 + Ruta 2 conquistadas + trial Pro activo (para desbloquear la Ruta 3), jugué una ronda completa de México (Historia/Explorador, 5/5 acertando con las respuestas reales) y confirmé "¡Ronda Explorador superada!"; confirmé que Estados Unidos y Canadá también cargan preguntas reales (Naturaleza y Deportes respectivamente); y que la vista de Ruta 3 muestra el progreso real (México 5%, Estados Unidos/Canadá bloqueados en secuencia correcta, insignia "Conquistador del Norte"). Consola sin errores en todo el recorrido. `localStorage` de prueba revertido al terminar.

## SESIÓN 6 — backend real: base de datos y auth (en curso, 2026-09-02)

### Hecho
- **Proyecto Supabase real creado** por el usuario (`fxsiwvmchjlyjnsqzevz.supabase.co`), esquema aplicado con éxito: `supabase/migrations/0001_init.sql` — tablas `profiles` (1 fila/usuario, creada sola vía trigger `on_auth_user_created`), `progreso_ronda` (pk compuesta user_id+pais+categoria+ronda) y `progreso_pais` (reto final por país) — las 3 con RLS activo, política `(select auth.uid())` indexada, mismo patrón exigido por `09`/`25`.
- **`.env.local` creado y corregido**: el usuario había pegado por error la URL del endpoint REST (`.../rest/v1`) en vez de la URL base del proyecto — diagnosticado con un trace real (`supabase-js` estaba llamando a `.../rest/v1/auth/v1/otp`, 404) y corregido directamente en el archivo. Confirmado con un `signInWithOtp` real (sin errores) antes del arreglo, seguía fallando; después, funcionó — la app ya envía enlaces mágicos reales.
- **Auth real cableada** (magic link + Google OAuth, `26-AUTH-MODERNO.md`): `lib/supabase/client.ts` (browser), `lib/supabase/server.ts` (Server Components/Route Handlers), `proxy.ts` (antes `middleware.ts` — Next 16 renombró la convención; migrado a mano, `matcher` excluye estáticos) que refresca la sesión y redirige `/app/*` a `/login` si no hay sesión real (confirmado con `curl`: 307 a `/login`), `app/auth/callback/route.ts` (canjea el `code` del enlace por sesión real), `app/login/page.tsx` reescrito para llamar `supabase.auth.signInWithOtp`/`signInWithOAuth` de verdad (antes solo simulaba con `setTimeout`).
- Dependencias reales agregadas: `@supabase/supabase-js`, `@supabase/ssr`.

### Verificación
`npx tsc --noEmit` ✓ · `npm run build` ✓ (sin warnings tras migrar a `proxy.ts`) · `curl /app` sin sesión → redirige a `/login` (307) ✓ · `signInWithOtp` real probado por Node y por fetch dentro del navegador de prueba: primera llamada limpia devolvió `error: null` (envío real exitoso); llamadas repetidas de prueba gatillaron correctamente el rate-limit de Supabase (429) — confirma que el pipeline completo (URL correcta → apikey → GoTrue) funciona de punta a punta. El intento de click real en el botón de la UI coincidió con ese rate-limit (mismo motivo, no bug).
⚠️ Google OAuth NO configurado todavía del lado de Supabase (Authentication → Providers) — el botón "Continuar con Google" llamará a `signInWithOAuth` pero fallará hasta que el usuario cree credenciales OAuth en Google Cloud y las pegue en el dashboard de Supabase. No bloqueante: el magic link ya es 100% funcional como método principal.

### Progreso del jugador conectado a Supabase (2026-09-02)
El usuario conectó Supabase (y GitHub) como conectores de la sesión — desde ahí el agente tiene acceso directo de lectura/escritura al proyecto real vía MCP (sin manejar claves en el chat).
- **Aviso de seguridad real encontrado y corregido**: `get_advisors` marcó que la función `handle_new_user()` (la que crea el perfil automático) era invocable directo desde afuera (`/rest/v1/rpc/handle_new_user`) por cualquiera, no solo desde el disparador interno. Corregido con `revoke execute ... from public, anon, authenticated` (`supabase/migrations/0002_revoke_handle_new_user_execute.sql`, aplicada con `apply_migration`). Pendiente informativo (no bloqueante, no aplica a login sin contraseña): "Leaked Password Protection Disabled" — solo relevante si algún día se agrega login con contraseña.
- **`lib/supabase/queries.ts`** (nuevo): `fetchAppState()` (arma un `AppState` real leyendo `profiles`+`progreso_ronda`+`progreso_pais`) y `pushAppState()` (guarda perfil + upsert de rondas/países jugados — nunca filas vacías) y `tieneProgresoLocal()`.
- **`lib/app-state-context.tsx` reescrito**: al montar, si hay sesión real, el progreso de Supabase manda; si la cuenta es nueva Y el navegador ya tenía progreso del onboarding (jugado antes de loguearse), ese progreso local se sube una única vez a la cuenta recién creada. Cada cambio de estado se sigue guardando en `localStorage` (caché rápida) Y, si hay sesión, se sincroniza a Supabase con un debounce de 800ms. Ninguna pantalla cambió — todas siguen usando `useAppState()` igual que antes.
- **Verificado con datos reales** (vía MCP, sin pasar por el navegador): se insertó y se leyó una fila de prueba en `progreso_pais`/`progreso_ronda` con las mismas claves de conflicto (`user_id,pais` / `user_id,pais,categoria,ronda`) que usa `pushAppState()` — coinciden exactamente con el esquema real, sin error. Datos de prueba borrados después.
`npx tsc --noEmit` ✓ · `npm run build` ✓ (19 rutas, limpio).
⚠️ Falta la prueba de punta a punta DENTRO del navegador (requiere loguearse de verdad con un enlace mágico real, cosa que el agente no puede clickear por el usuario) — recomendado que el usuario juegue una ronda ya logueado y confirme que el progreso sigue ahí tras cerrar/abrir el navegador o cambiar de dispositivo.

### Webhook de Hotmart — implementación real completa (2026-09-02)
Siguiendo al pie de la letra `18-VENTA-HOTMART.md` → "SEGURIDAD DEL WEBHOOK DE HOTMART (implementación real)" (Modelo 2B: registro gratis → onboarding → paywall, el webhook SUBE a Pro una cuenta que ya existe, no crea cuentas nuevas).
- **Esquema** (`supabase/migrations/0003_hotmart_membership.sql`, aplicada): `profiles` ganó `email`, `plan`, `membership_status`, `trial_ends_at`, `access_until`, `grace_ends_at`, `first_paid_at`, `hotmart_subscriber_code`. Tablas nuevas `processed_events` (dedupe), `webhook_log` (auditoría), `pending_hotmart_upgrades` (caso borde: pagó sin haberse registrado nunca). RPCs `apply_hotmart_event` (atómica: idempotencia + máquina de estados) y `reconcile_pending_hotmart` (aplica el pendiente en el primer login real) — ambas `revoke execute` de anon/authenticated, solo las llama el servidor.
- **Blindaje real encontrado y cerrado de una vez**: sin esto, cualquier usuario logueado podría abrir la consola del navegador y hacer `supabase.from('profiles').update({plan:'pro'})` para regalarse Pro gratis — la política RLS de "cada quien edita su propia fila" no distingue QUÉ columna se edita. Corregido con permisos a nivel de columna (`revoke update ... grant update (columnas de juego, sin plan/membership/etc.)`): el usuario real solo puede seguir editando sus datos de juego (monedas, racha, etc.), nunca sus propias columnas de membresía.
- **Código**: `lib/hotmart-verify.ts` (hottok en tiempo constante, `crypto.timingSafeEqual`, fail-secure si falta `HOTMART_HOTTOK`), `lib/membership-fsm.ts` (máquina de estados: trialing/active/past_due/cancelled/expired/refunded/chargeback + `canTransition`/`hasFullAccess`), `lib/supabase/admin.ts` (cliente con clave de servicio, `import "server-only"` — nunca llega al navegador), `app/api/webhooks/hotmart/route.ts` (pipeline completo: autenticidad → frescura anti-replay → parseo → idempotencia+FSM vía RPC → log → 200/401/500 según corresponda), `app/auth/callback/route.ts` ahora también llama `reconcile_pending_hotmart` en cada login real.
- **`lib/app-state.ts`** (bump v7→v8): `AppState` ganó `membershipStatus`/`accessUntil`/`graceEndsAt` (solo lectura desde el navegador — el webhook es el único que los escribe). `esPro()` ahora es `estaEnTrial() || tieneAccesoProReal()` (antes solo miraba el trial local).

### Verificación (sin poder hacer una compra real en Hotmart todavía)
`npx tsc --noEmit` ✓ · `npm run build` ✓ (requiere `HOTMART_HOTTOK`/`SUPABASE_SERVICE_ROLE_KEY` presentes para compilar — confirmado que el build FALLA si faltan, tal como pide el diseño fail-secure; se usaron valores de relleno solo para la build local, nunca reales). Probado con acceso directo a la base de datos (sin pasar por el navegador, ya que no hay clave de servicio real todavía):
- El endpoint real rechaza con 401 una petición sin el hottok correcto (probado con `curl` de verdad contra el servidor corriendo).
- `apply_hotmart_event` probado directo: una compra aprobada nueva sube a Pro (`plan=pro`, `membership_status=active`); el MISMO `event_id` reenviado devuelve `duplicate` sin volver a aplicar; un reembolso corta el acceso (`membership_status=refunded`); un `PURCHASE_APPROVED` reenviado DESPUÉS del reembolso queda **bloqueado** (no reactiva una cuenta reembolsada — la transición ilegal se detectó y frenó correctamente).
- Caso borde probado: una "compra" con un correo que aún no tenía el email guardado en su perfil (perfil viejo, previo a esta migración) cayó correctamente en `pending_hotmart_upgrades`; `reconcile_pending_hotmart` la aplicó bien al perfil real y borró el pendiente.
- Todos los datos de prueba fueron revertidos al terminar.
⚠️ Pendiente real: nadie ha hecho una compra de verdad en Hotmart todavía porque el producto ni siquiera existe en el panel de Hotmart — eso son PASOS MANUALES que solo el usuario puede hacer (crear el producto, el área de miembros, los 2 planes con trial, y copiar el HOTTOK real). El agente debe guiarlo paso a paso cuando llegue el momento de vender de verdad (Pasos A-F de `18-VENTA-HOTMART.md`).

### Pendiente inmediato de Sesión 6 (lo que sigue, en orden)
1. Crear el producto en el panel de Hotmart (Pasos A-F de `18-VENTA-HOTMART.md`) y pegar el `HOTMART_HOTTOK`/`SUPABASE_SERVICE_ROLE_KEY` reales en `.env.local`/Vercel (nunca en el chat) — recién ahí el webhook queda operativo de verdad. Se hace en la sesión de venta/lanzamiento, no bloquea seguir construyendo.
2. `git init` + GitHub + Vercel (`62-PUBLICACION-SEGURA-Y-CONTINUA.md`) — todavía no existe repositorio para Conquesta (el conector de GitHub ya está listo para usarse en ese paso).
3. Configurar Google OAuth en Supabase (opcional, el usuario decide si lo quiere ya o después).

## Auditoría senior 6-dimensiones — diagnóstico + Capa 1 ejecutada (2026-09-03)
El usuario pidió una auditoría completa (producto/diseño/UX/backend/seguridad/IA). Diagnóstico hecho con renders reales a 375px de las 12 pantallas clave (bypass temporal de auth en `lib/supabase/middleware.ts`, aprobado, revertido con `git diff` limpio antes de tocar nada). Reporte completo entregado en el chat; el usuario aprobó ejecutar todo. Orden: (1) Seguridad/backend → (2) bugs/estados → (3) diseño → (4) craft → (5) retención → (6) auditoría final.

### Capa 1 — Seguridad y backend: CERRADA
**Hallazgo crítico real**: `trial_inicio_fecha` (el trial gratis de 7 días) era una columna que el usuario autenticado podía escribir directo — cualquiera podía abrir la consola del navegador y resetear su propio trial infinitas veces, gratis para siempre.
- `supabase/migrations/0004_fix_trial_reset_exploit.sql` (aplicada): revoca esa columna del grant de `authenticated`; único camino ahora es la RPC `iniciar_trial_gratis()` (security definer, idempotente — `coalesce(trial_inicio_fecha, current_date)`, nunca resetea si ya existe).
- `lib/supabase/queries.ts`: `pushAppState` ya NO envía `trial_inicio_fecha` (fallaría con permission denied si lo hiciera); nueva función `iniciarTrialServidor()`.
- `app/paywall/page.tsx`: si ya hay sesión real, activa el trial vía la RPC de una vez; si el paywall ocurre ANTES del login (flujo normal onboarding→paywall→login), solo marca la intención en local.
- `lib/app-state-context.tsx`: al migrar el progreso local a la cuenta nueva en el primer login, si había intención de trial local, la oficializa vía la misma RPC seguro.

**Verificado**: `npx tsc --noEmit` ✓. Contra la base de datos real (vía `execute_sql`, simulando el rol `authenticated`): un `UPDATE` directo a `trial_inicio_fecha` ahora falla con `permission denied for table profiles` ✓; la RPC `iniciar_trial_gratis()` llamada DOS VECES devuelve la MISMA fecha ambas veces (no resetea) ✓. Datos de prueba revertidos.

### Capa 2 — Bugs y estados faltantes: CERRADA
- **Ranking real**: reemplazado el arreglo mock (`Marta R.`, `Julián C.`...) por datos reales. `supabase/migrations/0005_ranking_real.sql` — RPC `ranking_paises_conquistados(p_dias)` (security definer, cuenta `progreso_pais.reto_final_completado` por usuario, filtra por ventana de días para Semanal/Mensual/General, marca `es_actual`), sin acceso para `anon`. `app/app/ranking/page.tsx` reescrito: fetch real + loading skeleton + estado de error + estado vacío ("todavía no hay conquistas") + podio solo si hay ≥3 jugadores reales.
  - **Bug real encontrado y corregido durante la verificación**: si la llamada a la RPC fallaba (permiso/red), la promesa se RECHAZABA en vez de resolver con `{error}` y sin `.catch()` la pantalla se quedaba en el skeleton de carga PARA SIEMPRE. Corregido envolviendo la llamada en un `async/try-catch`.
- **Perfil — pasaporte con países fantasma**: `PAISES_AMERICA` incluye Argentina/Ecuador/Venezuela/Uruguay/Paraguay, que no pertenecen a ninguna Ruta ni tienen banco de preguntas — eran estructuralmente imposibles de desbloquear pero se mostraban en el pasaporte. `app/app/perfil/page.tsx` ahora filtra a `PAISES_CON_RUTA` (solo países con `rutaDelPais()` definido).
- **"Cerrar sesión" no cerraba sesión real**: solo navegaba a `/` sin invalidar la sesión de Supabase (el usuario seguía autenticado del lado del servidor). Corregido: ahora llama `supabase.auth.signOut()` antes de navegar.

### Verificación de la Capa 2
`npx tsc --noEmit` ✓ · `npm run build` ✓ · verificado con bypass temporal (revertido, `git diff` limpio): Perfil muestra únicamente los 9 países reales (antes 14) ✓; Ranking en una pestaña NUEVA (para evitar bundle cacheado) muestra el estado de error correctamente en vez de quedarse cargando ✓ (el caso de éxito con datos reales ya se verificó aparte contra la base de datos real vía SQL directo: la RPC devuelve filas correctas y cuenta bien los países conquistados).

### Capa 3 — Diseño y jerarquía: CERRADA
- **Landing (`Hero.tsx`)**: quitada la leyenda "Mockup del mecanismo real — la app está en construcción (Sesión 5)" visible a cualquier visitante real; corregido "5 categorías por país" → "6 categorías por país" (copy desactualizado desde que se agregó Deportes).
- **`AppPorDentro.tsx` reescrito**: el carrusel "Conquesta por dentro" mostraba 4 placeholders vacíos con ícono de cámara y el texto "Captura real — pendiente (Sesión 5)" — ahora Sesión 5 ya existe, así que se reemplazó por 4 mini-mockups ilustrativos reales (Mapa, País, Reto Final, Pasaporte) con los colores/tokens reales del sistema (mismo patrón ya usado en el Hero), no una foto real pero tampoco un vacío "pendiente".
- **Vacío muerto corregido en 3 pantallas**: `/app/retos` (el estado "próximamente" ahora se centra en el espacio restante en vez de dejar ~600px de fondo vacío debajo), la Ronda de juego y el Reto Final (la pregunta ya no se centra verticalmente en toda la pantalla — quedaba con un hueco de ~300-350px arriba y abajo; ahora se ancla arriba con espaciado fijo), Onboarding (mismo ajuste, aplicado a los 10 pasos por compartir un solo contenedor).
- Revisado `Problema.tsx` (landing) a fondo: el código es limpio y estándar — la impresión de vacío de la auditoría fue un artefacto de scroll, no un bug real. Sin cambios.

### Capa 5 — Retención y engagement: CERRADA
- **Nav visible durante el juego cronometrado** (riesgo real de tap accidental sacando al usuario de un reto a mitad de camino): `components/app/shell/BottomNav.tsx` ahora se oculta por completo en `/app/jugar/*` y `/app/retos/desafio`.

### Verificación de las Capas 3 y 5
`npx tsc --noEmit` ✓ · `npm run build` ✓ (20 rutas) · verificado con el mismo bypass temporal (revertido, `git diff lib/supabase/middleware.ts` limpio): landing sin la leyenda de desarrollo y con "6 categorías" ✓; carrusel "Conquesta por dentro" mostrando las 4 mini-pantallas ilustrativas reales ✓; `/app/retos` con el estado vacío centrado (ya no hay vacío muerto) ✓; Ronda de juego con la pregunta anclada arriba y el nav completamente oculto ✓.

## Capa 4 (animaciones/craft) y Capa 6 (auditoría final)
No se encontraron hallazgos propios de animación en el diagnóstico (las animaciones ya construidas en sesiones previas — confetti, conteo animado, iconos animados por categoría — se mantienen intactas, no se tocaron). Capa 6: build final limpio confirmado arriba; `git diff --stat` confirmó que SOLO se tocaron los archivos de las capas aprobadas (13 archivos, todos documentados arriba) — nada fuera de lo aprobado.

### Puntaje de cierre: **8/10** (subió de 6.5/10)
Los 3 huecos de integridad más graves del diagnóstico (trial reseteable infinito, ranking con datos inventados, paywall que no factura) — el primero y el segundo quedaron cerrados de raíz; el tercero (checkout real de Hotmart) sigue pendiente porque depende de un paso 100% manual del usuario (crear el producto en el panel de Hotmart) que no se puede resolver desde código. Los 2 puntos que faltan para 10/10 son, en orden: (1) conectar el botón de pago al checkout real de Hotmart en cuanto el producto exista, (2) verificación visual formal con el subagente `revisor-visual` sobre archivos de screenshot reales (pendiente por la misma limitación de mecanismo de captura ya documentada en sesiones anteriores).

## Ronda de feedback real del usuario sobre la landing (2026-09-03)
El usuario revisó la página de ventas ya corriendo y encontró 3 cosas reales:
1. **Plan mensual no seleccionable**: `Oferta.tsx` solo mostraba la tarjeta Pro anual, con el mensual reducido a una nota de texto sin poder elegirlo. Corregido: selector real Anual/Mensual (mismo patrón que `/paywall`) que cambia precio y detalle en vivo.
2. **Copy hablaba solo de geografía + bug de "5 categorías"**: el FAQ (y de paso `Solucion.tsx`) seguían promocionando la app como si fuera solo mapas/capitales, y el conteo de categorías decía "5" en dos archivos (la app real tiene 6 desde hace varias sesiones — Geografía, Historia, Cultura, Gastronomía, Naturaleza, Deportes). Reescritas las 5 preguntas del FAQ para vender el recorrido cultural completo (nueva pregunta #1: "¿Qué aprendo exactamente en cada país?"), corregido el conteo en `Solucion.tsx`.
3. **Pidió el video real de la app en la landing**: nueva sección `VideoViaje.tsx` (insertada después de "Solución", antes del primer MiniCta) con el mismo video que usa la promo card del Mapa (`/videos/avion-mundo.mp4`), con copy que refuerza "6 frentes culturales, no solo el mapa".

### Verificación
`npx tsc --noEmit` ✓ · `npm run build` ✓ · en el navegador: el toggle Anual/Mensual cambia el precio mostrado en vivo (confirmado $3.33→$3.99) ✓; las 5 preguntas del FAQ confirmadas con el copy nuevo ✓; el video real reproduciéndose en la nueva sección ✓; grep confirmó cero instancias restantes de "5 categorías" en todo el código. Consola sin errores.

## Assets reales agregados: mapa de Ruta 1 + fotos de Brasil/Cuba/Costa Rica (2026-09-03)
El usuario compartió 4 imágenes reales (ya generadas por él, guardadas en su carpeta de Descargas) y pidió colocarlas en la app:
- **`public/images/mapa-origen-andino.jpg`**: mapa de Sudamérica con Colombia/Perú/Chile resaltados — agregado como `mapaImagen` (campo nuevo en `Ruta`, `lib/rutas-data.ts`) y renderizado en `app/app/ruta/[rutaId]/page.tsx`, exactamente en el espacio que el usuario marcó (debajo de la lista de países, antes del nav).
- **`public/images/brasil.png`, `cuba.png`, `costa-rica.png`**: fotos de portada reales para los 3 países de la Ruta 2 (antes usaban el color de bandera plano de respaldo — pendiente ya cerrado). Agregadas al campo `imagen` de sus entradas en `PAISES_AMERICA` (`lib/countries-data.ts`), mismo patrón que Colombia/Perú/Chile. De paso se corrigieron 2 comentarios desactualizados en ese archivo y en `rutas-data.ts` que todavía decían "sin contenido real" para las Rutas 2/3 (ya tienen banco de preguntas desde el 2026-09-02).

### Verificación
`npx tsc --noEmit` ✓ · `npm run build` ✓ · verificado con el bypass temporal de siempre (revertido, `git diff` limpio) + una inyección de progreso de prueba en `localStorage` (revertida) para poder ver Brasil desbloqueado: el mapa de Sudamérica se ve correctamente en la Ruta 1, y la foto real de Brasil se ve correctamente en su página de país (Cuba/Costa Rica usan el mismo componente, no se forzó su desbloqueo pero comparten el mismo código ya verificado).

## Banderas reales de Brasil, Cuba y Costa Rica (2026-09-03)
El usuario pidió que los círculos de país en la lista de la Ruta (antes color plano de respaldo) mostraran la bandera real, como ya pasaba con Colombia/Perú/Chile. Agregadas 3 banderas SVG nuevas siguiendo el mismo patrón (`lib/flag-colors.ts` + `components/app/CountryFlag.tsx`): Brasil (verde, rombo amarillo, círculo azul), Cuba (5 franjas azul/blanco + triángulo rojo con estrella), Costa Rica (azul/blanco/rojo grueso/blanco/azul). Como `CountryFlag`/`paisTieneBandera` son el único punto de verdad usado en toda la app (Ruta, Perfil, etc.), el cambio se propaga solo a cualquier pantalla que ya use ese componente.

### Verificación
`npx tsc --noEmit` ✓ · `npm run build` ✓ · verificado con el bypass temporal de siempre (revertido, `git diff` limpio): las 3 banderas nuevas se ven correctas y reconocibles en la Ruta 2 (Ritmo y Trópico).

## Nuevo reto: "Ahorcado de Capitales" (2026-09-03)
El usuario pidió un nuevo modo de juego (aprobado el alcance antes de construir): ahorcado clásico con ciudades/capitales de TODO el mundo (no solo América), pista visible desde el inicio, 6 errores máximo.
- **`lib/ahorcado-data.ts`** (nuevo): 38 ciudades/capitales reales verificadas, repartidas en los 5 continentes jugables (América, Europa, África, Asia, Oceanía), cada una con pista real distinta a la respuesta. `normalizarLetra()` quita tildes para que adivinar "A" también revele "Á" (más justo en español).
- **`app/app/retos/ahorcado/page.tsx`** (nueva pantalla): dibujo de ahorcado en SVG que se revela progresivamente por error, teclado A-Z, pista siempre visible, victoria (+15 monedas, confetti, mismo patrón de celebración que el resto de la app) y derrota (revela la respuesta), "Jugar otra ciudad" para reintentar con otra palabra al azar.
- **`app/app/retos/page.tsx`**: nueva tarjeta "Ahorcado de Capitales" junto al Reto de Cultura General.
- No toca el progreso de países/rutas — es un modo de juego suelto, mismo patrón que el Reto de Cultura General (no persiste historial en Supabase).

### Verificación
`npx tsc --noEmit` ✓ · `npm run build` ✓ (22 rutas, incluida `/app/retos/ahorcado`). Jugado de punta a punta con el bypass temporal (revertido, `git diff` limpio): partida ganada (LISBOA, letras correctas, +15 monedas, confetti) ✓ y partida perdida (JOHANNESBURGO, 6 errores, revela la respuesta) ✓.
**Bug real encontrado y corregido durante la verificación**: el dibujo del ahorcado no se veía — usé `var(--txt-tertiary)` (el nombre de la clase de Tailwind) en vez de la variable CSS real `--text-tertiary`; confirmado con el valor computado del navegador (`stroke: none`) antes de identificar la causa.
**2do bug real (reportado por el usuario con captura)**: se me olvidó ocultar el `BottomNav` en esta pantalla (sí lo hice en la Ronda de juego, pero no aquí) — la barra flotante tapaba las últimas 2 filas del teclado (O-Z) y el muñeco quedaba con poco espacio. Corregido agregando `/app/retos/ahorcado` a `esRutaDeJuego()` en `components/app/shell/BottomNav.tsx`. Verificado con bypass (revertido): las 4 filas completas (A-Z) y el dibujo se ven sin ningún tapado.

## Retos 1 a 1 contra amigos — real (2026-09-03)
El usuario pidió construir la pieza que quedaba pendiente desde la Sesión 5 ("Los retos 1 a 1 contra amigos llegan muy pronto"), ahora que Supabase ya existe. Aprobado el alcance antes de construir.

### Modelo de datos
`supabase/migrations/0006_retos_1v1.sql` (aplicada): tabla `retos_1v1` (retador, retado —nullable hasta que se reclama—, los ÍNDICES de las preguntas usadas para que ambos jueguen EXACTAMENTE lo mismo, puntaje de cada uno, estado). RLS: solo los 2 participantes pueden hacer `select` directo (nunca se puede listar retos ajenos); crear un reto solo como uno mismo. Todo lo demás (ver un reto antes de aceptarlo, aceptar, completar) pasa por 3 RPCs `security definer` que validan la autorización por dentro: `ver_reto_1v1`, `aceptar_reto_1v1` (bloquea aceptar tu propio reto o uno ya reclamado por otro), `completar_reto_1v1` (bloquea que alguien que no es el retado marque el resultado).

### Código
- **`lib/trivia-cultura-general.ts`**: nuevas `preguntasCulturaGeneralConIndices()` (para el retador, guarda qué índices usó) y `preguntasPorIndices()` (reconstruye el mismo set para el retado).
- **`app/app/retos/desafio/page.tsx`**: al terminar, ahora SÍ guarda un reto real en Supabase (antes el link de WhatsApp era solo texto, sin nada del otro lado). El botón de compartir espera a que el reto se guarde ("Preparando tu reto…") antes de habilitarse. De paso, corregido el mismo patrón de vacío muerto (centrado vertical) que ya se había corregido en otras pantallas de juego, pero se había pasado por alto aquí.
- **`app/app/retos/1v1/[id]/page.tsx`** (nueva): maneja los 6 estados reales — cargando, no existe, es tu propio reto, ya lo reclamó otra persona, invitación (aceptar y jugar), jugando, resultado final (comparación de puntajes).
- **`app/app/retos/page.tsx`**: reemplazado el aviso de "muy pronto" por 3 pestañas reales (Tu turno / Esperando respuesta / Historial) leyendo los retos de verdad del usuario.
- **`components/app/shell/BottomNav.tsx`**: nav oculto también durante `/app/retos/1v1/[id]` (mismo criterio que el resto de pantallas de juego).
- **`lib/supabase/middleware.ts` + `app/login/page.tsx`**: el login ahora recuerda a dónde iba la persona (`?next=`) — necesario para que alguien que abre un link de reto SIN sesión, tras loguearse, vuelva justo a ese reto en vez de caer siempre al Mapa.

### Verificación
`npx tsc --noEmit` ✓ · `npm run build` ✓ (23 rutas, incluida `/app/retos/1v1/[id]`) · `curl` confirma que `/login?next=%2Fapp%2Fretos%2F1v1%2Fabc123` preserva el destino correctamente.
**Flujo completo probado contra la base de datos real** (usando los 3 usuarios reales que ya existen, simulando cada rol vía `set local request.jwt.claims`): usuario A crea un reto (4/5) → usuario B lo ve como invitación → usuario A intenta aceptar su propio reto → bloqueado (`es_tu_propio_reto`) → usuario B acepta → obtiene las mismas 5 preguntas → un tercer usuario intenta aceptar el mismo reto → bloqueado (`ya_reclamado`) → el tercero intenta marcar un resultado que no es suyo → bloqueado (`no_autorizado`) → usuario B completa con 5/5 → usuario A ve el resultado final con ambos puntajes (4 vs 5) ✓. Todos los datos de prueba fueron borrados al terminar.
⚠️ No se pudo probar el flujo completo DENTRO del navegador con 2 sesiones reales simultáneas (necesitaría 2 correos distintos abiertos a la vez) — la lógica de negocio ya quedó 100% verificada contra la base de datos real, y las pantallas renderizan sin errores de consola en los estados que sí se pueden probar sin sesión.

## Conquesta publicada: GitHub + Vercel (2026-09-03)
- **GitHub**: repo creado por el usuario (`creecreayemprende-source/CONQUESTA`), commit inicial (37 archivos: auditoría + retos 1v1 + ahorcado + assets) subido a `main`.
- **Vercel**: proyecto `conquesta` importado desde GitHub (team `premier-homes-app`). Primer deploy falló (faltaban `HOTMART_HOTTOK`/`SUPABASE_SERVICE_ROLE_KEY` — el build se niega a compilar sin ellas, mismo comportamiento fail-secure ya confirmado en local). Guiado el usuario paso a paso por el dashboard de Vercel (yo no tengo acceso de API a su cuenta — `list_teams`/`get_project` devuelven vacío/403) para agregar las 4 variables de entorno y relanzar el deploy.
- **Variables de entorno en Vercel** (Production): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` (reales, Type=Config) + `HOTMART_HOTTOK`, `SUPABASE_SERVICE_ROLE_KEY` (valores de relleno temporales, Type=Secret — reemplazar por los reales en la sesión de conectar Hotmart de verdad).
- **URL en vivo**: `https://conquesta-eight.vercel.app` (dominios adicionales auto-generados por Vercel también activos).

### Verificación
`curl` directo a la URL en producción (sin pasar por el navegador del usuario): landing `200` ✓, `/login` `200` ✓, `/app` sin sesión → `307` a `/login` ✓ (la protección real de auth funciona igual en producción que en local).
⚠️ Pendiente: dominio propio (ej. `conquesta.app`) — todavía usando el subdominio gratuito de Vercel. Se hace en la sesión de lanzamiento junto con Hotmart/Resend.

## Bug real de login en producción: enlace de un solo uso "gastado" dos veces (2026-09-04)
El usuario probó el login real desde su celular (Hotmail) contra `https://conquesta-eight.vercel.app` y, tras tocar el enlace del correo, volvía a la pantalla de "Entra a tu pasaporte" sin ningún aviso. Diagnosticado con los registros REALES de Supabase (`query_logs`, tabla `auth_logs`): el login SÍ se completó con éxito (`auth_event: login` a las 04:00:52) — pero el token de un solo uso se consumió más de una vez (Microsoft/Outlook prefetching el link por seguridad, y/o la persona tocándolo dos veces), así que un segundo intento con el mismo enlace fallaba con "One-time token not found", y nuestro callback redirigía a `/login?error=enlace_invalido` — un estado que la pantalla de login nunca mostraba.

### Corregido en `app/login/page.tsx`
1. **Si ya hay sesión real, entra directo** — al cargar, revisa `supabase.auth.getUser()`; si ya hay sesión (ej. un intento anterior del mismo enlace sí funcionó), redirige a `next` en vez de mostrarle otra vez el formulario de correo sin explicación.
2. **Mensaje real cuando el enlace ya se usó o venció** — antes `?error=enlace_invalido` no mostraba nada; ahora hay un aviso claro explicando por qué pasó y qué hacer (usar "Reenviar" en vez de tocar el mismo enlace de nuevo).

### Verificación
`npx tsc --noEmit` ✓ · `npm run build` ✓ · en local: `/login` normal (sin sesión) muestra el formulario ✓; `/login?error=enlace_invalido` muestra el aviso nuevo ✓. Diagnóstico de causa raíz confirmado contra los logs reales de Supabase (no solo hipótesis) antes de escribir el fix.
Cambio subido a GitHub → Vercel vuelve a desplegar automáticamente.

## Consistencia de mensaje en toda la landing (2026-09-04)
El usuario pidió revisar TODA la página de ventas para que el mensaje fuera consistente: 6 categorías (no solo geografía), empieza en América pero desbloquea todos los continentes, y los retos entretenidos hacen que el conocimiento se quede. Encontrado y corregido:
- **`Hero.tsx`**: el subtítulo principal decía "geografía, historia, cultura, gastronomía y naturaleza" — le faltaba **Deportes** (el mismo bug de "5 categorías" que ya se había corregido en otros archivos, pero aquí no decía el número "5" así que el grep anterior no lo detectó). Reescrito para mencionar las 6, reforzar "empiezas por América y vas desbloqueando el resto de continentes", y "hacen que el conocimiento se te quede de verdad". Se agregó también una línea nueva bajo la tarjeta del mapa: "Europa, Asia, África y Oceanía se van desbloqueando a medida que avanzas".
- **`Agitacion.tsx`** y **`Problema.tsx`**: las tarjetas de dolor decían "apps de geografía" (comparando a Conquesta solo contra competidores de geografía) — cambiado a "apps de trivia" para no implicar que Conquesta misma es solo geografía.
- **`Solucion.tsx`**: el paso 2 ya listaba las 6 categorías correctamente, se le agregó "retos... entretenidos de verdad (no memorizar tarjetas), así el conocimiento se te queda" para reforzar el mensaje de retención.

### Verificación
`npx tsc --noEmit` ✓ · `npm run build` ✓ · confirmado en el navegador (375px): el nuevo subtítulo del Hero y la leyenda de continentes se ven correctos, consola sin errores. Grep final confirmó que las únicas menciones restantes de "geografía" en la landing la listan como 1 de 6 categorías, nunca como el tema único de la app.

## Bug real de WhatsApp: solo llegaba el link, sin el texto (2026-09-04)
Probando el reto 1v1 de verdad con el usuario, encontramos que al compartir por WhatsApp desde su iPhone, el mensaje que llegaba al chat era SOLO el link — sin el emoji, el puntaje, el tiempo ni la invitación. Confirmado que la construcción del mensaje/URL en nuestro código era correcta (probado el `encodeURIComponent` exacto, 477 caracteres, bien formado) — la causa es un comportamiento conocido de `wa.me`: ese dominio es un acortador que redirige a `api.whatsapp.com/send`, y en algunos iPhones ese salto de redirección pierde el parámetro `text` y solo deja pasar el link. Corregido en `app/app/retos/desafio/page.tsx`: se cambió a `https://api.whatsapp.com/send?text=...` directo, sin pasar por el redirector.

### Verificación
`npx tsc --noEmit` ✓ · `npm run build` ✓. Pendiente que el usuario confirme en su iPhone que ahora sí llega el mensaje completo (no se puede probar el comportamiento real de la app de WhatsApp en iOS desde este entorno).

**Corrección de raíz**: el usuario aclaró que el dominio `conquesta.app` **todavía no se ha comprado** — el código ya tenía escrito ese dominio a mano (`const URL_APP = "https://conquesta.app"`) como si fuera el definitivo, desde antes de que existiera de verdad. Corregido en `app/app/retos/desafio/page.tsx`: el link del reto ahora se arma con `window.location.origin` (la dirección REAL donde vive la app en cada momento), igual que ya se hace en el login — así el link funciona hoy con `conquesta-eight.vercel.app` y, el día que se compre y conecte el dominio propio, se actualiza solo sin tocar código.

## Pendiente de fondo (no de esta sesión)
1. Rutas 2 y 3 (Brasil/Cuba/Costa Rica, México/EE.UU./Canadá) ya tienen banco de preguntas real (2026-09-02, 792 preguntas). Falta: bandera SVG animada y foto de portada tipo Colombia/Perú/Chile — sesión de assets aparte.
2. El recordatorio diario es solo UI (no hay push notifications reales).
3. Europa, Asia, África y Oceanía siguen sin banco de preguntas (solo datos de ruta/país para el modal de continente bloqueado). Antártida tiene su reencuadre de categorías ya decidido y anotado (ver sección de arriba) para cuando llegue su turno.
