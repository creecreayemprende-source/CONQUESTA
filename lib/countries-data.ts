import type { Categoria } from "./onboarding-data";

export interface Pais {
  codigo: string;
  nombre: string;
  colorBandera: string;
  esGratis: boolean;
  orden: number;
  imagen?: string; // foto de portada para la franja del país (Ruta 1 por ahora)
}

export const PAISES_AMERICA: Pais[] = [
  // Ruta 1 — Origen Andino (contenido real, jugable desde el inicio vía desbloqueo secuencial).
  // Free: solo Colombia (decisión de monetización, ver ESTADO.md) — Perú y Chile son Pro.
  { codigo: "COL", nombre: "Colombia", colorBandera: "#FFD200", esGratis: true, orden: 1, imagen: "/images/colombia.png" },
  { codigo: "PER", nombre: "Perú", colorBandera: "#D91023", esGratis: false, orden: 2, imagen: "/images/peru.png" },
  { codigo: "CHL", nombre: "Chile", colorBandera: "#0033A0", esGratis: false, orden: 3, imagen: "/images/chile.png" },
  // Ruta 2 — Ritmo y Trópico (Pro, sin contenido real todavía).
  { codigo: "BRA", nombre: "Brasil", colorBandera: "#009C3B", esGratis: false, orden: 4 },
  { codigo: "CUB", nombre: "Cuba", colorBandera: "#002A8F", esGratis: false, orden: 5 },
  { codigo: "CRI", nombre: "Costa Rica", colorBandera: "#002B7F", esGratis: false, orden: 6 },
  // Ruta 3 — Ecos del Norte (Pro, sin contenido real todavía).
  { codigo: "MEX", nombre: "México", colorBandera: "#006341", esGratis: false, orden: 7 },
  { codigo: "USA", nombre: "Estados Unidos", colorBandera: "#3C3B6E", esGratis: false, orden: 8 },
  { codigo: "CAN", nombre: "Canadá", colorBandera: "#FF0000", esGratis: false, orden: 9 },
  // Fuera de ruta por ahora — quedan en el mapa de América pero sin ruta temática asignada.
  { codigo: "ARG", nombre: "Argentina", colorBandera: "#75AADB", esGratis: false, orden: 10 },
  { codigo: "ECU", nombre: "Ecuador", colorBandera: "#FFDD00", esGratis: false, orden: 11 },
  { codigo: "VEN", nombre: "Venezuela", colorBandera: "#FFD100", esGratis: false, orden: 12 },
  { codigo: "URY", nombre: "Uruguay", colorBandera: "#0038A8", esGratis: false, orden: 13 },
  { codigo: "PRY", nombre: "Paraguay", colorBandera: "#D52B1E", esGratis: false, orden: 14 },
];

// Europa y Asia — datos reales (rutas/secuencia/insignia) para el modal de
// vista previa de continente bloqueado (`app/app/page.tsx`); sin `imagen` ni
// banco de preguntas todavía, se construyen en una sesión de contenido aparte.
export const PAISES_EUROPA: Pais[] = [
  { codigo: "ESP", nombre: "España", colorBandera: "#C60B1E", esGratis: false, orden: 15 },
  { codigo: "FRA", nombre: "Francia", colorBandera: "#0055A4", esGratis: false, orden: 16 },
  { codigo: "ITA", nombre: "Italia", colorBandera: "#009246", esGratis: false, orden: 17 },
  { codigo: "DEU", nombre: "Alemania", colorBandera: "#FFCE00", esGratis: false, orden: 18 },
  { codigo: "AUT", nombre: "Austria", colorBandera: "#ED2939", esGratis: false, orden: 19 },
  { codigo: "GRC", nombre: "Grecia", colorBandera: "#0D5EAF", esGratis: false, orden: 20 },
  { codigo: "GBR", nombre: "Reino Unido", colorBandera: "#00247D", esGratis: false, orden: 21 },
  { codigo: "NLD", nombre: "Países Bajos", colorBandera: "#21468B", esGratis: false, orden: 22 },
  { codigo: "SWE", nombre: "Suecia", colorBandera: "#006AA7", esGratis: false, orden: 23 },
];

export const PAISES_ASIA: Pais[] = [
  { codigo: "JPN", nombre: "Japón", colorBandera: "#BC002D", esGratis: false, orden: 24 },
  { codigo: "KOR", nombre: "Corea del Sur", colorBandera: "#003478", esGratis: false, orden: 25 },
  { codigo: "CHN", nombre: "China", colorBandera: "#DE2910", esGratis: false, orden: 26 },
  { codigo: "IND", nombre: "India", colorBandera: "#FF9933", esGratis: false, orden: 27 },
  { codigo: "THA", nombre: "Tailandia", colorBandera: "#A51931", esGratis: false, orden: 28 },
  { codigo: "VNM", nombre: "Vietnam", colorBandera: "#DA251D", esGratis: false, orden: 29 },
  { codigo: "ARE", nombre: "Emiratos Árabes Unidos", colorBandera: "#00732F", esGratis: false, orden: 30 },
  { codigo: "TUR", nombre: "Turquía", colorBandera: "#E30A17", esGratis: false, orden: 31 },
  { codigo: "QAT", nombre: "Catar", colorBandera: "#8D1B3D", esGratis: false, orden: 32 },
];

export const PAISES_AFRICA: Pais[] = [
  { codigo: "EGY", nombre: "Egipto", colorBandera: "#CE1126", esGratis: false, orden: 33 },
  { codigo: "MAR", nombre: "Marruecos", colorBandera: "#C1272D", esGratis: false, orden: 34 },
  { codigo: "TUN", nombre: "Túnez", colorBandera: "#E70013", esGratis: false, orden: 35 },
  { codigo: "KEN", nombre: "Kenia", colorBandera: "#006600", esGratis: false, orden: 36 },
  { codigo: "TZA", nombre: "Tanzania", colorBandera: "#1EB53A", esGratis: false, orden: 37 },
  { codigo: "ZAF", nombre: "Sudáfrica", colorBandera: "#007A4D", esGratis: false, orden: 38 },
  { codigo: "SEN", nombre: "Senegal", colorBandera: "#00853F", esGratis: false, orden: 39 },
  { codigo: "GHA", nombre: "Ghana", colorBandera: "#FCD116", esGratis: false, orden: 40 },
  { codigo: "NGA", nombre: "Nigeria", colorBandera: "#008751", esGratis: false, orden: 41 },
];

export const PAISES_OCEANIA: Pais[] = [
  { codigo: "AUS", nombre: "Australia", colorBandera: "#00008B", esGratis: false, orden: 42 },
  { codigo: "NZL", nombre: "Nueva Zelanda", colorBandera: "#00247D", esGratis: false, orden: 43 },
  { codigo: "FJI", nombre: "Fiyi", colorBandera: "#68BFE5", esGratis: false, orden: 44 },
  { codigo: "PYF", nombre: "Polinesia Francesa", colorBandera: "#CE1126", esGratis: false, orden: 45 },
  { codigo: "WSM", nombre: "Samoa", colorBandera: "#CE1126", esGratis: false, orden: 46 },
  { codigo: "TON", nombre: "Tonga", colorBandera: "#C10000", esGratis: false, orden: 47 },
  { codigo: "PNG", nombre: "Papúa Nueva Guinea", colorBandera: "#CE1126", esGratis: false, orden: 48 },
  { codigo: "VUT", nombre: "Vanuatu", colorBandera: "#D21034", esGratis: false, orden: 49 },
  { codigo: "NCL", nombre: "Nueva Caledonia", colorBandera: "#0035AD", esGratis: false, orden: 50 },
];

// Antártida: ruta única/desafío extremo — reutiliza Argentina/Chile (ya
// existen en PAISES_AMERICA, son las puertas de entrada reales al continente)
// y suma solo el país nuevo, el propio continente helado.
export const PAISES_ANTARTIDA: Pais[] = [
  { codigo: "ATA", nombre: "Antártida", colorBandera: "#4FA8C9", esGratis: false, orden: 51 },
];

export function paisPorCodigo(codigo: string): Pais | undefined {
  return PAISES_AMERICA.find((p) => p.codigo === codigo);
}

/** Busca un país por nombre en TODOS los continentes (América + los bloqueados
 * Europa/Asia/África/Oceanía/Antártida) — usado por el modal de vista previa
 * de continente para mostrar los códigos reales de la secuencia de cada ruta. */
export function paisPorNombreMundo(nombre: string): Pais | undefined {
  return [...PAISES_AMERICA, ...PAISES_EUROPA, ...PAISES_ASIA, ...PAISES_AFRICA, ...PAISES_OCEANIA, ...PAISES_ANTARTIDA].find(
    (p) => p.nombre === nombre
  );
}

const CATEGORIAS_DEL_PAIS: Categoria[] = ["Geografía", "Historia", "Cultura", "Gastronomía", "Naturaleza", "Deportes"];

// 6 categorías × 3 rondas (Explorador/Descubridor/Experto) + 1 reto final
export const TOTAL_ETAPAS_POR_PAIS = CATEGORIAS_DEL_PAIS.length * 3 + 1;

export function categoriasDelPais(): Categoria[] {
  return CATEGORIAS_DEL_PAIS;
}
