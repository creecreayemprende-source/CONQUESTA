export interface TemaSopaLetras {
  tema: string;
  /** Las 7 palabras del tema, SIN tildes (convención de sopa de letras). */
  palabras: string[];
  sabiasQue: string;
}

/** 50 sopas de letras de cultura general — contenido provisto por el usuario
 * (documento "50 Sopas de Letras.docx", 2026-09-08), 7 palabras verificadas +
 * 1 dato curioso real por tema. */
export const TEMAS_SOPA_LETRAS: TemaSopaLetras[] = [
  { tema: "Planetas", palabras: ["MERCURIO", "VENUS", "TIERRA", "MARTE", "JUPITER", "SATURNO", "NEPTUNO"], sabiasQue: "Júpiter es el planeta más grande del sistema solar." },
  { tema: "Egipto antiguo", palabras: ["FARAON", "NILO", "PIRAMIDE", "ESFINGE", "MOMIA", "TEMPLO", "SARCOFAGO"], sabiasQue: "Las pirámides de Guiza son una de las Siete Maravillas del mundo antiguo." },
  { tema: "Grandes océanos", palabras: ["PACIFICO", "ATLANTICO", "INDICO", "ARTICO", "ANTARTICO", "CORAL", "MAR"], sabiasQue: "El Pacífico es el océano más grande de la Tierra." },
  { tema: "Continentes", palabras: ["AFRICA", "AMERICA", "EUROPA", "ASIA", "OCEANIA", "ANTARTIDA", "TIERRA"], sabiasQue: "Asia es el continente con mayor población." },
  { tema: "Maravillas del mundo", palabras: ["CHICHENITZA", "PETRA", "MACHUPICCHU", "COLISEO", "TAJMAHAL", "MURALLA", "CRISTO"], sabiasQue: "La Gran Muralla China es un enorme sistema de fortificaciones, no una sola muralla continua." },
  { tema: "Grecia antigua", palabras: ["ATENAS", "ESPARTA", "ZEUS", "OLIMPO", "FILOSOFIA", "TEMPLO", "DEMOCRACIA"], sabiasQue: "La democracia ateniense fue una de las primeras formas conocidas de democracia." },
  { tema: "Roma", palabras: ["ROMA", "CESAR", "SENADO", "COLISEO", "LEGION", "IMPERIO", "GLADIADOR"], sabiasQue: "El Coliseo podía albergar a decenas de miles de espectadores." },
  { tema: "Civilización Maya", palabras: ["MAYA", "TEMPLO", "CALENDARIO", "PIRAMIDE", "CHICHENITZA", "CACAO", "ASTRONOMIA"], sabiasQue: "Los mayas desarrollaron complejos conocimientos astronómicos y calendáricos." },
  { tema: "Incas", palabras: ["INCA", "CUZCO", "ANDES", "MACHUPICCHU", "QUIPU", "LLAMA", "PACHACUTEC"], sabiasQue: "Los quipus eran sistemas de cuerdas y nudos utilizados para registrar información." },
  { tema: "Vikingos", palabras: ["VIKINGO", "DRAKKAR", "ODIN", "THOR", "RUNAS", "FIORDO", "ESCUDO"], sabiasQue: "Los vikingos utilizaban barcos muy avanzados para su época." },
  { tema: "Leonardo da Vinci", palabras: ["LEONARDO", "MONALISA", "INVENTOR", "PINTOR", "GENIO", "ANATOMIA", "FLORENCIA"], sabiasQue: "Leonardo da Vinci estudió arte, ingeniería, anatomía y muchas otras disciplinas." },
  { tema: "Grandes pintores", palabras: ["PICASSO", "MONET", "REMBRANDT", "DALI", "GOYA", "VANGOGH", "MIGUELANGEL"], sabiasQue: "Van Gogh se convirtió posteriormente en uno de los artistas más famosos de la historia." },
  { tema: "Música clásica", palabras: ["MOZART", "BEETHOVEN", "BACH", "CHOPIN", "VIVALDI", "VERDI", "HAYDN"], sabiasQue: "Mozart compuso su primera obra musical siendo todavía niño." },
  { tema: "Instrumentos musicales", palabras: ["PIANO", "VIOLIN", "GUITARRA", "TROMPETA", "FLAUTA", "ARPA", "SAXOFON"], sabiasQue: "El piano moderno tiene más de 200 años de evolución." },
  { tema: "Literatura mundial", palabras: ["SHAKESPEARE", "CERVANTES", "HOMERO", "DANTE", "GOETHE", "DICKENS", "TOLSTOI"], sabiasQue: "Don Quijote es considerada una de las obras fundamentales de la literatura universal." },
  { tema: "Grandes inventos", palabras: ["IMPRENTA", "TELEFONO", "RADIO", "BOMBILLA", "AVION", "MOTOR", "INTERNET"], sabiasQue: "La imprenta de tipos móviles aceleró enormemente la difusión del conocimiento en Europa." },
  { tema: "Inventores famosos", palabras: ["TESLA", "EDISON", "BELL", "WATT", "GUTENBERG", "WRIGHT", "MARCONI"], sabiasQue: "Los hermanos Wright realizaron uno de los primeros vuelos controlados y motorizados de la historia." },
  { tema: "Espacio", palabras: ["ASTRONAUTA", "COHETE", "ORBITA", "LUNA", "MARTE", "GALAXIA", "COMETA"], sabiasQue: "La Luna es el único cuerpo celeste fuera de la Tierra que ha sido visitado por seres humanos." },
  { tema: "Sistema solar", palabras: ["SOL", "MERCURIO", "VENUS", "TIERRA", "MARTE", "URANO", "NEPTUNO"], sabiasQue: "El Sol concentra aproximadamente el 99,8% de la masa del sistema solar." },
  { tema: "Animales sorprendentes", palabras: ["PULPO", "JIRAFA", "ELEFANTE", "MURCIELAGO", "DELFIN", "CAMALEON", "ORNITORRINCO"], sabiasQue: "El pulpo tiene tres corazones." },
  { tema: "Animales extremos", palabras: ["GUEPARDO", "HALCON", "BALLENA", "AVESTRUZ", "TORTUGA", "ELEFANTE", "HORMIGA"], sabiasQue: "El guepardo es uno de los animales terrestres más veloces." },
  { tema: "Océano profundo", palabras: ["BALLENA", "TIBURON", "CALAMAR", "MEDUSA", "CORAL", "PULPO", "ABISMO"], sabiasQue: "El océano profundo sigue siendo uno de los ambientes menos explorados de nuestro planeta." },
  { tema: "Amazonía", palabras: ["AMAZONAS", "JAGUAR", "ANACONDA", "TUCAN", "PIRARUCU", "PEREZOSO", "GUACAMAYO"], sabiasQue: "La Amazonía alberga una enorme proporción de la biodiversidad terrestre." },
  { tema: "África", palabras: ["SAHARA", "NILO", "SAFARI", "LEON", "ELEFANTE", "SERENGETI", "KILIMANJARO"], sabiasQue: "El Sahara es el desierto cálido más grande del mundo." },
  { tema: "Asia", palabras: ["HIMALAYA", "CHINA", "INDIA", "JAPON", "TIGRE", "SEDA", "BUDA"], sabiasQue: "El Himalaya alberga el monte Everest, la montaña más alta sobre el nivel del mar." },
  { tema: "Europa", palabras: ["ALPES", "PARIS", "ROMA", "MADRID", "DANUBIO", "COLISEO", "ACROPOLIS"], sabiasQue: "Europa es uno de los continentes más pequeños por superficie." },
  { tema: "América Latina", palabras: ["ANDES", "AMAZONAS", "TANGO", "SALSA", "CAFE", "CARNAVAL", "MACHUPICCHU"], sabiasQue: "La cordillera de los Andes es la cordillera continental más larga del mundo." },
  { tema: "Colombia", palabras: ["CAFE", "CUMBIA", "ANDES", "AMAZONAS", "CARIBE", "ESMERALDA", "CONDOR"], sabiasQue: "Colombia es uno de los países con mayor diversidad de aves del mundo." },
  { tema: "México", palabras: ["AZTECA", "MAYA", "TACOS", "TEQUILA", "CHOCOLATE", "CHICHENITZA", "AGAVE"], sabiasQue: "El cacao fue utilizado por antiguas civilizaciones mesoamericanas mucho antes del chocolate moderno." },
  { tema: "Brasil", palabras: ["AMAZONAS", "SAMBA", "CARNAVAL", "RIO", "FUTBOL", "CAPOEIRA", "PANTANAL"], sabiasQue: "Brasil es el país más grande de Sudamérica." },
  { tema: "Japón", palabras: ["TOKIO", "SAMURAI", "SUSHI", "KIMONO", "SAKURA", "FUJI", "SUMO"], sabiasQue: "El monte Fuji es uno de los símbolos más reconocibles de Japón." },
  { tema: "Francia", palabras: ["PARIS", "EIFFEL", "LOUVRE", "CROISSANT", "VERSALLES", "MODA", "QUESO"], sabiasQue: "La Torre Eiffel fue construida para la Exposición Universal de París de 1889." },
  { tema: "Italia", palabras: ["ROMA", "VENECIA", "PIZZA", "PASTA", "COLISEO", "LEONARDO", "VESUBIO"], sabiasQue: "La pizza moderna está estrechamente asociada con Nápoles." },
  { tema: "España", palabras: ["MADRID", "FLAMENCO", "PAELLA", "GAUDI", "QUIJOTE", "ALHAMBRA", "SEVILLA"], sabiasQue: "El flamenco es una de las expresiones culturales más reconocidas de España." },
  { tema: "Grecia y sus dioses", palabras: ["ZEUS", "HERA", "ATENEA", "APOLO", "ARES", "AFRODITA", "POSEIDON"], sabiasQue: "Los antiguos griegos tenían numerosos dioses y relatos mitológicos para explicar el mundo." },
  { tema: "Mitología nórdica", palabras: ["ODIN", "THOR", "LOKI", "FREYA", "VALHALLA", "ASGARD", "MJOLNIR"], sabiasQue: "Thor era asociado con el trueno en la mitología nórdica." },
  { tema: "Mitología egipcia", palabras: ["RA", "ANUBIS", "ISIS", "OSIRIS", "HORUS", "BASTET", "SOBEK"], sabiasQue: "Los antiguos egipcios asociaban a muchos dioses con animales y fuerzas de la naturaleza." },
  { tema: "Cuerpo humano", palabras: ["CEREBRO", "CORAZON", "PULMON", "HIGADO", "RINON", "HUESO", "MUSCULO"], sabiasQue: "El cuerpo humano adulto tiene normalmente 206 huesos." },
  { tema: "Grandes científicos", palabras: ["EINSTEIN", "NEWTON", "CURIE", "DARWIN", "GALILEO", "TESLA", "PASTEUR"], sabiasQue: "Marie Curie fue la primera persona en recibir dos premios Nobel en diferentes ciencias." },
  { tema: "Descubrimientos científicos", palabras: ["GRAVEDAD", "EVOLUCION", "ADN", "ELECTRICIDAD", "VACUNA", "CELULA", "RELATIVIDAD"], sabiasQue: "El ADN contiene las instrucciones genéticas utilizadas en el desarrollo y funcionamiento de los organismos." },
  { tema: "Inventos que cambiaron el mundo", palabras: ["RUEDA", "PAPEL", "IMPRENTA", "BRUJULA", "MOTOR", "AVION", "INTERNET"], sabiasQue: "La brújula transformó la navegación al permitir orientarse mediante el campo magnético terrestre." },
  { tema: "Grandes exploradores", palabras: ["COLON", "MAGALLANES", "MARCOPOLO", "COOK", "AMUNDSEN", "LIVINGSTONE", "POLO"], sabiasQue: "La expedición de Magallanes y Elcano realizó la primera vuelta al mundo." },
  { tema: "Geografía extrema", palabras: ["EVEREST", "SAHARA", "AMAZONAS", "ANTARTIDA", "PACIFICO", "ANDES", "MARMUERTO"], sabiasQue: "El Everest es el punto más alto de la superficie terrestre sobre el nivel del mar." },
  { tema: "Récords naturales", palabras: ["EVEREST", "AMAZONAS", "PACIFICO", "SAHARA", "SEQUOIA", "BALLENA", "GUEPARDO"], sabiasQue: "La ballena azul es el animal más grande conocido que ha existido." },
  { tema: "Premios Nobel", palabras: ["NOBEL", "FISICA", "QUIMICA", "MEDICINA", "LITERATURA", "PAZ", "ECONOMIA"], sabiasQue: "Los primeros premios Nobel fueron entregados en 1901." },
  { tema: "Democracia y sociedad", palabras: ["DEMOCRACIA", "VOTO", "LEY", "DERECHOS", "CIUDADANO", "JUSTICIA", "CONSTITUCION"], sabiasQue: "La palabra democracia proviene del griego y se relaciona con el poder del pueblo." },
  { tema: "Dinero y economía", palabras: ["DINERO", "AHORRO", "BANCO", "CREDITO", "INVERSION", "MONEDA", "MERCADO"], sabiasQue: "El dinero cumple funciones como medio de intercambio, unidad de cuenta y reserva de valor." },
  { tema: "Comunicación", palabras: ["RADIO", "TELEVISION", "TELEFONO", "PRENSA", "SATELITE", "INTERNET", "MENSAJE"], sabiasQue: "Internet permite conectar redes de computadoras de todo el mundo." },
  { tema: "Grandes ciudades", palabras: ["TOKIO", "PARIS", "LONDRES", "NUEVAYORK", "CAIRO", "ROMA", "SIDNEY"], sabiasQue: "Tokio es una de las mayores áreas metropolitanas del mundo." },
  { tema: "Curiosidades del mundo", palabras: ["PIRAMIDE", "VOLCAN", "DESIERTO", "ISLA", "GLACIAR", "ARRECIFE", "CATARATA"], sabiasQue: "El agua cubre aproximadamente el 71% de la superficie de la Tierra." },
];
