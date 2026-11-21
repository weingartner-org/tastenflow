/**
 * ★ PL-W (09.10.2026): Wortketten nach Thema für Weg „pl" - der Baustoff der Form „Hand-Schwerpunkte"
 * (*Lewa ręka, prawa ręka*; `handschwerpunkte.ts` filtert daraus die Wörter, die sich mit EINER Hand tippen lassen - auf der
 * Tastatur des Kindes, über `fingerForChar`). Neu auf Polnisch zusammengestellt, nicht übersetzt.
 *
 * Polnische Nomen werden nicht grossgeschrieben - wie im Italienischen, Französischen und Spanischen gibt es darum nur die
 * Schwerpunkte „links" und „rechts", nie „umschalt-*". Auf `pl` (QWERTY, „Polski (programisty)") hat die linke Hand die Vokale
 * `a e`, die rechte `i o u y` - die Themen tragen darum bewusst Wörter, die einhändig sind:
 *  · links: *trawa, brat, tata, sweter, zebra, zegar, deser, beret, agrest, rabarbar, barszcz, deszcz, szafa, taras, staw,
 *    sztafeta, start, teatr, gazeta, trasa, brzeg, warsztat* (z links auf QWERTY, rechts auf QWERTZ);
 *  · rechts: *okno, oko, kino, kilim, jojo, kulki, piknik, pompon, polo, molo, klon, mop, ul, mol, konik, pomnik, nylon*.
 * Die Zahlen je Tastatur (`pl`, dazu `us`, `uk`, `de`) misst der Wächter `tests/tastenflow-wortspiele-pl.test.ts`; sie stehen
 * im Befund `BEFUND-2026-10-09-PL-WORTSPIELE.md`.
 *
 * ⚠️ Kein Wort mit einem polnischen Buchstaben (ą ć ę ł ń ó ś ź ż): Sie liegen auf `pl` hinter dem RECHTEN Alt - ein
 * „linkshändiges" *żaba* bräuchte den rechten Daumen; „einhändig" liesse sich für sie nicht ehrlich sagen. (Die Form ist
 * darum keine Übung der polnischen Buchstaben - die üben Lückentext, Korrekturlesen, Salat und Geläufigkeit.)
 * Nichts aus der Sperrliste (`sperrlistePl.ts`, Kern UND Wortbasis) - und auch keine Tiernamen, die im Polnischen als
 * Schimpfwort gegen Menschen dienen (*krowa, świnia, osioł, baran, małpa, koza, gęś*): In einer Wortreihe ohne
 * Zusammenhang stünden sie da wie ein Witz auf Kosten des Kindes. Im Lückentext, mit Zusammenhang, steht *krowa* (sie gibt
 * Milch).
 */
import type { Wortkette } from "./wortkettenThemen";

const ALLE_STUFEN: Wortkette["stufen"] = ["kids", "teens", "erwachsen"];

export const WORTKETTEN_PL: Wortkette[] = [
  {
    thema: "Zwierzęta",
    woerter: ["kot", "pies", "kotek", "sowa", "mysz", "zebra", "tygrys", "wilk", "lis", "sarna", "kret", "kaczka", "kura", "bocian", "foka", "delfin", "pingwin", "kangur", "konik", "chomik", "mol"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Dom",
    woerter: ["dom", "okno", "drzwi", "szafa", "lampa", "dywan", "kilim", "kanapa", "lustro", "wanna", "kuchnia", "taras", "strych", "schody", "dach", "komin", "balkon", "mop"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Szkoła",
    woerter: ["klasa", "tablica", "zeszyt", "plecak", "kreda", "gumka", "linijka", "kredki", "przerwa", "lekcja", "test", "dzwonek", "boisko", "mapa", "globus", "atlas", "kartka"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Przy stole",
    woerter: ["chleb", "ser", "zupa", "barszcz", "pierogi", "makaron", "kasza", "sok", "herbata", "mleko", "kotlet", "bigos", "sernik", "piernik", "rabarbar", "agrest", "beza", "deser", "kompot"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Nad morzem",
    woerter: ["morze", "piasek", "fala", "statek", "port", "molo", "latarnia", "mewa", "bursztyn", "wydma", "rybak", "jacht", "kajak", "ponton", "muszla", "brzeg", "sztorm"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "W górach",
    woerter: ["szczyt", "szlak", "schronisko", "skala", "potok", "las", "kozica", "baca", "oscypek", "hala", "wodospad", "plecak", "mapa", "lina", "kijek", "dolina", "trasa"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Pogoda i pory roku",
    woerter: ["deszcz", "burza", "grad", "wiatr", "szron", "chmura", "zima", "wiosna", "lato", "susza", "termometr", "parasol", "mrozik", "kalosze", "upalny", "wichura"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Rodzina",
    woerter: ["mama", "tata", "brat", "siostra", "babcia", "dziadek", "wujek", "ciocia", "kuzyn", "kuzynka", "synek", "rodzina", "wnuk", "wnuczka", "rodzice", "dzieci", "niemowlak"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Ciało",
    woerter: ["oko", "ucho", "nos", "usta", "noga", "palec", "kolano", "brzuch", "plecy", "serce", "szyja", "stopa", "broda", "kciuk", "ramiona", "policzek"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Sport",
    woerter: ["bramka", "mecz", "gol", "start", "meta", "trener", "sztafeta", "rower", "narty", "sanki", "basen", "tenis", "judo", "karate", "kajak", "polo", "hokej", "rekord", "medal", "puchar"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Zabawa",
    woerter: ["jojo", "kulki", "lalka", "klocki", "piknik", "pompon", "latawiec", "karuzela", "gra", "puzzle", "plastelina", "bajka", "teatr", "kino", "balon", "misiek", "skakanka"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Zawody",
    woerter: ["lekarz", "kucharz", "piekarz", "rolnik", "kierowca", "pilot", "listonosz", "fryzjer", "malarz", "krawiec", "rybak", "aktor", "muzyk", "sprzedawca", "nauczyciel", "informatyk", "weterynarz"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Przyroda",
    woerter: ["drzewo", "las", "kwiat", "trawa", "rzeka", "potok", "staw", "klon", "lipa", "brzoza", "sosna", "grzyb", "mech", "krzak", "kora", "jezioro", "bagno", "ul"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Ubrania",
    woerter: ["czapka", "szalik", "kurtka", "sweter", "beret", "buty", "skarpety", "spodnie", "sukienka", "koszula", "bluza", "polo", "nylon", "dres", "kapelusz", "fartuch"],
    stufen: ALLE_STUFEN,
  },
  {
    thema: "Miasto i wieś",
    woerter: ["ulica", "rynek", "tramwaj", "autobus", "dworzec", "sklep", "park", "most", "teatr", "kino", "gazeta", "zegar", "warsztat", "plac", "rondo", "pomnik", "stragan"],
    stufen: ALLE_STUFEN,
  },
];
