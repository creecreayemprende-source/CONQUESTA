import type { Categoria } from "./onboarding-data";

/** Dato curioso real por país + categoría — se muestra en la "postal" antes de
 * empezar esa categoría por primera vez, para romper el ritmo de "solo
 * preguntas" con algo de ambiente/narrativa. No hace preguntas, solo informa. */
export const POSTALES: Record<string, Partial<Record<Categoria, string>>> = {
  Colombia: {
    Geografía: "Colombia es el único país de Sudamérica con costas en el océano Pacífico y en el mar Caribe al mismo tiempo.",
    Historia: "Bogotá fue fundada en 1538 sobre el altiplano donde antes vivía el pueblo muisca.",
    Cultura: "El Carnaval de Barranquilla es uno de los más grandes del mundo y Patrimonio de la Humanidad de la UNESCO.",
    Gastronomía: "La bandeja paisa reúne en un solo plato frijoles, arroz, carne, chicharrón, huevo, plátano y arepa.",
    Naturaleza: "Colombia es el segundo país con más biodiversidad del planeta, después de Brasil.",
    Deportes: "El ciclismo es uno de los deportes más queridos en Colombia — el país ha tenido campeones del Tour de Francia.",
  },
  Perú: {
    Geografía: "Perú tiene tres regiones muy distintas: la costa desértica, la sierra andina y la selva amazónica.",
    Historia: "Machu Picchu fue construida por los incas en el siglo XV y permaneció oculta para el mundo exterior hasta 1911.",
    Cultura: "El quechua, la lengua de los incas, todavía lo hablan millones de personas en Perú hoy en día.",
    Gastronomía: "El ceviche peruano se prepara marinando pescado crudo en jugo de limón — hoy es Patrimonio Cultural de la Nación.",
    Naturaleza: "La Amazonía peruana alberga miles de especies de aves, más que en toda Norteamérica junta.",
    Deportes: "El vóleibol es uno de los deportes más populares entre las mujeres en Perú.",
  },
  Chile: {
    Geografía: "Chile es el país más largo del mundo de norte a sur — más de 4.000 km de longitud.",
    Historia: "La Isla de Pascua, territorio chileno, es famosa por sus enormes estatuas moái talladas hace siglos.",
    Cultura: "Pablo Neruda, poeta chileno, ganó el Premio Nobel de Literatura en 1971.",
    Gastronomía: "El pastel de choclo es un plato tradicional chileno hecho con maíz molido y relleno de carne.",
    Naturaleza: "El desierto de Atacama, en el norte de Chile, es uno de los lugares más secos del planeta.",
    Deportes: "El esquí es un deporte popular en Chile gracias a sus centros invernales en plena cordillera de los Andes.",
  },
  Brasil: {
    Geografía: "Brasil es el país más grande de Sudamérica y ocupa casi la mitad del territorio del continente.",
    Historia: "Brasilia, la capital de Brasil, fue construida desde cero e inaugurada en 1960 para ser la nueva capital del país.",
    Cultura: "El Carnaval de Río de Janeiro es uno de los eventos más famosos del mundo, con desfiles de samba.",
    Gastronomía: "La feijoada, un guiso de frijoles negros con carne de cerdo, es considerada el plato nacional de Brasil.",
    Naturaleza: "La selva amazónica cubre más de la mitad del territorio brasileño y es hogar de una biodiversidad inmensa.",
    Deportes: "Brasil es el único país que ha jugado todos los Mundiales de fútbol desde que existe el torneo.",
  },
  Cuba: {
    Geografía: "Cuba es la isla más grande del Caribe y está formada por más de 4.000 islas y cayos pequeños.",
    Historia: "La Habana Vieja, el centro histórico de la capital cubana, es Patrimonio de la Humanidad desde 1982.",
    Cultura: "El son cubano, mezcla de ritmos africanos y españoles, es la raíz de géneros como la salsa.",
    Gastronomía: "El congrí, arroz cocinado junto a frijoles negros, es uno de los platos más representativos de Cuba.",
    Naturaleza: "Cuba tiene más de 300 playas de arena blanca a lo largo de sus costas.",
    Deportes: "El béisbol es el deporte más popular en Cuba, con una tradición que lleva más de un siglo.",
  },
  "Costa Rica": {
    Geografía: "Costa Rica no tiene ejército desde 1949 y destina esos recursos a educación y salud.",
    Historia: "Costa Rica fue una de las últimas colonias españolas en independizarse, en 1821, junto al resto de Centroamérica.",
    Cultura: "La expresión 'pura vida' es el saludo y la filosofía de vida más conocida de los costarricenses.",
    Gastronomía: "El gallo pinto, arroz con frijoles, es el desayuno tradicional más típico de Costa Rica.",
    Naturaleza: "Aunque ocupa solo el 0.03% de la superficie terrestre, Costa Rica alberga cerca del 5% de la biodiversidad del planeta.",
    Deportes: "El fútbol es el deporte más popular de Costa Rica, que ha clasificado varias veces al Mundial.",
  },
};

export function postalDe(pais: string, categoria: Categoria): string | undefined {
  return POSTALES[pais]?.[categoria];
}
