/**
 * ★ ES-W (27.09.2026): „Korrekturlesen" auf Weg „es" (*Corrección*) - in
 * jedem Satz steht ein falsches, ECHTES spanisches Wort, das man deutlich
 * anders hört (Johannes 02.09.2026: der Fehler muss hörbar sein) und das im
 * Satz offensichtlich nicht stimmt. Neu auf Spanisch geschrieben, nicht
 * übersetzt.
 *
 * ⚠️ Im Spanischen klingen viele Buchstaben gleich - ein Paar, das sich nur
 * darin unterscheidet, ist für eine Sprachausgabe UNHÖRBAR und wäre eine
 * Aufgabe gegen das Kind: `b/v` (*vaca/baca, tubo/tuvo*), stummes `h`
 * (*ola/hola, echo/hecho*), `ll/y` (*valla/vaya*, Yeísmo), `s/z/c` vor e/i
 * (*casa/caza, ciento/siento*, Seseo in ganz Lateinamerika), `g/j` vor e/i.
 * Der Wächter rechnet dafür einen Lautschlüssel.
 *
 * ★ Hörbar ist dagegen der AKZENT, wenn er die Betonung verschiebt:
 * *papa/papá, sabana/sábana, llego/llegó, numero/número, canto/cantó,
 * medico/médico* - beim Vorlesen liegt die Betonung auf einer anderen Silbe.
 * Einsilbige Paare (*el/él, tu/tú, mas/más*) sind dagegen gleich betont und
 * darum nicht dabei.
 *
 * ⚠️ Nicht *bebe/bebé*: am Río de la Plata ist *el bebe / la beba* die
 * normale Form (DPD) - der „Fehler" wäre dort keiner (Prüfung 27.09.2026).
 * Ein falsches Wort muss in ALLEN Ländern falsch sein.
 */
import type { Korrekturfall } from "./korrekturlesen";

export const KORREKTUR_ES: readonly Korrekturfall[] = [
  { satz: "Vivimos en una masa muy grande.", falsch: "masa", richtig: "casa" },
  { satz: "Comemos todos juntos alrededor de la pesa.", falsch: "pesa", richtig: "mesa" },
  { satz: "Las abejas fabrican la piel.", falsch: "piel", richtig: "miel" },
  { satz: "Los pájaros vuelan alto en el suelo.", falsch: "suelo", richtig: "cielo" },
  { satz: "En invierno cae mucha nueve en la montaña.", falsch: "nueve", richtig: "nieve" },
  { satz: "Por la mañana bebo la leche de una casa.", falsch: "casa", richtig: "taza" },
  { satz: "El conejo tiene las orejas largas y la bola muy corta.", falsch: "bola", richtig: "cola" },
  { satz: "La jirafa estira su largo pañuelo.", falsch: "pañuelo", richtig: "cuello" },
  { satz: "Para dibujar uso un tapiz de colores.", falsch: "tapiz", richtig: "lápiz" },
  { satz: "Mi hermano juega al fútbol con un salón.", falsch: "salón", richtig: "balón" },
  { satz: "Me despierto a las siete de la manzana.", falsch: "manzana", richtig: "mañana" },
  { satz: "Una semana tiene siete guías.", falsch: "guías", richtig: "días" },
  { satz: "Un año tiene doce veces.", falsch: "veces", richtig: "meses" },
  { satz: "La vaca nos da noche.", falsch: "noche", richtig: "leche" },
  { satz: "Me lavo los dientes con pasta y un pepino.", falsch: "pepino", richtig: "cepillo" },
  { satz: "De noche vemos la luna y las botellas.", falsch: "botellas", richtig: "estrellas" },
  { satz: "El barquito flota tranquilo en el pago.", falsch: "pago", richtig: "lago" },
  { satz: "Hace frío, así que me pongo el abrazo.", falsch: "abrazo", richtig: "abrigo" },
  { satz: "En el mercado compramos manzanas y presas.", falsch: "presas", richtig: "fresas" },
  { satz: "La maestra escribe la fecha en la cigarra.", falsch: "cigarra", richtig: "pizarra" },
  { satz: "El jardinero riega las torres del jardín.", falsch: "torres", richtig: "flores" },
  { satz: "Los bomberos apagan el juego.", falsch: "juego", richtig: "fuego" },
  { satz: "El panadero saca el pan del torno.", falsch: "torno", richtig: "horno" },
  { satz: "El tren llega puntual a la canción.", falsch: "canción", richtig: "estación" },
  { satz: "El pescador atrapa un pie muy grande.", falsch: "pie", richtig: "pez" },
  { satz: "Para abrir la puerta necesito la calle.", falsch: "calle", richtig: "llave" },
  // Der Akzent verschiebt die Betonung - hörbar (siehe Kopf).
  { satz: "Mi papa me lleva cada día a la escuela.", falsch: "papa", richtig: "papá" },
  { satz: "Por la noche me tapo con una sabana.", falsch: "sabana", richtig: "sábana" },
  { satz: "Ayer mi prima llego a casa muy contenta.", falsch: "llego", richtig: "llegó" },
  { satz: "Mi numero favorito es el siete.", falsch: "numero", richtig: "número" },
  { satz: "Ayer el gallo canto muy temprano.", falsch: "canto", richtig: "cantó" },
  { satz: "El medico me revisa la garganta.", falsch: "medico", richtig: "médico" },
];
