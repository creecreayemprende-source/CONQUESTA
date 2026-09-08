export interface TemaSopaLetras {
  pais: string;
  /** Palabras SIN tildes (convención de sopa de letras) — el orden en este
   * array no importa, `palabrasPorNivel()` siempre las ordena de más corta a
   * más larga antes de recortar por dificultad. */
  palabras: string[];
  sabiasQue: string;
}

export const TEMAS_SOPA_LETRAS: TemaSopaLetras[] = [
  {
    pais: "Colombia",
    palabras: ["CAFE", "ANDES", "CARIBE", "CONDOR", "PACIFICO", "ESMERALDA", "VALLENATO", "ORQUIDEA", "AMAZONAS", "CARNAVAL"],
    sabiasQue:
      "Colombia es el único país de Sudamérica con costas en el océano Pacífico y en el mar Caribe al mismo tiempo.",
  },
  {
    pais: "Perú",
    palabras: ["NAZCA", "INCAS", "ANDES", "ALPACA", "CEVICHE", "QUECHUA", "TITICACA", "AMAZONIA", "MACHUPICCHU", "CONDOR"],
    sabiasQue:
      "Machu Picchu fue construida por los incas en el siglo XV y permaneció oculta para el mundo exterior hasta 1911.",
  },
  {
    pais: "Chile",
    palabras: ["MOAI", "ANDES", "PASCUA", "VOLCAN", "NERUDA", "ATACAMA", "PINGUINO", "VENDIMIA", "PATAGONIA", "TERREMOTO"],
    sabiasQue: "Chile es el país más largo del mundo de norte a sur — más de 4.000 km de longitud.",
  },
  {
    pais: "Brasil",
    palabras: ["SAMBA", "SON", "FUTBOL", "IGUAZU", "CRISTO", "BRASILIA", "AMAZONAS", "CARNAVAL", "FEIJOADA", "PANTANAL"],
    sabiasQue:
      "El Carnaval de Río de Janeiro es uno de los eventos más famosos del mundo, con desfiles de samba en el Sambódromo.",
  },
  {
    pais: "Cuba",
    palabras: ["SALSA", "HABANA", "MOJITO", "TABACO", "CONGRI", "CARIBE", "MALECON", "VARADERO", "REVOLUCION", "SON"],
    sabiasQue:
      "La Habana Vieja, el centro histórico de la capital cubana, es Patrimonio de la Humanidad desde 1982.",
  },
  {
    pais: "Costa Rica",
    palabras: ["CACAO", "ARENAL", "BOSQUE", "VOLCAN", "TORTUGA", "QUETZAL", "PEREZOSO", "PURAVIDA", "GALLOPINTO", "BIODIVERSIDAD"],
    sabiasQue:
      "Aunque ocupa solo el 0.03% de la superficie terrestre, Costa Rica alberga cerca del 5% de la biodiversidad del planeta.",
  },
];

export function temaDePais(pais: string): TemaSopaLetras | undefined {
  return TEMAS_SOPA_LETRAS.find((t) => t.pais === pais);
}
