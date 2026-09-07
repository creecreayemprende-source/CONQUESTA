export interface Souvenir {
  pais: string;
  nombre: string;
  icono: "Coffee" | "Landmark" | "Wine" | "PartyPopper" | "Music" | "Leaf";
  dato: string;
}

/** Un souvenir real por país — se desbloquea al conquistar el Reto Final de
 * ese país (mismo momento que el sello verde del pasaporte). Solo países con
 * bandera real construida (ver CountryFlag.tsx) tienen souvenir por ahora. */
export const SOUVENIRS: Souvenir[] = [
  {
    pais: "Colombia",
    nombre: "Café de Colombia",
    icono: "Coffee",
    dato: "Colombia es reconocida mundialmente por la calidad de su café de altura, cultivado en las laderas de los Andes.",
  },
  {
    pais: "Perú",
    nombre: "Machu Picchu",
    icono: "Landmark",
    dato: "Machu Picchu fue construida por los incas en el siglo XV y permaneció oculta para el mundo exterior hasta 1911.",
  },
  {
    pais: "Chile",
    nombre: "Vino chileno",
    icono: "Wine",
    dato: "Chile es uno de los mayores exportadores de vino del mundo, gracias a los valles a los pies de la cordillera de los Andes.",
  },
  {
    pais: "Brasil",
    nombre: "Carnaval de Río",
    icono: "PartyPopper",
    dato: "El Carnaval de Río de Janeiro es uno de los eventos más famosos del mundo, con desfiles de samba en el Sambódromo.",
  },
  {
    pais: "Cuba",
    nombre: "Son cubano",
    icono: "Music",
    dato: "El son cubano, mezcla de ritmos africanos y españoles, es la raíz de géneros como la salsa.",
  },
  {
    pais: "Costa Rica",
    nombre: "Pura Vida",
    icono: "Leaf",
    dato: "Aunque ocupa solo el 0.03% de la superficie terrestre, Costa Rica alberga cerca del 5% de la biodiversidad del planeta.",
  },
];

export function souvenirDePais(pais: string): Souvenir | undefined {
  return SOUVENIRS.find((s) => s.pais === pais);
}
