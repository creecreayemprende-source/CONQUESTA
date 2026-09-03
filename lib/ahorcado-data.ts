export interface PalabraAhorcado {
  respuesta: string; // en mayúsculas, con tildes reales — se normaliza al comparar
  pista: string;
  continente: string;
}

/** Banco de ciudades/capitales de todo el mundo para el reto "Ahorcado de
 * Capitales" — verificado manualmente, con pista real y distinta a la
 * respuesta (nunca repite el nombre de la ciudad en la pista). */
export const BANCO_AHORCADO: PalabraAhorcado[] = [
  // América
  { respuesta: "BOGOTÁ", pista: "Capital de Colombia, conocida como la 'Atenas Sudamericana'.", continente: "América" },
  { respuesta: "LIMA", pista: "Capital de Perú, fundada por Francisco Pizarro en 1535.", continente: "América" },
  { respuesta: "SANTIAGO", pista: "Capital de Chile, a los pies de la cordillera de los Andes.", continente: "América" },
  { respuesta: "BRASILIA", pista: "Capital de Brasil, diseñada desde cero e inaugurada en 1960.", continente: "América" },
  { respuesta: "LA HABANA", pista: "Capital de Cuba, famosa por sus autos clásicos de los años 50.", continente: "América" },
  { respuesta: "SAN JOSÉ", pista: "Capital de Costa Rica, en el Valle Central del país.", continente: "América" },
  { respuesta: "CIUDAD DE MÉXICO", pista: "Capital de México, una de las ciudades más pobladas del mundo.", continente: "América" },
  { respuesta: "WASHINGTON", pista: "Capital de Estados Unidos, nombrada por su primer presidente.", continente: "América" },
  { respuesta: "OTTAWA", pista: "Capital de Canadá, a orillas del río homónimo.", continente: "América" },
  { respuesta: "BUENOS AIRES", pista: "Capital de Argentina, cuna del tango.", continente: "América" },
  { respuesta: "MONTEVIDEO", pista: "Capital de Uruguay, a orillas del Río de la Plata.", continente: "América" },
  { respuesta: "QUITO", pista: "Capital de Ecuador, la segunda capital más alta del mundo.", continente: "América" },
  // Europa
  { respuesta: "MADRID", pista: "Capital de España, atravesada por el río Manzanares.", continente: "Europa" },
  { respuesta: "PARÍS", pista: "Capital de Francia, conocida como la Ciudad de la Luz.", continente: "Europa" },
  { respuesta: "ROMA", pista: "Capital de Italia, construida sobre siete colinas.", continente: "Europa" },
  { respuesta: "LONDRES", pista: "Capital del Reino Unido, a orillas del río Támesis.", continente: "Europa" },
  { respuesta: "BERLÍN", pista: "Capital de Alemania, dividida por un muro hasta 1989.", continente: "Europa" },
  { respuesta: "LISBOA", pista: "Capital de Portugal, junto a la desembocadura del río Tajo.", continente: "Europa" },
  { respuesta: "ATENAS", pista: "Capital de Grecia, cuna de la democracia.", continente: "Europa" },
  { respuesta: "ÁMSTERDAM", pista: "Capital de los Países Bajos, famosa por sus canales.", continente: "Europa" },
  { respuesta: "VIENA", pista: "Capital de Austria, ciudad donde compuso Mozart.", continente: "Europa" },
  { respuesta: "MOSCÚ", pista: "Capital de Rusia, sede del Kremlin y la Plaza Roja.", continente: "Europa" },
  // África
  { respuesta: "EL CAIRO", pista: "Capital de Egipto, cerca de las pirámides de Guiza.", continente: "África" },
  { respuesta: "NAIROBI", pista: "Capital de Kenia, puerta de entrada a los safaris africanos.", continente: "África" },
  { respuesta: "RABAT", pista: "Capital de Marruecos, a orillas del océano Atlántico.", continente: "África" },
  { respuesta: "JOHANNESBURGO", pista: "La ciudad más grande de Sudáfrica, llamada la 'Ciudad Dorada'.", continente: "África" },
  { respuesta: "CIUDAD DEL CABO", pista: "Ciudad sudafricana a los pies de la Montaña de la Mesa.", continente: "África" },
  { respuesta: "DAKAR", pista: "Capital de Senegal, el punto más occidental de África continental.", continente: "África" },
  { respuesta: "ACCRA", pista: "Capital de Ghana, a orillas del golfo de Guinea.", continente: "África" },
  // Asia
  { respuesta: "TOKIO", pista: "Capital de Japón, una de las áreas metropolitanas más pobladas del mundo.", continente: "Asia" },
  { respuesta: "PEKÍN", pista: "Capital de China, hogar de la Ciudad Prohibida.", continente: "Asia" },
  { respuesta: "NUEVA DELHI", pista: "Capital de la India, junto a la histórica ciudad de Delhi.", continente: "Asia" },
  { respuesta: "BANGKOK", pista: "Capital de Tailandia, conocida por sus templos budistas.", continente: "Asia" },
  { respuesta: "SEÚL", pista: "Capital de Corea del Sur, a orillas del río Han.", continente: "Asia" },
  { respuesta: "DUBÁI", pista: "La ciudad más poblada de los Emiratos Árabes Unidos, famosa por sus rascacielos.", continente: "Asia" },
  // Oceanía
  { respuesta: "CANBERRA", pista: "Capital de Australia, elegida como punto medio entre Sídney y Melbourne.", continente: "Oceanía" },
  { respuesta: "WELLINGTON", pista: "Capital de Nueva Zelanda, una de las capitales más australes del mundo.", continente: "Oceanía" },
];

/** Quita tildes y pasa a mayúsculas — así adivinar "A" también revela "Á". */
export function normalizarLetra(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase();
}

export function palabraAleatoria(): PalabraAhorcado {
  return BANCO_AHORCADO[Math.floor(Math.random() * BANCO_AHORCADO.length)];
}
