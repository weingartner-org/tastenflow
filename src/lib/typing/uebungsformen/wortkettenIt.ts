/**
 * ★ IT-W (03.10.2026): Wortketten nach Thema für Weg „it" - der Baustoff der Form „Hand-Schwerpunkte"
 * (*Mano sinistra, mano destra*; `handschwerpunkte.ts` filtert daraus die Wörter, die sich mit EINER Hand tippen lassen -
 * auf der Tastatur des Kindes, über `fingerForChar`). Neu auf Italienisch zusammengestellt, nicht übersetzt.
 *
 * Italienische Nomen werden nicht grossgeschrieben - wie im Französischen und Spanischen gibt es darum nur die
 * Schwerpunkte „links" und „rechts", nie „umschalt-*". Auf den QWERTY-Tastaturen hat die linke Hand nur die Vokale
 * `a e`, die rechte nur `i o u` - die Themen tragen darum bewusst Wörter, die einhändig sind:
 *  · links: *casa, carta, tasca, barca, festa, terra, erba, strada, estate, testa, sagra, sarta, abete, vetta, cresta,
 *    cassata, regata, gara, gatta, zebra, brezza* (z links auf QWERTY, rechts auf QWERTZ);
 *  · rechts: *olio, nonno, uomo, lupo, mulo, polipo, pollo, pino, pinolo, mulino, molo, lino, piumino, pulmino, kimono,
 *    lumino, piolo, limo*.
 * Die Zahlen je Tastatur (`it`, `it-qzerty`, `ch-fr` für das Tessin, `ch` für Graubünden, dazu `de`, `us`, `uk`) misst
 * der Wächter `tests/tastenflow-wortspiele-it.test.ts`; sie stehen im Befund `BEFUND-2026-10-02-IT-WORTSPIELE.md`.
 *
 * ⚠️ Kein Wort mit Akzent (à è é ì ò ù) und keines mit Apostroph: Die Akzentbuchstaben liegen auf `it` alle beim
 * rechten kleinen Finger, am Tessin und in Graubünden sind `ì ò ù` zwei Anschläge (Totaste, dann Vokal) - „einhändig"
 * liesse sich für sie nicht ehrlich sagen. Nichts aus der Sperrliste (`sperrlisteIt.ts`, Kern UND Wortbasis: darum kein
 * *uccello*, *banana*, *fico*, *patata*, *finocchio*) - und auch nicht *vacca* und *fava*, die nicht auf der Liste
 * stehen, aber regional einen zweiten, groben Sinn tragen (in einer Wortreihe ohne Zusammenhang ein Witz auf Kosten
 * des Kindes; die Kuh heisst hier *mucca*).
 */
import type { Wortkette } from "./wortkettenThemen";

const ALLE_STUFEN: Wortkette["stufen"] = ["kids", "teens", "erwachsen"];

export const WORTKETTEN_IT: Wortkette[] = [
  {
    thema: "Gli animali",
    woerter: ["gatto", "cane", "mucca", "lupo", "mulo", "zebra", "gatta", "polipo", "pollo", "cavallo", "coniglio", "volpe", "orso", "cervo", "riccio", "aquila", "delfino", "stambecco"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "La casa",
    woerter: ["casa", "sedia", "tavolo", "letto", "porta", "finestra", "cucina", "bagno", "scala", "terrazza", "divano", "armadio", "lampada", "specchio", "cassetto", "tetto", "stanza", "lumino"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "La scuola",
    woerter: ["quaderno", "matita", "penna", "gomma", "zaino", "lavagna", "banco", "classe", "libro", "astuccio", "righello", "carta", "maestra", "cartella", "pulmino", "compiti"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "A tavola",
    woerter: ["pasta", "pane", "pizza", "olio", "sale", "riso", "minestra", "frutta", "verdura", "formaggio", "polenta", "focaccia", "ricotta", "cassata", "pinolo", "uva", "mela", "pera"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Il mare",
    woerter: ["mare", "onda", "sabbia", "spiaggia", "barca", "vela", "conchiglia", "scoglio", "faro", "pesce", "porto", "isola", "molo", "secca", "rada", "gabbiano", "regata"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "La montagna",
    woerter: ["monte", "neve", "bosco", "rifugio", "sentiero", "cima", "valle", "lago", "roccia", "baita", "prato", "slitta", "abete", "vetta", "cresta", "piolo", "pino", "sterrata"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Il paese e la città",
    woerter: ["piazza", "strada", "fontana", "chiesa", "negozio", "mercato", "stazione", "ponte", "palazzo", "teatro", "museo", "bar", "edicola", "farmacia", "mulino", "biblioteca"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Il tempo e le stagioni",
    woerter: ["sole", "pioggia", "vento", "neve", "nebbia", "nuvola", "temporale", "estate", "inverno", "autunno", "primavera", "caldo", "freddo", "gelo", "brezza", "afa", "tramonto"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "La famiglia",
    woerter: ["mamma", "babbo", "nonno", "nonna", "zio", "zia", "fratello", "sorella", "cugino", "cugina", "figlio", "figlia", "nipote", "bimbo", "uomo", "donna", "famiglia"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Il corpo",
    woerter: ["testa", "occhio", "naso", "bocca", "mano", "braccio", "gamba", "piede", "dito", "collo", "cuore", "pancia", "schiena", "ginocchio", "spalla", "pelle", "denti"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Lo sport",
    woerter: ["calcio", "pallone", "tennis", "nuoto", "sci", "corsa", "bici", "squadra", "partita", "gara", "salto", "pista", "arbitro", "palestra", "canoa", "judo", "kimono"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Le feste",
    woerter: ["festa", "regalo", "torta", "candela", "presepe", "befana", "carnevale", "maschera", "palio", "sagra", "musica", "ballo", "fuochi", "pasqua", "uovo", "dolci", "banda"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "I mestieri",
    woerter: ["cuoco", "fornaio", "maestra", "medico", "pilota", "pescatore", "contadino", "gelataio", "pizzaiolo", "idraulico", "sarta", "barbiere", "postino", "pompiere", "autista", "pastore"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "La natura",
    woerter: ["albero", "fiore", "erba", "foglia", "ramo", "radice", "seme", "fiume", "prato", "sasso", "terra", "limo", "lino", "castagna", "fungo", "nocciola"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "I vestiti",
    woerter: ["maglia", "gonna", "piumino", "giacca", "camicia", "sciarpa", "cappello", "guanti", "calze", "scarpe", "pantaloni", "felpa", "tuta", "stivali", "cappotto", "pigiama", "tasca"],
    stufen: ALLE_STUFEN,
  },
];
