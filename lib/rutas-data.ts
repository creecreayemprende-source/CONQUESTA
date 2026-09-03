export interface Ruta {
  id: string;
  nombre: string;
  tema: string;
  paises: string[]; // nombres de país en orden de juego
  insignia: string;
}

/** Rutas temáticas de América (MVP, 2026-08-23). Jerarquía actualizada:
 * Continente → Ruta (3 por continente) → País → 6 Categorías → 3 Niveles → Reto Final.
 * Solo la Ruta 1 tiene contenido de preguntas real hoy (ver trivia-bank.ts);
 * las Rutas 2 y 3 existen como estructura/UI pero sus países siguen "Pro" sin
 * banco de preguntas — se completan en una sesión de contenido aparte. */
export const RUTAS_AMERICA: Ruta[] = [
  {
    id: "origen-andino",
    nombre: "Origen Andino",
    tema: "Historia ancestral, picos andinos, gastronomía del Pacífico y paisajes del sur.",
    paises: ["Colombia", "Perú", "Chile"],
    insignia: "Pionero Andino",
  },
  {
    id: "ritmo-tropico",
    nombre: "Ritmo y Trópico",
    tema: "Biodiversidad, música, patrimonio caribeño y tropical.",
    paises: ["Brasil", "Cuba", "Costa Rica"],
    insignia: "Explorador del Trópico",
  },
  {
    id: "ecos-del-norte",
    nombre: "Ecos del Norte",
    tema: "Maravillas naturales, grandes civilizaciones y cultura pop.",
    paises: ["México", "Estados Unidos", "Canadá"],
    insignia: "Conquistador del Norte",
  },
];

/** Rutas temáticas de Europa y Asia — datos reales (secuencia/insignia) para
 * el modal de vista previa de continente bloqueado (`app/app/page.tsx`).
 * Sin banco de preguntas todavía: no se enlazan en `rutaPorId`/`rutaDelPais`
 * (esas siguen siendo solo de América) para que ninguna pantalla de juego
 * real las trate como jugables por error. */
export const RUTAS_EUROPA: Ruta[] = [
  {
    id: "cuna-clasica",
    nombre: "Cuna Clásica",
    tema: "Arte renacentista, gastronomía mediterránea y las cunas de la civilización occidental.",
    paises: ["España", "Francia", "Italia"],
    insignia: "Explorador Mediterráneo",
  },
  {
    id: "ruta-imperial",
    nombre: "Ruta Imperial",
    tema: "Imperios milenarios, filosofía clásica y las raíces del pensamiento europeo.",
    paises: ["Alemania", "Austria", "Grecia"],
    insignia: "Guardián Imperial",
  },
  {
    id: "norte-nordico",
    nombre: "Norte Nórdico",
    tema: "Realeza, canales históricos y el diseño nórdico que conquistó el mundo.",
    paises: ["Reino Unido", "Países Bajos", "Suecia"],
    insignia: "Navegante del Norte",
  },
];

export const RUTAS_ASIA: Ruta[] = [
  {
    id: "imperios-del-este",
    nombre: "Imperios del Este",
    tema: "Tradición milenaria, tecnología de punta y las grandes dinastías de Asia oriental.",
    paises: ["Japón", "Corea del Sur", "China"],
    insignia: "Maestro del Sol Naciente",
  },
  {
    id: "seda-y-especias",
    nombre: "Seda y Especias",
    tema: "Templos ancestrales, mercados de especias y la ruta comercial más famosa de la historia.",
    paises: ["India", "Tailandia", "Vietnam"],
    insignia: "Ruta de las Especias",
  },
  {
    id: "oasis-del-desierto",
    nombre: "Oasis del Desierto",
    tema: "Rascacielos en el desierto, bazares milenarios y el cruce entre Oriente y Occidente.",
    paises: ["Emiratos Árabes Unidos", "Turquía", "Catar"],
    insignia: "Pionero de Oriente",
  },
];

export const RUTAS_AFRICA: Ruta[] = [
  {
    id: "cuna-de-faraones",
    nombre: "Cuna de Faraones",
    tema: "Pirámides milenarias, mercados de zocos y las huellas del Magreb.",
    paises: ["Egipto", "Marruecos", "Túnez"],
    insignia: "Explorador del Nilo",
  },
  {
    id: "safaris-y-sabana",
    nombre: "Safaris y Sabana",
    tema: "Migraciones salvajes, sabanas infinitas y la fuerza de tres naciones australes.",
    paises: ["Kenia", "Tanzania", "Sudáfrica"],
    insignia: "Guardián de la Sabana",
  },
  {
    id: "tesoros-del-atlantico",
    nombre: "Tesoros del Atlántico",
    tema: "Ritmos de tambor, historia ancestral y las costas doradas de África Occidental.",
    paises: ["Senegal", "Ghana", "Nigeria"],
    insignia: "Pionero del Oeste",
  },
];

export const RUTAS_OCEANIA: Ruta[] = [
  {
    id: "gran-barrera-y-coral",
    nombre: "Gran Barrera y Coral",
    tema: "Arrecifes de coral, fiordos remotos y paraísos del Pacífico Sur.",
    paises: ["Australia", "Nueva Zelanda", "Fiyi"],
    insignia: "Navegante del Pacífico",
  },
  {
    id: "islas-de-la-polinesia",
    nombre: "Islas de la Polinesia",
    tema: "Atolones turquesa, tradición polinesia y reinos isleños milenarios.",
    paises: ["Polinesia Francesa", "Samoa", "Tonga"],
    insignia: "Mago de las Islas",
  },
  {
    id: "tierras-australes",
    nombre: "Tierras Australes",
    tema: "Selvas tribales, volcanes activos y arrecifes vírgenes de Melanesia.",
    paises: ["Papúa Nueva Guinea", "Vanuatu", "Nueva Caledonia"],
    insignia: "Explorador Coralino",
  },
];

/** Antártida: ruta única / desafío extremo — un solo continente, una sola
 * ruta (no 3). El Mapa lo trata igual que los demás continentes bloqueados,
 * simplemente con un array de 1 elemento en vez de 3. */
export const RUTAS_ANTARTIDA: Ruta[] = [
  {
    id: "expedicion-polo-sur",
    nombre: "Expedición Polo Sur",
    tema: "El último continente — hielo eterno, expediciones extremas y el fin del mundo conocido.",
    paises: ["Argentina", "Chile", "Antártida"],
    insignia: "Conquistador del Hielo",
  },
];

export function rutaPorId(id: string): Ruta | undefined {
  return RUTAS_AMERICA.find((r) => r.id === id);
}

export function rutaDelPais(pais: string): Ruta | undefined {
  return RUTAS_AMERICA.find((r) => r.paises.includes(pais));
}
