/**
 * ★ ES-W (27.09.2026): Wortketten nach Thema für Weg „es" - der Baustoff der
 * Form „Hand-Schwerpunkte" (`handschwerpunkte.ts` filtert daraus die Wörter,
 * die sich mit EINER Hand tippen lassen - auf der Tastatur des Kindes, über
 * `fingerForChar`). Neu auf Spanisch zusammengestellt, nicht übersetzt.
 *
 * Spanische Nomen werden nicht grossgeschrieben - wie im Französischen gibt
 * es darum nur die Schwerpunkte „links" und „rechts", nie „umschalt-*". Die
 * Themen tragen bewusst viele Wörter, die auf den spanischen Tastaturen
 * (Spanien und Lateinamerika, beide QWERTY) einhändig sind - links: *vaca,
 * cabra, cebra, fresa, tarta, taza, tres, trece, tarde, tarea, carta, verde,
 * desde*; rechts: *mono, pulpo, ñu, ojo, puño, polo, kimono, julio, junio,
 * uno, mil, himno, humo, pino* - und ebenso genug für QWERTZ (dort tauschen
 * y und z die Hand).
 *
 * ⚠️ Kein Wort mit Akzent (á é í ó ú) oder ü: Das sind Totasten-Zeichen -
 * zwei Anschläge, und der Akzent liegt immer beim rechten kleinen Finger.
 * „Einhändig" liesse sich für sie nicht ehrlich sagen. ñ ist eine eigene
 * Taste und bleibt. Nichts aus der Sperrliste
 * (`scripts/messe-worthaeufigkeit-es.py`: kein *pollo*, *coche*, *chaqueta*,
 * *gafas* …).
 */
import type { Wortkette } from "./wortkettenThemen";

const ALLE_STUFEN: Wortkette["stufen"] = ["kids", "teens", "erwachsen"];

export const WORTKETTEN_ES: Wortkette[] = [
  {
    thema: "Los animales",
    woerter: ["gato", "perro", "vaca", "cabra", "cebra", "mono", "pulpo", "oso", "lobo", "rana", "tigre", "caballo", "gallina", "conejo", "ballena", "ave", "aves", "ñu"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Los animales de América",
    woerter: ["llama", "puma", "jaguar", "alpaca", "vicuña", "tapir", "iguana", "armadillo", "coyote", "loro", "ajolote", "quetzal", "guacamayo", "capibara", "chinchilla"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "La comida",
    woerter: ["fresa", "tarta", "pan", "arroz", "queso", "sal", "cereza", "trigo", "sopa", "fruta", "carne", "huevo", "papa", "tomate", "lomo", "mojo", "arepa", "taco", "mango", "pera"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "La casa",
    woerter: ["casa", "puerta", "mesa", "silla", "cama", "techo", "pared", "piso", "cocina", "taza", "vaso", "plato", "cesta", "llave", "pomo", "ventana", "escalera"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "El cuerpo",
    woerter: ["ojo", "ojos", "mano", "pie", "dedo", "brazo", "pierna", "cara", "boca", "nariz", "cuello", "espalda", "puño", "codo", "hombro", "rodilla", "diente", "pelo", "piel"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "La ropa",
    woerter: ["polo", "kimono", "gorra", "falda", "camisa", "abrigo", "bufanda", "guante", "zapato", "botas", "vestido", "camiseta", "gorro", "poncho", "sombrero"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "El tiempo",
    woerter: ["lunes", "martes", "jueves", "viernes", "domingo", "enero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "tarde", "noche", "hoy", "mes", "semana", "verano"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "La naturaleza",
    woerter: ["flor", "hoja", "tierra", "piedra", "viento", "lluvia", "nieve", "sol", "luna", "estrella", "lago", "mar", "monte", "humo", "pino", "selva", "desierto", "playa"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "La escuela",
    woerter: ["clase", "libro", "regla", "goma", "mochila", "tarea", "carta", "texto", "lectura", "cuaderno", "pizarra", "papel", "tijeras", "letra", "recreo", "patio"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Los números",
    woerter: ["uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve", "diez", "once", "doce", "trece", "catorce", "quince", "cien", "mil"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "La música y el juego",
    woerter: ["piano", "guitarra", "tambor", "flauta", "canto", "nota", "ritmo", "himno", "coro", "voz", "pelota", "equipo", "carrera", "salto", "tenis", "gol", "baile", "charango"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Los colores",
    woerter: ["verde", "gris", "azul", "rojo", "rosa", "negro", "blanco", "amarillo", "morado", "naranja", "violeta", "celeste", "dorado", "plateado"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Las palabras cortas",
    woerter: ["de", "es", "esta", "este", "desde", "tras", "cada", "sabe", "va", "yo", "mi", "no", "un", "ni", "lo", "muy", "con", "por", "para", "pero"],
    stufen: ALLE_STUFEN,
  },
];
