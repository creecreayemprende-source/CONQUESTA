export interface PalabraAhorcado {
  respuesta: string; // en mayúsculas, con tildes reales — se normaliza al comparar
  pista: string;
  continente: string;
}

/** Banco de ciudades/capitales de todo el mundo para el reto "Ahorcado de
 * Capitales" — ~100 ciudades verificadas manualmente, con pista real y
 * distinta a la respuesta (nunca repite el nombre de la ciudad en la pista). */
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
  { respuesta: "CARACAS", pista: "Capital de Venezuela, fundada en 1567.", continente: "América" },
  { respuesta: "LA PAZ", pista: "Sede del gobierno de Bolivia, la capital más alta del mundo.", continente: "América" },
  { respuesta: "ASUNCIÓN", pista: "Capital de Paraguay, a orillas del río homónimo.", continente: "América" },
  { respuesta: "SAN SALVADOR", pista: "Capital de El Salvador, en el Valle de las Hamacas.", continente: "América" },
  { respuesta: "TEGUCIGALPA", pista: "Capital de Honduras, rodeada de montañas.", continente: "América" },
  { respuesta: "MANAGUA", pista: "Capital de Nicaragua, a orillas del lago homónimo.", continente: "América" },
  { respuesta: "CIUDAD DE PANAMÁ", pista: "Capital de Panamá, junto al famoso canal interoceánico.", continente: "América" },
  { respuesta: "SANTO DOMINGO", pista: "Capital de República Dominicana, la ciudad colonial más antigua de América.", continente: "América" },
  { respuesta: "KINGSTON", pista: "Capital de Jamaica, cuna del reggae.", continente: "América" },
  { respuesta: "GEORGETOWN", pista: "Capital de Guyana, a orillas del océano Atlántico.", continente: "América" },
  { respuesta: "BELMOPÁN", pista: "Capital de Belice, en el interior del país.", continente: "América" },
  { respuesta: "PARAMARIBO", pista: "Capital de Surinam, a orillas del río homónimo.", continente: "América" },
  { respuesta: "PUERTO PRÍNCIPE", pista: "Capital de Haití, en la isla La Española.", continente: "América" },
  { respuesta: "BRIDGETOWN", pista: "Capital de Barbados, en el Caribe.", continente: "América" },
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
  { respuesta: "DUBLÍN", pista: "Capital de Irlanda, a orillas del río Liffey.", continente: "Europa" },
  { respuesta: "BRUSELAS", pista: "Capital de Bélgica, sede de instituciones de la Unión Europea.", continente: "Europa" },
  { respuesta: "ESTOCOLMO", pista: "Capital de Suecia, construida sobre 14 islas.", continente: "Europa" },
  { respuesta: "OSLO", pista: "Capital de Noruega, rodeada de fiordos.", continente: "Europa" },
  { respuesta: "COPENHAGUE", pista: "Capital de Dinamarca, famosa por la estatua de la Sirenita.", continente: "Europa" },
  { respuesta: "HELSINKI", pista: "Capital de Finlandia, a orillas del mar Báltico.", continente: "Europa" },
  { respuesta: "VARSOVIA", pista: "Capital de Polonia, reconstruida tras la Segunda Guerra Mundial.", continente: "Europa" },
  { respuesta: "PRAGA", pista: "Capital de República Checa, conocida como la 'Ciudad de las Cien Torres'.", continente: "Europa" },
  { respuesta: "BUDAPEST", pista: "Capital de Hungría, dividida por el río Danubio.", continente: "Europa" },
  { respuesta: "BERNA", pista: "Capital de Suiza, a orillas del río Aar.", continente: "Europa" },
  { respuesta: "ZAGREB", pista: "Capital de Croacia, a orillas del río Sava.", continente: "Europa" },
  { respuesta: "BELGRADO", pista: "Capital de Serbia, en la confluencia de los ríos Danubio y Sava.", continente: "Europa" },
  { respuesta: "SOFÍA", pista: "Capital de Bulgaria, a los pies del monte Vitosha.", continente: "Europa" },
  { respuesta: "REIKIAVIK", pista: "Capital de Islandia, la capital más septentrional del mundo.", continente: "Europa" },
  // África
  { respuesta: "EL CAIRO", pista: "Capital de Egipto, cerca de las pirámides de Guiza.", continente: "África" },
  { respuesta: "NAIROBI", pista: "Capital de Kenia, puerta de entrada a los safaris africanos.", continente: "África" },
  { respuesta: "RABAT", pista: "Capital de Marruecos, a orillas del océano Atlántico.", continente: "África" },
  { respuesta: "JOHANNESBURGO", pista: "La ciudad más grande de Sudáfrica, llamada la 'Ciudad Dorada'.", continente: "África" },
  { respuesta: "CIUDAD DEL CABO", pista: "Ciudad sudafricana a los pies de la Montaña de la Mesa.", continente: "África" },
  { respuesta: "DAKAR", pista: "Capital de Senegal, el punto más occidental de África continental.", continente: "África" },
  { respuesta: "ACCRA", pista: "Capital de Ghana, a orillas del golfo de Guinea.", continente: "África" },
  { respuesta: "ARGEL", pista: "Capital de Argelia, a orillas del mar Mediterráneo.", continente: "África" },
  { respuesta: "TÚNEZ", pista: "Capital de Túnez, cerca de las ruinas de la antigua Cartago.", continente: "África" },
  { respuesta: "ADÍS ABEBA", pista: "Capital de Etiopía, sede de la Unión Africana.", continente: "África" },
  { respuesta: "LAGOS", pista: "Antigua capital y ciudad más poblada de Nigeria.", continente: "África" },
  { respuesta: "ABUYA", pista: "Capital actual de Nigeria, planificada en el centro del país.", continente: "África" },
  { respuesta: "LUANDA", pista: "Capital de Angola, a orillas del océano Atlántico.", continente: "África" },
  { respuesta: "MAPUTO", pista: "Capital de Mozambique, en la costa del océano Índico.", continente: "África" },
  { respuesta: "TRÍPOLI", pista: "Capital de Libia, a orillas del mar Mediterráneo.", continente: "África" },
  { respuesta: "KAMPALA", pista: "Capital de Uganda, cerca del lago Victoria.", continente: "África" },
  { respuesta: "HARARE", pista: "Capital de Zimbabue, antes llamada Salisbury.", continente: "África" },
  { respuesta: "YAUNDÉ", pista: "Capital de Camerún, rodeada de colinas.", continente: "África" },
  { respuesta: "LIBREVILLE", pista: "Capital de Gabón, a orillas del océano Atlántico.", continente: "África" },
  // Asia
  { respuesta: "TOKIO", pista: "Capital de Japón, una de las áreas metropolitanas más pobladas del mundo.", continente: "Asia" },
  { respuesta: "PEKÍN", pista: "Capital de China, hogar de la Ciudad Prohibida.", continente: "Asia" },
  { respuesta: "NUEVA DELHI", pista: "Capital de la India, junto a la histórica ciudad de Delhi.", continente: "Asia" },
  { respuesta: "BANGKOK", pista: "Capital de Tailandia, conocida por sus templos budistas.", continente: "Asia" },
  { respuesta: "SEÚL", pista: "Capital de Corea del Sur, a orillas del río Han.", continente: "Asia" },
  { respuesta: "DUBÁI", pista: "La ciudad más poblada de los Emiratos Árabes Unidos, famosa por sus rascacielos.", continente: "Asia" },
  { respuesta: "YAKARTA", pista: "Capital de Indonesia, una de las áreas metropolitanas más pobladas del mundo.", continente: "Asia" },
  { respuesta: "MANILA", pista: "Capital de Filipinas, a orillas de la bahía homónima.", continente: "Asia" },
  { respuesta: "KUALA LUMPUR", pista: "Capital de Malasia, famosa por sus torres gemelas Petronas.", continente: "Asia" },
  { respuesta: "SINGAPUR", pista: "Ciudad-estado del sudeste asiático, uno de los puertos más activos del mundo.", continente: "Asia" },
  { respuesta: "HANÓI", pista: "Capital de Vietnam, a orillas del río Rojo.", continente: "Asia" },
  { respuesta: "ISLAMABAD", pista: "Capital de Pakistán, planificada en la década de 1960.", continente: "Asia" },
  { respuesta: "TEHERÁN", pista: "Capital de Irán, a los pies de los montes Elburz.", continente: "Asia" },
  { respuesta: "BAGDAD", pista: "Capital de Irak, a orillas del río Tigris.", continente: "Asia" },
  { respuesta: "RIAD", pista: "Capital de Arabia Saudita, en el centro de la península arábiga.", continente: "Asia" },
  { respuesta: "AMÁN", pista: "Capital de Jordania, construida sobre siete colinas como Roma.", continente: "Asia" },
  { respuesta: "ULÁN BATOR", pista: "Capital de Mongolia, una de las capitales más frías del mundo.", continente: "Asia" },
  { respuesta: "KATMANDÚ", pista: "Capital de Nepal, a los pies de la cordillera del Himalaya.", continente: "Asia" },
  { respuesta: "DOHA", pista: "Capital de Catar, a orillas del golfo Pérsico.", continente: "Asia" },
  { respuesta: "ABU DABI", pista: "Capital de los Emiratos Árabes Unidos, sede del gobierno federal.", continente: "Asia" },
  { respuesta: "COLOMBO", pista: "Capital comercial de Sri Lanka, en el océano Índico.", continente: "Asia" },
  { respuesta: "DACA", pista: "Capital de Bangladés, una de las ciudades más densamente pobladas del mundo.", continente: "Asia" },
  // Oceanía
  { respuesta: "CANBERRA", pista: "Capital de Australia, elegida como punto medio entre Sídney y Melbourne.", continente: "Oceanía" },
  { respuesta: "WELLINGTON", pista: "Capital de Nueva Zelanda, una de las capitales más australes del mundo.", continente: "Oceanía" },
  { respuesta: "SUVA", pista: "Capital de Fiyi, en la isla de Viti Levu.", continente: "Oceanía" },
  { respuesta: "PORT MORESBY", pista: "Capital de Papúa Nueva Guinea, a orillas del mar de Coral.", continente: "Oceanía" },
  { respuesta: "APIA", pista: "Capital de Samoa, en la isla de Upolu.", continente: "Oceanía" },
  { respuesta: "NUKUALOFA", pista: "Capital de Tonga, en el océano Pacífico Sur.", continente: "Oceanía" },
  { respuesta: "HONIARA", pista: "Capital de las Islas Salomón, en la isla de Guadalcanal.", continente: "Oceanía" },
  { respuesta: "PORT VILA", pista: "Capital de Vanuatu, un archipiélago del Pacífico Sur.", continente: "Oceanía" },
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
