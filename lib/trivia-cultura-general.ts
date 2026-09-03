import type { PreguntaTrivia } from "./onboarding-data";
import { shuffle, shuffleOpciones } from "./trivia-bank";

export const RETO_CULTURA_GENERAL_CONFIG = { cantidad: 20 };

/** Banco de cultura general (mundial, no atado a un país) para el reto compartible
 * de la sección Retos. Pool más grande que `cantidad` para variar entre repeticiones. */
const BANCO_CULTURA_GENERAL: PreguntaTrivia[] = [
  { categoria: "Geografía", pregunta: "¿Cuál es el río más largo del mundo?", opciones: ["Nilo", "Amazonas", "Yangtsé", "Misisipi"], correctaIndex: 1, fuente: "Wikidata", dificultad: "medio" },
  { categoria: "Geografía", pregunta: "¿Cuál es el país más grande del mundo por área?", opciones: ["Rusia", "Canadá", "China", "Estados Unidos"], correctaIndex: 0, fuente: "Wikidata", dificultad: "facil" },
  { categoria: "Geografía", pregunta: "¿Cuál es el desierto más grande del mundo?", opciones: ["Sahara", "Gobi", "Antártida", "Kalahari"], correctaIndex: 2, fuente: "Wikipedia", dificultad: "dificil" },
  { categoria: "Geografía", pregunta: "¿Cuál es la montaña más alta del mundo?", opciones: ["K2", "Everest", "Kilimanjaro", "Aconcagua"], correctaIndex: 1, fuente: "Wikidata", dificultad: "facil" },
  { categoria: "Geografía", pregunta: "¿Qué océano es el más grande del planeta?", opciones: ["Atlántico", "Índico", "Pacífico", "Ártico"], correctaIndex: 2, fuente: "Wikidata", dificultad: "facil" },
  { categoria: "Geografía", pregunta: "¿Cuál es la capital de Japón?", opciones: ["Tokio", "Kioto", "Osaka", "Seúl"], correctaIndex: 0, fuente: "Wikidata", dificultad: "facil" },
  { categoria: "Geografía", pregunta: "¿En qué continente está Egipto?", opciones: ["Asia", "África", "Europa", "Oceanía"], correctaIndex: 1, fuente: "Wikidata", dificultad: "facil" },
  { categoria: "Historia", pregunta: "¿En qué año terminó la Segunda Guerra Mundial?", opciones: ["1943", "1945", "1948", "1950"], correctaIndex: 1, fuente: "Wikipedia", dificultad: "facil" },
  { categoria: "Historia", pregunta: "¿Qué antigua civilización construyó las pirámides de Giza?", opciones: ["Los mayas", "Los egipcios", "Los romanos", "Los griegos"], correctaIndex: 1, fuente: "Wikipedia", dificultad: "facil" },
  { categoria: "Historia", pregunta: "¿En qué año cayó el Muro de Berlín?", opciones: ["1985", "1989", "1991", "1993"], correctaIndex: 1, fuente: "Wikipedia", dificultad: "medio" },
  { categoria: "Historia", pregunta: "¿Quién fue el primer hombre en pisar la Luna?", opciones: ["Buzz Aldrin", "Neil Armstrong", "Yuri Gagarin", "John Glenn"], correctaIndex: 1, fuente: "NASA", dificultad: "facil" },
  { categoria: "Historia", pregunta: "¿Qué imperio construyó el Coliseo de Roma?", opciones: ["Imperio Romano", "Imperio Bizantino", "Imperio Otomano", "Imperio Persa"], correctaIndex: 0, fuente: "Wikipedia", dificultad: "facil" },
  { categoria: "Cultura", pregunta: "¿Quién pintó la Mona Lisa?", opciones: ["Miguel Ángel", "Leonardo da Vinci", "Rafael", "Rembrandt"], correctaIndex: 1, fuente: "Wikipedia", dificultad: "facil" },
  { categoria: "Cultura", pregunta: "¿En qué idioma se escribió originalmente \"Romeo y Julieta\"?", opciones: ["Francés", "Italiano", "Inglés", "Alemán"], correctaIndex: 2, fuente: "Wikipedia", dificultad: "facil" },
  { categoria: "Cultura", pregunta: "¿Qué instrumento tiene 88 teclas?", opciones: ["Piano", "Órgano", "Acordeón", "Clavecín"], correctaIndex: 0, fuente: "Wikipedia", dificultad: "medio" },
  { categoria: "Cultura", pregunta: "¿Qué escritor creó a Sherlock Holmes?", opciones: ["Agatha Christie", "Arthur Conan Doyle", "Edgar Allan Poe", "Charles Dickens"], correctaIndex: 1, fuente: "Wikipedia", dificultad: "medio" },
  { categoria: "Cultura", pregunta: "¿En qué país se originó el origami?", opciones: ["China", "Japón", "Corea", "Tailandia"], correctaIndex: 1, fuente: "Wikipedia", dificultad: "facil" },
  { categoria: "Gastronomía", pregunta: "¿De qué país es originaria la pizza margarita?", opciones: ["Francia", "España", "Italia", "Grecia"], correctaIndex: 2, fuente: "Wikipedia", dificultad: "facil" },
  { categoria: "Gastronomía", pregunta: "¿Qué grano se usa para hacer el chocolate?", opciones: ["Café", "Cacao", "Vainilla", "Avellana"], correctaIndex: 1, fuente: "Wikipedia", dificultad: "facil" },
  { categoria: "Gastronomía", pregunta: "¿Qué país es el mayor productor mundial de café?", opciones: ["Colombia", "Brasil", "Vietnam", "Etiopía"], correctaIndex: 1, fuente: "FAO", dificultad: "medio" },
  { categoria: "Gastronomía", pregunta: "¿Cuál es el ingrediente principal del hummus?", opciones: ["Lentejas", "Garbanzos", "Frijoles", "Habas"], correctaIndex: 1, fuente: "Wikipedia", dificultad: "medio" },
  { categoria: "Naturaleza", pregunta: "¿Cuál es el animal terrestre más grande del mundo?", opciones: ["Rinoceronte", "Elefante africano", "Hipopótamo", "Jirafa"], correctaIndex: 1, fuente: "Wikipedia", dificultad: "facil" },
  { categoria: "Naturaleza", pregunta: "¿Cuál es el mamífero más grande del mundo?", opciones: ["Elefante africano", "Ballena azul", "Tiburón blanco", "Cachalote"], correctaIndex: 1, fuente: "Wikipedia", dificultad: "facil" },
  { categoria: "Naturaleza", pregunta: "¿Cuántos corazones tiene un pulpo?", opciones: ["1", "2", "3", "4"], correctaIndex: 2, fuente: "Wikipedia", dificultad: "dificil" },
  { categoria: "Naturaleza", pregunta: "¿Qué animal es el símbolo de Australia junto al koala?", opciones: ["Canguro", "Panda", "Oso polar", "Puma"], correctaIndex: 0, fuente: "Wikipedia", dificultad: "facil" },
  { categoria: "Naturaleza", pregunta: "¿Cuál es el felino más rápido del mundo?", opciones: ["León", "Guepardo", "Tigre", "Puma"], correctaIndex: 1, fuente: "Wikipedia", dificultad: "facil" },
  { categoria: "Deportes", pregunta: "¿Cada cuántos años se celebran los Juegos Olímpicos de verano?", opciones: ["2", "3", "4", "5"], correctaIndex: 2, fuente: "COI", dificultad: "facil" },
  { categoria: "Deportes", pregunta: "¿Cuántos jugadores tiene un equipo de fútbol en la cancha?", opciones: ["9", "10", "11", "12"], correctaIndex: 2, fuente: "FIFA", dificultad: "facil" },
  { categoria: "Deportes", pregunta: "¿En qué país se inventó el baloncesto?", opciones: ["Estados Unidos", "Canadá", "Inglaterra", "Francia"], correctaIndex: 0, fuente: "Wikipedia", dificultad: "medio" },
  { categoria: "Deportes", pregunta: "¿Cada cuántos años se juega el Mundial de fútbol?", opciones: ["2", "3", "4", "5"], correctaIndex: 2, fuente: "FIFA", dificultad: "facil" },
];

/** Selecciona `cantidad` preguntas al azar (sin repetir) con sus opciones barajadas. */
export function preguntasCulturaGeneral(cantidad = RETO_CULTURA_GENERAL_CONFIG.cantidad): PreguntaTrivia[] {
  return shuffle(BANCO_CULTURA_GENERAL).slice(0, Math.min(cantidad, BANCO_CULTURA_GENERAL.length)).map(shuffleOpciones);
}
